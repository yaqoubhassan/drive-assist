<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ExpertLeadResource;
use App\Http\Resources\ExpertProfileResource;
use App\Http\Resources\ReviewResource;
use App\Models\ExpertProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ExpertController extends ApiController
{
    /**
     * Get all experts (public).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $query = ExpertProfile::with(['user', 'specialties', 'reviews'])
                ->verified();

            // Filter by location
            if ($request->filled('latitude') && $request->filled('longitude')) {
                $radius = $request->input('radius', 25);
                $query->nearby(
                    $request->input('latitude'),
                    $request->input('longitude'),
                    $radius
                );
            }

            // Filter by specialty
            if ($request->filled('specialty')) {
                $query->withSpecialty($request->input('specialty'));
            }

            // Filter by minimum rating
            if ($request->filled('min_rating')) {
                $query->withMinRating($request->input('min_rating'));
            }

            // Filter by open now
            if ($request->boolean('open_now')) {
                $query->openNow();
            }

            $experts = $query->paginate($request->input('per_page', 12));

            return $this->successResponse([
                'data' => ExpertProfileResource::collection($experts->items()),
                'pagination' => [
                    'total' => $experts->total(),
                    'per_page' => $experts->perPage(),
                    'current_page' => $experts->currentPage(),
                    'last_page' => $experts->lastPage(),
                ],
            ], 'Experts retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get a specific expert (public).
     *
     * @param ExpertProfile $expert
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(ExpertProfile $expert)
    {
        try {
            $expert->load(['user', 'specialties', 'reviews.driver']);
            $expert->incrementViews();

            return $this->successResponse(
                new ExpertProfileResource($expert),
                'Expert retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get expert dashboard data (authenticated expert).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function dashboard(Request $request)
    {
        try {
            $expertProfile = $request->user()->expertProfile;

            if (!$expertProfile) {
                return $this->errorResponse('Expert profile not found', 404);
            }

            $data = [
                'profile' => new ExpertProfileResource($expertProfile->load(['specialties', 'kyc'])),
                'statistics' => [
                    'total_jobs' => $expertProfile->total_jobs,
                    'avg_rating' => $expertProfile->avg_rating,
                    'profile_views' => $expertProfile->profile_views,
                    'new_leads_count' => $expertProfile->leads()->where('status', 'new')->count(),
                    'active_jobs_count' => $expertProfile->jobs()->whereIn('job_status', ['pending', 'in_progress'])->count(),
                    'total_reviews' => $expertProfile->reviews()->count(),
                ],
                'recent_leads' => ExpertLeadResource::collection(
                    $expertProfile->leads()->with(['driver', 'diagnosis'])->latest()->take(5)->get()
                ),
                'recent_reviews' => ReviewResource::collection(
                    $expertProfile->reviews()->with('driver')->latest()->take(5)->get()
                ),
            ];

            return $this->successResponse($data, 'Dashboard data retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Update expert profile (authenticated expert).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        try {
            $expertProfile = $request->user()->expertProfile;

            if (!$expertProfile) {
                return $this->errorResponse('Expert profile not found', 404);
            }

            $validated = $request->validate([
                'business_name' => 'sometimes|required|string|max:255',
                'business_type' => 'sometimes|required|string|in:mechanic,body_shop,tire_shop,auto_electrician,mobile_mechanic',
                'bio' => 'nullable|string|max:1000',
                'years_experience' => 'nullable|integer|min:0|max:100',
                'employee_count' => 'nullable|integer|min:1',
                'business_license_number' => 'nullable|string|max:255',
                'insurance_policy_number' => 'nullable|string|max:255',
                'service_radius_km' => 'nullable|integer|min:1|max:200',
                'hourly_rate_min' => 'nullable|numeric|min:0',
                'hourly_rate_max' => 'nullable|numeric|min:0',
                'diagnostic_fee' => 'nullable|numeric|min:0',
                'accepts_emergency' => 'nullable|boolean',
            ]);

            $expertProfile->update($validated);

            return $this->successResponse(
                new ExpertProfileResource($expertProfile->fresh(['specialties', 'kyc'])),
                'Profile updated successfully'
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get expert leads (authenticated expert).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLeads(Request $request)
    {
        try {
            $expertProfile = $request->user()->expertProfile;

            if (!$expertProfile) {
                return $this->errorResponse('Expert profile not found', 404);
            }

            $query = $expertProfile->leads()->with(['driver', 'diagnosis']);

            // Filter by status
            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            $leads = $query->latest()->paginate($request->input('per_page', 15));

            return $this->successResponse([
                'data' => ExpertLeadResource::collection($leads->items()),
                'pagination' => [
                    'total' => $leads->total(),
                    'per_page' => $leads->perPage(),
                    'current_page' => $leads->currentPage(),
                    'last_page' => $leads->lastPage(),
                ],
            ], 'Leads retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get expert reviews (authenticated expert).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getReviews(Request $request)
    {
        try {
            $expertProfile = $request->user()->expertProfile;

            if (!$expertProfile) {
                return $this->errorResponse('Expert profile not found', 404);
            }

            $reviews = $expertProfile->reviews()
                ->with(['driver', 'images'])
                ->latest()
                ->paginate($request->input('per_page', 15));

            return $this->successResponse([
                'data' => ReviewResource::collection($reviews->items()),
                'pagination' => [
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                ],
                'statistics' => [
                    'average_rating' => $expertProfile->avg_rating,
                    'total_reviews' => $reviews->total(),
                ],
            ], 'Reviews retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Contact an expert (create lead).
     *
     * @param Request $request
     * @param ExpertProfile $expert
     * @return \Illuminate\Http\JsonResponse
     */
    public function contact(Request $request, ExpertProfile $expert)
    {
        try {
            $validated = $request->validate([
                'diagnosis_id' => 'nullable|exists:diagnoses,id',
                'driver_name' => 'required|string|max:255',
                'driver_email' => 'required|email|max:255',
                'driver_phone' => 'required|string|max:20',
                'message' => 'required|string|max:1000',
                'preferred_contact_method' => 'required|in:phone,email,either',
                'best_time_to_contact' => 'nullable|string|max:255',
            ]);

            $lead = $expert->leads()->create([
                'driver_id' => $request->user()?->id,
                'driver_name' => $validated['driver_name'],
                'driver_email' => $validated['driver_email'],
                'driver_phone' => $validated['driver_phone'],
                'message' => $validated['message'],
                'preferred_contact_method' => $validated['preferred_contact_method'],
                'best_time_to_contact' => $validated['best_time_to_contact'] ?? null,
                'diagnosis_id' => $validated['diagnosis_id'] ?? null,
                'status' => 'new',
            ]);

            return $this->createdResponse(
                new ExpertLeadResource($lead),
                'Your message has been sent to the expert'
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }
}
