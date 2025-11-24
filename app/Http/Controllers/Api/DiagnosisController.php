<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\DiagnosisResource;
use App\Http\Resources\VehicleResource;
use App\Http\Requests\StoreDiagnosisRequest;
use App\Models\Diagnosis;
use App\Models\Vehicle;
use App\Models\DiagnosisImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DiagnosisController extends ApiController
{
    /**
     * Get vehicles for diagnosis form.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVehicles(Request $request)
    {
        try {
            $vehicles = $request->user()->vehicles;

            return $this->successResponse(
                VehicleResource::collection($vehicles),
                'Vehicles retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Store a new diagnosis.
     *
     * @param StoreDiagnosisRequest $request
     * @return \Illuminate\Http\JsonResponse
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
                    'user_id' => $request->user()?->id,
                    'make' => $validated['vehicle_make'],
                    'model' => $validated['vehicle_model'],
                    'year' => $validated['vehicle_year'] ?? null,
                    'mileage' => $validated['mileage'] ?? null,
                ]);
                $vehicleId = $vehicle->id;
            }

            // Create diagnosis record
            $diagnosis = Diagnosis::create([
                'user_id' => $request->user()?->id,
                'vehicle_id' => $vehicleId,
                'session_id' => Str::uuid()->toString(),
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

            // Load relationships
            $diagnosis->load(['vehicle', 'images']);

            return $this->createdResponse(
                new DiagnosisResource($diagnosis),
                'Diagnosis submitted successfully. Processing...'
            );
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->validationErrorResponse($e->errors());
        } catch (\Exception $e) {
            DB::rollBack();
            logger()->error('Diagnosis submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to submit diagnosis. Please try again.', 500);
        }
    }

    /**
     * Get a specific diagnosis with AI results.
     *
     * @param Request $request
     * @param Diagnosis $diagnosis
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, Diagnosis $diagnosis)
    {
        try {
            // Authorization check
            if ($diagnosis->user_id && $diagnosis->user_id !== $request->user()?->id) {
                return $this->forbiddenResponse('Unauthorized access to this diagnosis.');
            }

            // Load relationships
            $diagnosis->load(['vehicle', 'images']);

            // Check if diagnosis needs AI processing
            if ($diagnosis->status === 'pending') {
                try {
                    $this->processWithAI($diagnosis);
                    $diagnosis->refresh();
                    $diagnosis->load(['vehicle', 'images']);
                } catch (\Exception $e) {
                    logger()->error('AI diagnosis processing failed', [
                        'diagnosis_id' => $diagnosis->id,
                        'error' => $e->getMessage(),
                    ]);

                    $diagnosis->update(['status' => 'failed']);

                    return $this->errorResponse('Unable to process your diagnosis at this time. Please try again later.', 500);
                }
            }

            // If diagnosis failed, return error
            if ($diagnosis->status === 'failed') {
                return $this->errorResponse('This diagnosis could not be completed. Please submit a new diagnosis.', 422);
            }

            return $this->successResponse(
                new DiagnosisResource($diagnosis),
                'Diagnosis retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Get user's diagnosis history.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $diagnoses = $request->user()
                ->diagnoses()
                ->with(['vehicle', 'images'])
                ->latest()
                ->paginate($request->input('per_page', 15));

            return $this->successResponse([
                'data' => DiagnosisResource::collection($diagnoses->items()),
                'pagination' => [
                    'total' => $diagnoses->total(),
                    'per_page' => $diagnoses->perPage(),
                    'current_page' => $diagnoses->currentPage(),
                    'last_page' => $diagnoses->lastPage(),
                    'from' => $diagnoses->firstItem(),
                    'to' => $diagnoses->lastItem(),
                ],
            ], 'Diagnoses retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Delete a diagnosis.
     *
     * @param Request $request
     * @param Diagnosis $diagnosis
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, Diagnosis $diagnosis)
    {
        try {
            // Authorization check
            if ($diagnosis->user_id !== $request->user()->id) {
                return $this->forbiddenResponse('Unauthorized to delete this diagnosis.');
            }

            // Delete images first
            foreach ($diagnosis->images as $image) {
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
            }

            $diagnosis->delete();

            return $this->successResponse(null, 'Diagnosis deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('An error occurred. Please try again.', 500);
        }
    }

    /**
     * Process diagnosis with AI service.
     *
     * @param Diagnosis $diagnosis
     * @return void
     * @throws \Exception
     */
    private function processWithAI(Diagnosis $diagnosis): void
    {
        $startTime = microtime(true);

        try {
            $aiService = app(\App\Services\AI\AIServiceInterface::class);

            $data = [
                'category' => $diagnosis->category,
                'description' => $diagnosis->user_description,
                'vehicle_make' => $diagnosis->vehicle?->make,
                'vehicle_model' => $diagnosis->vehicle?->model,
                'vehicle_year' => $diagnosis->vehicle?->year,
                'mileage' => $diagnosis->vehicle?->mileage,
                'images' => $diagnosis->images->pluck('image_path')->toArray(),
            ];

            $result = $aiService->diagnose($data);
            $processingTime = (int) round(microtime(true) - $startTime);

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

            logger()->info('AI diagnosis completed', [
                'diagnosis_id' => $diagnosis->id,
                'provider' => $result->aiProvider,
                'processing_time' => $processingTime,
            ]);
        } catch (\Exception $e) {
            $diagnosis->update(['status' => 'failed']);
            throw $e;
        }
    }

    /**
     * Handle image uploads for a diagnosis.
     *
     * @param array $images
     * @param Diagnosis $diagnosis
     * @return void
     */
    private function handleImageUploads(array $images, Diagnosis $diagnosis): void
    {
        foreach ($images as $index => $image) {
            if (!$image->isValid()) {
                continue;
            }

            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = "diagnoses/{$diagnosis->id}/{$filename}";

            Storage::disk('public')->put($path, file_get_contents($image));
            $url = Storage::disk('public')->url($path);

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
