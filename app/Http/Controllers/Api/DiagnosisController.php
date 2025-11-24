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
     * @OA\Get(
     *     path="/diagnosis/vehicles",
     *     summary="Get user's vehicles",
     *     description="Retrieve list of vehicles owned by the authenticated user for diagnosis form",
     *     tags={"Diagnosis"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Vehicles retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Vehicles retrieved successfully"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Post(
     *     path="/diagnosis",
     *     summary="Submit a new diagnosis",
     *     description="Submit a car issue for AI-powered diagnosis with optional image uploads",
     *     tags={"Diagnosis"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"category","description","vehicle_make","vehicle_model"},
     *                 @OA\Property(property="category", type="string", enum={"engine","brakes","electrical","transmission","tires","suspension","cooling","fuel","exhaust","steering"}, example="engine"),
     *                 @OA\Property(property="description", type="string", example="Car is making a knocking sound when accelerating"),
     *                 @OA\Property(property="vehicle_make", type="string", example="Toyota"),
     *                 @OA\Property(property="vehicle_model", type="string", example="Camry"),
     *                 @OA\Property(property="vehicle_year", type="integer", example=2018),
     *                 @OA\Property(property="mileage", type="integer", example=50000),
     *                 @OA\Property(property="voice_note_url", type="string", nullable=true),
     *                 @OA\Property(property="images[]", type="array", @OA\Items(type="string", format="binary"), description="Upload up to 5 images (max 5MB each)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Diagnosis submitted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Diagnosis submitted successfully. Processing..."),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation error"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Get(
     *     path="/diagnosis/{id}",
     *     summary="Get specific diagnosis",
     *     description="Retrieve detailed diagnosis with AI analysis results",
     *     tags={"Diagnosis"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Diagnosis ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Diagnosis retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Diagnosis retrieved successfully"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden - not your diagnosis"),
     *     @OA\Response(response=404, description="Diagnosis not found"),
     *     @OA\Response(response=422, description="Diagnosis processing failed"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Get(
     *     path="/diagnosis",
     *     summary="Get diagnosis history",
     *     description="Retrieve paginated list of user's diagnosis history",
     *     tags={"Diagnosis"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Number of items per page",
     *         required=false,
     *         @OA\Schema(type="integer", default=15)
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Diagnoses retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Diagnoses retrieved successfully"),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(
     *                 property="pagination",
     *                 type="object",
     *                 @OA\Property(property="total", type="integer", example=100),
     *                 @OA\Property(property="per_page", type="integer", example=15),
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=7)
     *             )
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
     * @OA\Delete(
     *     path="/diagnosis/{id}",
     *     summary="Delete diagnosis",
     *     description="Delete a diagnosis and its associated images",
     *     tags={"Diagnosis"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Diagnosis ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Diagnosis deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Diagnosis deleted successfully")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden - not your diagnosis"),
     *     @OA\Response(response=404, description="Diagnosis not found"),
     *     @OA\Response(response=500, description="Server error")
     * )
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
