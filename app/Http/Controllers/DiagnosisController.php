<?php

namespace App\Http\Controllers;

use App\Models\Diagnosis;
use App\Models\Vehicle;
use App\Models\DiagnosisImage;
use App\Http\Requests\StoreDiagnosisRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DiagnosisController extends Controller
{
    /**
     * Show the diagnosis form
     */
    public function create(): Response
    {
        return Inertia::render('Diagnose/Create', [
            'vehicles' => auth()->check()
                ? auth()->user()->vehicles
                : [],
        ]);
    }

    /**
     * Store a new diagnosis
     */
    public function store(StoreDiagnosisRequest $request)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            // Handle vehicle creation/selection
            $vehicleId = null;
            if (isset($validated['vehicle_make']) && isset($validated['vehicle_model'])) {
                $vehicle = Vehicle::create([
                    'user_id' => auth()->id(), // NULL for guest users
                    'make' => $validated['vehicle_make'],
                    'model' => $validated['vehicle_model'],
                    'year' => $validated['vehicle_year'] ?? null,
                    'mileage' => $validated['mileage'] ?? null,
                ]);
                $vehicleId = $vehicle->id;
            }

            // Create diagnosis record
            $diagnosis = Diagnosis::create([
                'user_id' => auth()->id(), // NULL for guest users
                'vehicle_id' => $vehicleId,
                'session_id' => session()->getId(), // For guest tracking
                'category' => $validated['category'],
                'user_description' => $validated['description'],
                'voice_note_url' => $validated['voice_note_url'] ?? null,
                'status' => 'pending',
            ]);

            // Handle image uploads
            if (isset($validated['images']) && is_array($validated['images'])) {
                $this->handleImageUploads($validated['images'], $diagnosis);
            }

            DB::commit();

            // Redirect to diagnosis results page (will trigger AI processing)
            return redirect()->route('diagnose.show', $diagnosis->id)
                ->with('success', 'Analyzing your issue...');
        } catch (\Exception $e) {
            DB::rollBack();

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
     */
    public function show(Diagnosis $diagnosis): Response
    {
        // Authorization check
        if ($diagnosis->user_id) {
            if (!auth()->check() || auth()->id() !== $diagnosis->user_id) {
                abort(403, 'Unauthorized access to this diagnosis.');
            }
        } else {
            if ($diagnosis->session_id !== session()->getId()) {
                abort(403, 'Unauthorized access to this diagnosis.');
            }
        }

        // Load relationships
        $diagnosis->load(['vehicle', 'images']);

        // Check if diagnosis needs AI processing
        if ($diagnosis->status === 'pending') {
            try {
                // Process diagnosis with AI service
                $this->processWithAI($diagnosis);

                // Reload the diagnosis to get updated data
                $diagnosis->refresh();
                $diagnosis->load(['vehicle', 'images']);
            } catch (\Exception $e) {
                // Log the error
                logger()->error('AI diagnosis processing failed', [
                    'diagnosis_id' => $diagnosis->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                // Update diagnosis status to failed
                $diagnosis->update(['status' => 'failed']);

                // Return error page
                return Inertia::render('Diagnose/Error', [
                    'diagnosis' => $diagnosis,
                    'error' => 'Unable to process your diagnosis at this time. Please try again later.',
                ]);
            }
        }

        // If diagnosis failed, show error
        if ($diagnosis->status === 'failed') {
            return Inertia::render('Diagnose/Error', [
                'diagnosis' => $diagnosis,
                'error' => 'This diagnosis could not be completed. Please submit a new diagnosis.',
            ]);
        }

        // If diagnosis is completed, show results
        return Inertia::render('Diagnose/Show', [
            'diagnosis' => $diagnosis,
            'canSave' => !auth()->check(), // Show save prompt for guests
        ]);
    }

    /**
     * Process diagnosis with AI service
     * 
     * @param Diagnosis $diagnosis
     * @return void
     * @throws \Exception
     */
    private function processWithAI(Diagnosis $diagnosis): void
    {
        $startTime = microtime(true);

        try {
            // Get AI service from container
            $aiService = app(\App\Services\AI\AIServiceInterface::class);

            // Prepare data for AI analysis
            $data = [
                'category' => $diagnosis->category,
                'description' => $diagnosis->user_description,
                'vehicle_make' => $diagnosis->vehicle?->make,
                'vehicle_model' => $diagnosis->vehicle?->model,
                'vehicle_year' => $diagnosis->vehicle?->year,
                'mileage' => $diagnosis->vehicle?->mileage,
                'images' => $diagnosis->images->pluck('image_path')->toArray(),
            ];

            // Call AI service
            $result = $aiService->diagnose($data);

            // Calculate processing time
            $processingTime = (int) round(microtime(true) - $startTime);

            // Update diagnosis with AI results
            $diagnosis->update([
                'ai_provider' => $result->aiProvider,
                'identified_issue' => $result->identifiedIssue,
                'confidence_score' => $result->confidenceScore,
                'explanation' => $result->explanation,
                'diy_steps' => $result->diySteps,
                'safety_warnings' => $result->safetyWarnings,
                'estimated_cost_min' => $result->estimatedCostMin,
                'estimated_cost_max' => $result->estimatedCostMax,
                'urgency_level' => $result->urgencyLevel,
                'safe_to_drive' => $result->safeToDrive,
                'processing_time_seconds' => $processingTime,
                'status' => 'completed',
            ]);

            // Log successful processing
            logger()->info('AI diagnosis completed', [
                'diagnosis_id' => $diagnosis->id,
                'provider' => $result->aiProvider,
                'issue' => $result->identifiedIssue,
                'confidence' => $result->confidenceScore,
                'processing_time' => $processingTime,
            ]);
        } catch (\Exception $e) {
            // Update diagnosis status to failed
            $diagnosis->update(['status' => 'failed']);

            // Re-throw exception to be caught by show method
            throw $e;
        }
    }

    /**
     * Handle image uploads for a diagnosis
     */
    private function handleImageUploads(array $images, Diagnosis $diagnosis): void
    {
        foreach ($images as $index => $image) {
            if (!$image->isValid()) {
                continue;
            }

            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = "diagnoses/{$diagnosis->id}/{$filename}";

            // Store image
            Storage::disk('public')->put($path, file_get_contents($image));
            $url = Storage::disk('public')->url($path);

            // Create database record
            DiagnosisImage::create([
                'diagnosis_id' => $diagnosis->id,
                'image_url' => $url,
                'image_path' => $path,
                'file_size' => $image->getSize(),
                'mime_type' => $image->getMimeType(),
                'order_index' => $index,
            ]);
        }
    }
}
