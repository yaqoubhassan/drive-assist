<?php

use App\Http\Controllers\CarIssueController;
use App\Http\Controllers\DrivingTipController;
use App\Http\Controllers\ExpertContactController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\FluidGuideController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MaintenanceGuideController;
use App\Http\Controllers\MaintenanceScheduleController;
use App\Http\Controllers\RoadSignController;
use App\Http\Controllers\SeasonalChecklistController;
use App\Http\Controllers\WarningLightController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;












Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/diagnose', function () {
    return Inertia::render('Diagnose/Index');
})->name('diagnose');

Route::get('/experts', function () {
    return Inertia::render('Experts/Index');
})->name('experts');

Route::get('/resources', function () {
    return Inertia::render('Resources/Index');
})->name('resources');

// Road Signs Routes
Route::prefix('resources/road-signs')->name('road-signs.')->group(function () {
    Route::get('/', [RoadSignController::class, 'index'])->name('index');
    Route::get('/quiz', [RoadSignController::class, 'quizIndex'])->name('quiz.index');
    Route::post('/quiz/start', [RoadSignController::class, 'startQuiz'])->name('quiz.start');
    Route::post('/quiz/submit', [RoadSignController::class, 'submitQuiz'])->name('quiz.submit');
    Route::get('/{slug}', [RoadSignController::class, 'show'])->name('show');
});

// Car Issues Routes
Route::prefix('resources/car-issues')->name('car-issues.')->group(function () {
    Route::get('/', [CarIssueController::class, 'index'])->name('index');
    Route::get('/{slug}', [CarIssueController::class, 'show'])->name('show');
    Route::post('/{issue}/helpful', [CarIssueController::class, 'markHelpful'])->name('helpful');
});

// Driving Tips Routes
Route::prefix('resources/driving-tips')->name('driving-tips.')->group(function () {
    Route::get('/', [DrivingTipController::class, 'index'])->name('index');
    Route::get('/{drivingTip:slug}', [DrivingTipController::class, 'show'])->name('show');

    // Auth required routes
    Route::middleware('auth')->group(function () {
        Route::post('/{drivingTip:slug}/helpful', [DrivingTipController::class, 'markHelpful'])->name('helpful');
        Route::post('/{drivingTip:slug}/bookmark', [DrivingTipController::class, 'toggleBookmark'])->name('bookmark');
    });
});

// Maintenance Resources Hub
Route::get('/resources/maintenance', [MaintenanceController::class, 'index'])
    ->name('maintenance.index');

// Maintenance Guides
Route::prefix('resources/maintenance/guides')->group(function () {
    Route::get('/', [MaintenanceGuideController::class, 'index'])
        ->name('maintenance.guides.index');

    Route::get('/{slug}', [MaintenanceGuideController::class, 'show'])
        ->name('maintenance.guides.show');

    Route::post('/{slug}/feedback', [MaintenanceGuideController::class, 'feedback'])
        ->name('maintenance.guides.feedback');
});

// Maintenance Schedules
Route::prefix('resources/maintenance/schedules')->group(function () {
    Route::get('/', [MaintenanceScheduleController::class, 'index'])
        ->name('maintenance.schedules.index');

    Route::get('/{slug}', [MaintenanceScheduleController::class, 'show'])
        ->name('maintenance.schedules.show');

    Route::post('/{slug}/feedback', [MaintenanceScheduleController::class, 'feedback'])
        ->name('maintenance.schedules.feedback');
});

// Fluid Guides
Route::prefix('resources/maintenance/fluids')->group(function () {
    Route::get('/', [FluidGuideController::class, 'index'])
        ->name('maintenance.fluids.index');

    Route::get('/{slug}', [FluidGuideController::class, 'show'])
        ->name('maintenance.fluids.show');

    Route::post('/{slug}/feedback', [FluidGuideController::class, 'feedback'])
        ->name('maintenance.fluids.feedback');
});

// Warning Lights
Route::prefix('resources/maintenance/warning-lights')->group(function () {
    Route::get('/', [WarningLightController::class, 'index'])
        ->name('maintenance.warning-lights.index');

    Route::get('/{slug}', [WarningLightController::class, 'show'])
        ->name('maintenance.warning-lights.show');

    Route::post('/{slug}/feedback', [WarningLightController::class, 'feedback'])
        ->name('maintenance.warning-lights.feedback');
});

// Seasonal Checklists
Route::prefix('resources/maintenance/seasonal')->group(function () {
    Route::get('/', [SeasonalChecklistController::class, 'index'])
        ->name('maintenance.seasonal.index');

    Route::get('/{slug}', [SeasonalChecklistController::class, 'show'])
        ->name('maintenance.seasonal.show');

    Route::post('/{slug}/feedback', [SeasonalChecklistController::class, 'feedback'])
        ->name('maintenance.seasonal.feedback');
});

// Expert profile routes
Route::get('/experts/{expert}', [ExpertController::class, 'show'])
    ->name('experts.show');

// Expert contact routes
Route::get('/experts/{expert}/contact', [ExpertContactController::class, 'create'])
    ->name('experts.contact.create');

Route::post('/experts/{expert}/contact', [ExpertContactController::class, 'store'])
    ->name('experts.contact.store');

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});
