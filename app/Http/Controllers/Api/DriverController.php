<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\DiagnosisResource;
use App\Http\Resources\ExpertProfileResource;
use App\Http\Resources\MaintenanceReminderResource;
use App\Http\Resources\VehicleResource;
use App\Models\ExpertProfile;
use App\Models\MaintenanceReminder;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class DriverController extends ApiController
{
    /**
     * Get driver dashboard data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dashboard(Request $request)
    {
        try {
            $user = $request->user();

            $data = [
                'recent_diagnoses' => DiagnosisResource::collection(
                    $user->diagnoses()->with(['vehicle', 'images'])->latest()->take(5)->get()
                ),
                'favorite_experts' => ExpertProfileResource::collection(
                    $user->favoriteExperts()->with(['user', 'specialties'])->take(6)->get()
                ),
                'upcoming_reminders' => MaintenanceReminderResource::collection(
                    $user->vehicles()->with('maintenanceReminders')->get()
                        ->flatMap->maintenanceReminders
                        ->where('is_completed', false)
                        ->where('due_date', '>=', now())
                        ->sortBy('due_date')
                        ->take(5)
                ),
                'statistics' => [
                    'total_diagnoses' => $user->diagnoses()->count(),
                    'total_vehicles' => $user->vehicles()->count(),
                    'pending_reminders' => MaintenanceReminder::whereHas('vehicle', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })->where('is_completed', false)->count(),
                ],
            ];

            return $this->successResponse($data, 'Dashboard data retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get all vehicles.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVehicles(Request $request)
    {
        try {
            $vehicles = $request->user()->vehicles()->with('maintenanceReminders')->get();

            return $this->successResponse(
                VehicleResource::collection($vehicles),
                'Vehicles retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Create a new vehicle.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createVehicle(Request $request)
    {
        try {
            $validated = $request->validate([
                'make' => 'required|string|max:255',
                'model' => 'required|string|max:255',
                'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'vin' => 'nullable|string|max:17',
                'mileage' => 'nullable|integer|min:0',
                'fuel_type' => 'nullable|string|in:gasoline,diesel,electric,hybrid',
                'transmission_type' => 'nullable|string|in:manual,automatic',
            ]);

            $vehicle = $request->user()->vehicles()->create($validated);

            return $this->createdResponse(
                new VehicleResource($vehicle),
                'Vehicle added successfully'
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Update a vehicle.
     *
     * @param Request $request
     * @param Vehicle $vehicle
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateVehicle(Request $request, Vehicle $vehicle)
    {
        try {
            // Authorization check
            if ($vehicle->user_id !== $request->user()->id) {
                return $this->forbiddenResponse('Unauthorized to update this vehicle.');
            }

            $validated = $request->validate([
                'make' => 'sometimes|required|string|max:255',
                'model' => 'sometimes|required|string|max:255',
                'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
                'vin' => 'nullable|string|max:17',
                'mileage' => 'nullable|integer|min:0',
                'fuel_type' => 'nullable|string|in:gasoline,diesel,electric,hybrid',
                'transmission_type' => 'nullable|string|in:manual,automatic',
            ]);

            $vehicle->update($validated);

            return $this->successResponse(
                new VehicleResource($vehicle->fresh()),
                'Vehicle updated successfully'
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Delete a vehicle.
     *
     * @param Request $request
     * @param Vehicle $vehicle
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteVehicle(Request $request, Vehicle $vehicle)
    {
        try {
            // Authorization check
            if ($vehicle->user_id !== $request->user()->id) {
                return $this->forbiddenResponse('Unauthorized to delete this vehicle.');
            }

            $vehicle->delete();

            return $this->successResponse(null, 'Vehicle deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get favorite experts.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFavorites(Request $request)
    {
        try {
            $favorites = $request->user()
                ->favoriteExperts()
                ->with(['user', 'specialties', 'reviews'])
                ->paginate($request->input('per_page', 12));

            return $this->successResponse([
                'data' => ExpertProfileResource::collection($favorites->items()),
                'pagination' => [
                    'total' => $favorites->total(),
                    'per_page' => $favorites->perPage(),
                    'current_page' => $favorites->currentPage(),
                    'last_page' => $favorites->lastPage(),
                ],
            ], 'Favorites retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Toggle expert favorite.
     *
     * @param Request $request
     * @param ExpertProfile $expert
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleFavorite(Request $request, ExpertProfile $expert)
    {
        try {
            $user = $request->user();

            if ($user->hasFavorited($expert)) {
                $user->removeFromFavorites($expert);
                $message = 'Expert removed from favorites';
                $isFavorited = false;
            } else {
                $user->addToFavorites($expert);
                $message = 'Expert added to favorites';
                $isFavorited = true;
            }

            return $this->successResponse([
                'is_favorited' => $isFavorited,
            ], $message);
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get maintenance reminders.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getReminders(Request $request)
    {
        try {
            $query = MaintenanceReminder::whereHas('vehicle', function ($q) use ($request) {
                $q->where('user_id', $request->user()->id);
            })->with('vehicle');

            // Filter by status
            if ($request->filled('status')) {
                if ($request->input('status') === 'pending') {
                    $query->where('is_completed', false);
                } elseif ($request->input('status') === 'completed') {
                    $query->where('is_completed', true);
                }
            }

            $reminders = $query->orderBy('due_date')->paginate($request->input('per_page', 15));

            return $this->successResponse([
                'data' => MaintenanceReminderResource::collection($reminders->items()),
                'pagination' => [
                    'total' => $reminders->total(),
                    'per_page' => $reminders->perPage(),
                    'current_page' => $reminders->currentPage(),
                    'last_page' => $reminders->lastPage(),
                ],
            ], 'Reminders retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Create a maintenance reminder.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createReminder(Request $request)
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|exists:vehicles,id',
                'reminder_type' => 'required|string|max:255',
                'due_date' => 'nullable|date',
                'due_mileage' => 'nullable|integer|min:0',
                'description' => 'nullable|string|max:500',
            ]);

            // Verify vehicle belongs to user
            $vehicle = Vehicle::where('id', $validated['vehicle_id'])
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $reminder = MaintenanceReminder::create($validated);

            return $this->createdResponse(
                new MaintenanceReminderResource($reminder->load('vehicle')),
                'Reminder created successfully'
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Mark reminder as completed.
     *
     * @param Request $request
     * @param MaintenanceReminder $reminder
     * @return \Illuminate\Http\JsonResponse
     */
    public function completeReminder(Request $request, MaintenanceReminder $reminder)
    {
        try {
            // Verify reminder belongs to user's vehicle
            if ($reminder->vehicle->user_id !== $request->user()->id) {
                return $this->forbiddenResponse('Unauthorized to complete this reminder.');
            }

            $reminder->markAsCompleted();

            return $this->successResponse(
                new MaintenanceReminderResource($reminder->fresh('vehicle')),
                'Reminder marked as completed'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Delete a maintenance reminder.
     *
     * @param Request $request
     * @param MaintenanceReminder $reminder
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteReminder(Request $request, MaintenanceReminder $reminder)
    {
        try {
            // Verify reminder belongs to user's vehicle
            if ($reminder->vehicle->user_id !== $request->user()->id) {
                return $this->forbiddenResponse('Unauthorized to delete this reminder.');
            }

            $reminder->delete();

            return $this->successResponse(null, 'Reminder deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }
}
