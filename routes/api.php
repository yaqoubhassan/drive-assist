<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DiagnosisController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\ExpertController;
use App\Http\Controllers\Api\ExpertMapController;
use App\Http\Controllers\Api\ResourceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ==================== PUBLIC ROUTES ====================

Route::prefix('v1')->group(function () {
    // Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        // Protected auth routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user', [AuthController::class, 'user']);
            Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
        });
    });

    // Expert Routes (Public)
    Route::prefix('experts')->group(function () {
        Route::get('/', [ExpertController::class, 'index']); // List all experts
        Route::get('/map', [ExpertMapController::class, 'getNearbyExperts']); // Map data
        Route::get('/{expert}', [ExpertController::class, 'show']); // Get specific expert
        Route::post('/{expert}/contact', [ExpertController::class, 'contact']); // Contact expert
    });

    // Educational Resources Routes (Public)
    Route::prefix('resources')->group(function () {
        // Car Issues
        Route::get('/car-issues', [ResourceController::class, 'getCarIssues']);
        Route::get('/car-issues/{slug}', [ResourceController::class, 'getCarIssue']);
        Route::post('/car-issues/{issue}/helpful', [ResourceController::class, 'markCarIssueHelpful']);

        // Road Signs
        Route::get('/road-signs', [ResourceController::class, 'getRoadSigns']);
        Route::get('/road-signs/{slug}', [ResourceController::class, 'getRoadSign']);
    });

    // ==================== AUTHENTICATED ROUTES ====================

    Route::middleware('auth:sanctum')->group(function () {
        // Diagnosis Routes
        Route::prefix('diagnosis')->group(function () {
            Route::get('/vehicles', [DiagnosisController::class, 'getVehicles']); // Get user's vehicles
            Route::post('/', [DiagnosisController::class, 'store']); // Submit diagnosis
            Route::get('/', [DiagnosisController::class, 'index']); // Get user's diagnoses
            Route::get('/{diagnosis}', [DiagnosisController::class, 'show']); // Get specific diagnosis
            Route::delete('/{diagnosis}', [DiagnosisController::class, 'destroy']); // Delete diagnosis
        });

        // ==================== DRIVER ROUTES ====================

        Route::prefix('driver')->middleware('App\Http\Middleware\EnsureUserIsDriver')->group(function () {
            // Dashboard
            Route::get('/dashboard', [DriverController::class, 'dashboard']);

            // Vehicles
            Route::prefix('vehicles')->group(function () {
                Route::get('/', [DriverController::class, 'getVehicles']);
                Route::post('/', [DriverController::class, 'createVehicle']);
                Route::put('/{vehicle}', [DriverController::class, 'updateVehicle']);
                Route::delete('/{vehicle}', [DriverController::class, 'deleteVehicle']);
            });

            // Favorites
            Route::prefix('favorites')->group(function () {
                Route::get('/', [DriverController::class, 'getFavorites']);
                Route::post('/{expert}/toggle', [DriverController::class, 'toggleFavorite']);
            });

            // Maintenance Reminders
            Route::prefix('reminders')->group(function () {
                Route::get('/', [DriverController::class, 'getReminders']);
                Route::post('/', [DriverController::class, 'createReminder']);
                Route::post('/{reminder}/complete', [DriverController::class, 'completeReminder']);
                Route::delete('/{reminder}', [DriverController::class, 'deleteReminder']);
            });
        });

        // ==================== EXPERT ROUTES ====================

        Route::prefix('expert')->middleware('App\Http\Middleware\EnsureUserIsExpert')->group(function () {
            // Dashboard
            Route::get('/dashboard', [ExpertController::class, 'dashboard']);

            // Profile Management
            Route::put('/profile', [ExpertController::class, 'updateProfile']);

            // Leads Management
            Route::get('/leads', [ExpertController::class, 'getLeads']);

            // Reviews
            Route::get('/reviews', [ExpertController::class, 'getReviews']);
        });
    });
});

// Legacy route for backwards compatibility
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
