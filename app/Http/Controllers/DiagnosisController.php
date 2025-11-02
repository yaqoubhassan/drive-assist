<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDiagnosisRequest;
use App\Models\Diagnosis;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DiagnosisController extends Controller
{
    /**
     * Display the diagnosis form (create page)
     * 
     * This method shows the diagnosis form where users can describe their vehicle issues.
     * No authentication required - guests can use this feature.
     */
    public function create(): Response
    {
        // Get user's vehicles if authenticated
        $vehicles = auth()->check()
            ? auth()->user()->vehicles()->get(['id', 'make', 'model', 'year'])
            : [];

        // Get available categories for the dropdown
        $categories = [
            'engine' => [
                'value' => 'engine',
                'label' => 'Engine Issues',
                'icon' => 'Wrench',
                'description' => 'Strange noises, check engine light, poor performance'
            ],
            'brakes' => [
                'value' => 'brakes',
                'label' => 'Brake Problems',
                'icon' => 'AlertCircle',
                'description' => 'Squeaking, grinding, soft pedal, pulling'
            ],
            'electrical' => [
                'value' => 'electrical',
                'label' => 'Electrical Faults',
                'icon' => 'Zap',
                'description' => 'Battery, alternator, lights, starter issues'
            ],
            'transmission' => [
                'value' => 'transmission',
                'label' => 'Transmission Issues',
                'icon' => 'Cog',
                'description' => 'Shifting problems, slipping, leaking fluid'
            ],
            'tires' => [
                'value' => 'tires',
                'label' => 'Tire & Wheel Problems',
                'icon' => 'Disc',
                'description' => 'Uneven wear, vibration, alignment issues'
            ],
            'other' => [
                'value' => 'other',
                'label' => 'Not Sure / Other',
                'icon' => 'Search',
                'description' => 'General issues or unsure about the problem'
            ],
        ];

        return Inertia::render('Diagnose/Create', [
            'categories' => array_values($categories),
            'vehicles' => $vehicles,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Store a new diagnosis submission
     * 
     * This method handles the form submission, validates the data,
     * creates a diagnosis record, and returns the diagnosis ID for the results page.
     * 
     * @param StoreDiagnosisRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreDiagnosisRequest $request)
    {
        try {
            DB::beginTransaction();

            // Prepare diagnosis data
            $diagnosisData = [
                'category' => $request->category,
                'user_description' => $request->description,
                'status' => 'pending',
            ];

            // Add user_id if authenticated
            if (auth()->check()) {
                $diagnosisData['user_id'] = auth()->id();
            } else {
                // For guest users, create a session ID for tracking
                $diagnosisData['session_id'] = session()->getId();
            }

            // Add vehicle_id if provided
            if ($request->filled('vehicle_id')) {
                // Verify the vehicle belongs to the authenticated user
                if (auth()->check()) {
                    $vehicle = auth()->user()->vehicles()->find($request->vehicle_id);
                    if ($vehicle) {
                        $diagnosisData['vehicle_id'] = $vehicle->id;
                    }
                }
            } else if ($request->filled('vehicle_make') && $request->filled('vehicle_model') && $request->filled('vehicle_year')) {
                // Create a new vehicle record if details provided
                $vehicle = Vehicle::create([
                    'user_id' => auth()->id() ?? null,
                    'make' => $request->vehicle_make,
                    'model' => $request->vehicle_model,
                    'year' => $request->vehicle_year,
                    'mileage' => $request->mileage ?? null,
                ]);
                $diagnosisData['vehicle_id'] = $vehicle->id;
            }

            // Add voice note URL if provided
            if ($request->filled('voice_note_url')) {
                $diagnosisData['voice_note_url'] = $request->voice_note_url;
            }

            // Create the diagnosis record
            $diagnosis = Diagnosis::create($diagnosisData);

            // Handle image uploads if provided
            if ($request->hasFile('images')) {
                $this->handleImageUploads($request->file('images'), $diagnosis);
            }

            DB::commit();

            // Redirect to the diagnosis results page
            // The AI processing will happen on the results page load
            return redirect()
                ->route('diagnose.show', $diagnosis)
                ->with('success', 'Diagnosis submitted successfully! Analyzing your issue...');
        } catch (\Exception $e) {
            DB::rollBack();

            // Log the error
            logger()->error('Diagnosis submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to submit diagnosis. Please try again.']);
        }
    }

    /**
     * Display the diagnosis results
     * 
     * This method shows the AI analysis results for a diagnosis.
     * If the diagnosis is still pending, it will trigger the AI analysis.
     * 
     * @param Diagnosis $diagnosis
     * @return Response
     */
    public function show(Diagnosis $diagnosis): Response
    {
        // Authorization check
        // Allow access if:
        // 1. User owns the diagnosis, OR
        // 2. Guest diagnosis with matching session ID, OR
        // 3. Admin/staff (future enhancement)
        if ($diagnosis->user_id) {
            // If diagnosis belongs to a user, only that user can view it
            if (!auth()->check() || auth()->id() !== $diagnosis->user_id) {
                abort(403, 'Unauthorized access to this diagnosis.');
            }
        } else {
            // Guest diagnosis - check session ID
            if ($diagnosis->session_id !== session()->getId()) {
                abort(403, 'Unauthorized access to this diagnosis.');
            }
        }

        // Load relationships
        $diagnosis->load(['vehicle', 'images']);

        // Check if diagnosis needs AI processing
        if ($diagnosis->status === 'pending') {
            // In the next task, we'll add AI service integration here
            // For now, just return the pending status
            return Inertia::render('Diagnose/Processing', [
                'diagnosis' => $diagnosis,
            ]);
        }

        // If diagnosis is completed, show results
        return Inertia::render('Diagnose/Show', [
            'diagnosis' => $diagnosis,
            'canSave' => !auth()->check(), // Show save prompt for guests
        ]);
    }

    /**
     * Handle image uploads for a diagnosis
     * 
     * @param array $images
     * @param Diagnosis $diagnosis
     * @return void
     */
    private function handleImageUploads(array $images, Diagnosis $diagnosis): void
    {
        foreach ($images as $index => $image) {
            // Validate image
            if (!$image->isValid()) {
                continue;
            }

            // Generate unique filename
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

            // Store in storage/app/public/diagnoses/{diagnosis_id}
            $path = $image->storeAs(
                "diagnoses/{$diagnosis->id}",
                $filename,
                'public'
            );

            // Create diagnosis image record
            $diagnosis->images()->create([
                'image_url' => asset('storage/' . $path),
                'image_path' => $path,
                'file_size' => $image->getSize(),
                'mime_type' => $image->getMimeType(),
                'order_index' => $index,
            ]);
        }
    }

    /**
     * Mark diagnosis as helpful or not helpful
     * 
     * @param Request $request
     * @param Diagnosis $diagnosis
     * @return \Illuminate\Http\RedirectResponse
     */
    public function feedback(Request $request, Diagnosis $diagnosis)
    {
        $request->validate([
            'feedback' => 'required|in:helpful,not_helpful',
        ]);

        $diagnosis->update([
            'user_feedback' => $request->feedback,
        ]);

        return back()->with('success', 'Thank you for your feedback!');
    }
}
