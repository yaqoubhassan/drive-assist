<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverDashboardController extends Controller
{
    /**
     * Display the driver dashboard
     */
    public function index(): Response
    {
        $user = auth()->user();

        return Inertia::render('Driver/Dashboard', [
            'user' => $user,
            'recentDiagnoses' => $user->diagnoses()
                ->latest()
                ->take(5)
                ->get(),
            'favoriteExperts' => $user->favoriteExperts()
                ->take(6)
                ->get(),
            'upcomingReminders' => $user->maintenanceReminders()
                ->where('is_completed', false)
                ->where('due_date', '>=', now())
                ->orderBy('due_date')
                ->take(5)
                ->get(),
        ]);
    }

    /**
     * Display diagnosis history
     */
    public function diagnoses(): Response
    {
        $diagnoses = auth()->user()
            ->diagnoses()
            ->with('vehicle')
            ->latest()
            ->paginate(20);

        return Inertia::render('Driver/Diagnoses/Index', [
            'diagnoses' => $diagnoses,
        ]);
    }

    /**
     * Show a specific diagnosis
     */
    public function showDiagnosis($id): Response
    {
        $diagnosis = auth()->user()
            ->diagnoses()
            ->with(['vehicle', 'images'])
            ->findOrFail($id);

        return Inertia::render('Driver/Diagnoses/Show', [
            'diagnosis' => $diagnosis,
        ]);
    }

    /**
     * Delete a diagnosis
     */
    public function deleteDiagnosis($id)
    {
        $diagnosis = auth()->user()
            ->diagnoses()
            ->findOrFail($id);

        $diagnosis->delete();

        return redirect()
            ->route('driver.diagnoses.index')
            ->with('success', 'Diagnosis deleted successfully.');
    }

    /**
     * Display favorite experts
     */
    public function favorites(): Response
    {
        $favorites = auth()->user()
            ->favoriteExperts()
            ->with(['user', 'specialties'])
            ->paginate(12);

        return Inertia::render('Driver/Favorites', [
            'favorites' => $favorites,
        ]);
    }

    /**
     * Toggle expert favorite
     */
    public function toggleFavorite($expertId)
    {
        $user = auth()->user();

        $isFavorited = $user->favoriteExperts()->where('expert_profile_id', $expertId)->exists();

        if ($isFavorited) {
            $user->favoriteExperts()->detach($expertId);
            $message = 'Removed from favorites';
        } else {
            $user->favoriteExperts()->attach($expertId);
            $message = 'Added to favorites';
        }

        return back()->with('success', $message);
    }

    /**
     * Display vehicles
     */
    public function vehicles(): Response
    {
        $vehicles = auth()->user()
            ->vehicles()
            ->latest()
            ->get();

        return Inertia::render('Driver/Vehicles/Index', [
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Store a new vehicle
     */
    public function storeVehicle(Request $request)
    {
        $validated = $request->validate([
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'vin' => 'nullable|string|max:17',
            'mileage' => 'nullable|integer|min:0',
            'fuel_type' => 'nullable|in:gasoline,diesel,electric,hybrid,other',
            'transmission_type' => 'nullable|in:automatic,manual',
        ]);

        $vehicle = auth()->user()->vehicles()->create($validated);

        return redirect()
            ->route('driver.vehicles.index')
            ->with('success', 'Vehicle added successfully.');
    }

    /**
     * Update a vehicle
     */
    public function updateVehicle(Request $request, $id)
    {
        $vehicle = auth()->user()->vehicles()->findOrFail($id);

        $validated = $request->validate([
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'vin' => 'nullable|string|max:17',
            'mileage' => 'nullable|integer|min:0',
            'fuel_type' => 'nullable|in:gasoline,diesel,electric,hybrid,other',
            'transmission_type' => 'nullable|in:automatic,manual',
        ]);

        $vehicle->update($validated);

        return back()->with('success', 'Vehicle updated successfully.');
    }

    /**
     * Delete a vehicle
     */
    public function deleteVehicle($id)
    {
        $vehicle = auth()->user()->vehicles()->findOrFail($id);
        $vehicle->delete();

        return back()->with('success', 'Vehicle deleted successfully.');
    }

    /**
     * Display maintenance reminders
     */
    public function reminders(): Response
    {
        $reminders = auth()->user()
            ->maintenanceReminders()
            ->with('vehicle')
            ->latest()
            ->paginate(20);

        return Inertia::render('Driver/Reminders/Index', [
            'reminders' => $reminders,
        ]);
    }

    /**
     * Store a new reminder
     */
    public function storeReminder(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'reminder_type' => 'required|in:oil_change,tire_rotation,brake_inspection,battery_check,general',
            'due_date' => 'nullable|date',
            'due_mileage' => 'nullable|integer|min:0',
            'description' => 'nullable|string|max:500',
        ]);

        // Ensure the vehicle belongs to the authenticated user
        $vehicle = auth()->user()->vehicles()->findOrFail($validated['vehicle_id']);

        $vehicle->maintenanceReminders()->create($validated);

        return redirect()
            ->route('driver.reminders.index')
            ->with('success', 'Reminder created successfully.');
    }

    /**
     * Update a reminder
     */
    public function updateReminder(Request $request, $id)
    {
        // Get the reminder through the user's vehicles
        $reminder = auth()->user()
            ->maintenanceReminders()
            ->findOrFail($id);

        $validated = $request->validate([
            'reminder_type' => 'required|in:oil_change,tire_rotation,brake_inspection,battery_check,general',
            'due_date' => 'nullable|date',
            'due_mileage' => 'nullable|integer|min:0',
            'description' => 'nullable|string|max:500',
        ]);

        $reminder->update($validated);

        return back()->with('success', 'Reminder updated successfully.');
    }

    /**
     * Mark reminder as completed
     */
    public function completeReminder($id)
    {
        $reminder = auth()->user()
            ->maintenanceReminders()
            ->findOrFail($id);

        $reminder->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);

        return back()->with('success', 'Reminder marked as completed.');
    }

    /**
     * Delete a reminder
     */
    public function deleteReminder($id)
    {
        $reminder = auth()->user()
            ->maintenanceReminders()
            ->findOrFail($id);

        $reminder->delete();

        return back()->with('success', 'Reminder deleted successfully.');
    }

    /**
     * Display contact history
     */
    public function contacts(): Response
    {
        $contacts = auth()->user()
            ->expertLeads()
            ->with(['expertProfile.user', 'diagnosis'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Driver/Contacts/Index', [
            'contacts' => $contacts,
        ]);
    }

    /**
     * Display profile edit page
     */
    public function profile(): Response
    {
        return Inertia::render('Driver/Profile/Edit', [
            'user' => auth()->user(),
        ]);
    }

    /**
     * Update profile
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'location_address' => 'nullable|string|max:500',
        ]);

        $user->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }
}
