<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CarIssueController;
use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\Driver\DriverDashboardController;
use App\Http\Controllers\DrivingTipController;
use App\Http\Controllers\ElectricVehicleController;
use App\Http\Controllers\Expert\ExpertDashboardController;
use App\Http\Controllers\Expert\ExpertLeadController;
use App\Http\Controllers\Expert\ExpertRegistrationController;
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

/*
|--------------------------------------------------------------------------
| Web Routes - DriveAssist
|--------------------------------------------------------------------------
|
| This file contains all web routes for the DriveAssist application.
| Routes are organized into logical groups with proper prefixes and middleware.
|
| Route Groups:
| 1. Public/Guest Routes
| 2. Educational Resources
| 3. Authentication Routes
| 4. Driver Routes (auth + driver middleware)
| 5. Expert Routes (auth + expert middleware)
|
*/

/*
|--------------------------------------------------------------------------
| Public/Guest Routes
|--------------------------------------------------------------------------
|
| Routes accessible to all users without authentication
|
*/

// Homepage
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Main Pages
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Diagnose (Guest Troubleshooting)
Route::prefix('diagnose')->name('diagnose.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Diagnose/Index');
    })->name('index');

    Route::post('/submit', [DiagnosisController::class, 'store'])->name('submit');
    Route::get('/{diagnosis}/results', [DiagnosisController::class, 'show'])->name('results');
});

// Expert Search & Profiles (Public)
Route::prefix('experts')->name('experts.')->group(function () {
    Route::get('/', [ExpertController::class, 'index'])->name('index');
    Route::get('/{expert}', [ExpertController::class, 'show'])->name('show');

    // Expert contact routes (guest can contact)
    Route::get('/{expert}/contact', [ExpertContactController::class, 'create'])->name('contact.create');
    Route::post('/{expert}/contact', [ExpertContactController::class, 'store'])->name('contact.store');
});

/*
|--------------------------------------------------------------------------
| Educational Resources (Public)
|--------------------------------------------------------------------------
|
| All educational content accessible without authentication
|
*/

Route::prefix('resources')->name('resources.')->group(function () {
    // Resources Hub
    Route::get('/', function () {
        return Inertia::render('Resources/Index');
    })->name('index');

    // Road Signs
    Route::prefix('road-signs')->name('road-signs.')->group(function () {
        Route::get('/', [RoadSignController::class, 'index'])->name('index');
        Route::get('/quiz', [RoadSignController::class, 'quizIndex'])->name('quiz.index');
        Route::post('/quiz/start', [RoadSignController::class, 'startQuiz'])->name('quiz.start');
        Route::post('/quiz/submit', [RoadSignController::class, 'submitQuiz'])->name('quiz.submit');
        Route::get('/{slug}', [RoadSignController::class, 'show'])->name('show');
    });

    // Common Car Issues
    Route::prefix('car-issues')->name('car-issues.')->group(function () {
        Route::get('/', [CarIssueController::class, 'index'])->name('index');
        Route::get('/{slug}', [CarIssueController::class, 'show'])->name('show');
        Route::post('/{issue}/helpful', [CarIssueController::class, 'markHelpful'])->name('helpful');
    });

    // Driving Tips
    Route::prefix('driving-tips')->name('driving-tips.')->group(function () {
        Route::get('/', [DrivingTipController::class, 'index'])->name('index');
        Route::get('/{drivingTip:slug}', [DrivingTipController::class, 'show'])->name('show');
        Route::post('/{drivingTip:slug}/helpful', [DrivingTipController::class, 'markHelpful'])->name('helpful');

        // Auth required for bookmarking
        Route::middleware('auth')->group(function () {
            Route::post('/{drivingTip:slug}/bookmark', [DrivingTipController::class, 'toggleBookmark'])->name('bookmark');
        });
    });

    // Maintenance Resources
    Route::prefix('maintenance')->name('maintenance.')->group(function () {
        Route::get('/', [MaintenanceController::class, 'index'])->name('index');

        // Maintenance Guides
        Route::prefix('guides')->name('guides.')->group(function () {
            Route::get('/', [MaintenanceGuideController::class, 'index'])->name('index');
            Route::get('/{slug}', [MaintenanceGuideController::class, 'show'])->name('show');
            Route::post('/{slug}/feedback', [MaintenanceGuideController::class, 'feedback'])->name('feedback');
        });

        // Maintenance Schedules
        Route::prefix('schedules')->name('schedules.')->group(function () {
            Route::get('/', [MaintenanceScheduleController::class, 'index'])->name('index');
            Route::get('/{slug}', [MaintenanceScheduleController::class, 'show'])->name('show');
            Route::post('/{slug}/feedback', [MaintenanceScheduleController::class, 'feedback'])->name('feedback');
        });

        // Fluid Guides
        Route::prefix('fluids')->name('fluids.')->group(function () {
            Route::get('/', [FluidGuideController::class, 'index'])->name('index');
            Route::get('/{slug}', [FluidGuideController::class, 'show'])->name('show');
            Route::post('/{slug}/feedback', [FluidGuideController::class, 'feedback'])->name('feedback');
        });

        // Warning Lights
        Route::prefix('warning-lights')->name('warning-lights.')->group(function () {
            Route::get('/', [WarningLightController::class, 'index'])->name('index');
            Route::get('/{slug}', [WarningLightController::class, 'show'])->name('show');
            Route::post('/{slug}/feedback', [WarningLightController::class, 'feedback'])->name('feedback');
        });

        // Seasonal Checklists
        Route::prefix('seasonal')->name('seasonal.')->group(function () {
            Route::get('/', [SeasonalChecklistController::class, 'index'])->name('index');
            Route::get('/{slug}', [SeasonalChecklistController::class, 'show'])->name('show');
            Route::post('/{slug}/feedback', [SeasonalChecklistController::class, 'feedback'])->name('feedback');
        });
    });

    // Electric Vehicles
    Route::prefix('electric-vehicles')->name('electric-vehicles.')->group(function () {
        Route::get('/', [ElectricVehicleController::class, 'index'])->name('index');
        Route::get('/{electricVehicle:slug}', [ElectricVehicleController::class, 'show'])->name('show');
        Route::post('/{electricVehicle:slug}/helpful', [ElectricVehicleController::class, 'markHelpful'])->name('helpful');
    });
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Routes for user authentication including registration, login, password reset,
| email verification, and logout.
|
*/

// Guest Authentication Routes (Registration & Login)
Route::middleware('guest')->group(function () {
    // Registration
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    // Login
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Password Reset
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

// Authenticated User Routes (Email Verification, Password Management, Logout)
Route::middleware('auth')->group(function () {
    // Email Verification
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Password Confirmation
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // Update Password
    Route::put('password', [PasswordController::class, 'update'])
        ->name('password.update');

    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

/*
|--------------------------------------------------------------------------
| Expert Registration (Guest/Unauthenticated)
|--------------------------------------------------------------------------
|
| Special registration flow for automotive experts
|
*/

Route::middleware('guest')->group(function () {
    Route::get('/expert/register', [ExpertRegistrationController::class, 'create'])
        ->name('expert.register');
    Route::post('/expert/register', [ExpertRegistrationController::class, 'store'])
        ->name('expert.register.store');
});

/*
|--------------------------------------------------------------------------
| Driver Routes
|--------------------------------------------------------------------------
|
| Protected routes accessible only to authenticated drivers
| Middleware: auth, driver
|
| Features:
| - Dashboard with overview
| - Diagnosis history and management
| - Favorite experts
| - Vehicle management
| - Maintenance reminders
| - Profile settings
|
*/

Route::prefix('driver')->name('driver.')->middleware(['auth', 'driver'])->group(function () {
    // Driver Dashboard
    Route::get('/dashboard', [DriverDashboardController::class, 'index'])->name('dashboard');

    // Diagnosis History
    Route::get('/diagnoses', [DriverDashboardController::class, 'diagnoses'])->name('diagnoses.index');
    Route::get('/diagnoses/{diagnosis}', [DriverDashboardController::class, 'showDiagnosis'])->name('diagnoses.show');
    Route::delete('/diagnoses/{diagnosis}', [DriverDashboardController::class, 'deleteDiagnosis'])->name('diagnoses.delete');

    // Saved Experts (Favorites)
    Route::get('/favorites', [DriverDashboardController::class, 'favorites'])->name('favorites');
    Route::post('/experts/{expert}/favorite', [DriverDashboardController::class, 'toggleFavorite'])->name('experts.favorite');

    // Vehicles Management
    Route::get('/vehicles', [DriverDashboardController::class, 'vehicles'])->name('vehicles.index');
    Route::post('/vehicles', [DriverDashboardController::class, 'storeVehicle'])->name('vehicles.store');
    Route::put('/vehicles/{vehicle}', [DriverDashboardController::class, 'updateVehicle'])->name('vehicles.update');
    Route::delete('/vehicles/{vehicle}', [DriverDashboardController::class, 'deleteVehicle'])->name('vehicles.delete');

    // Maintenance Reminders
    Route::get('/reminders', [DriverDashboardController::class, 'reminders'])->name('reminders.index');
    Route::post('/reminders', [DriverDashboardController::class, 'storeReminder'])->name('reminders.store');
    Route::put('/reminders/{reminder}', [DriverDashboardController::class, 'updateReminder'])->name('reminders.update');
    Route::post('/reminders/{reminder}/complete', [DriverDashboardController::class, 'completeReminder'])->name('reminders.complete');
    Route::delete('/reminders/{reminder}', [DriverDashboardController::class, 'deleteReminder'])->name('reminders.delete');

    // Contact/Lead History
    Route::get('/contacts', [DriverDashboardController::class, 'contacts'])->name('contacts.index');

    // Profile Settings
    Route::get('/profile', [DriverDashboardController::class, 'profile'])->name('profile.edit');
    Route::put('/profile', [DriverDashboardController::class, 'updateProfile'])->name('profile.update');
});

/*
|--------------------------------------------------------------------------
| Expert Routes
|--------------------------------------------------------------------------
|
| Protected routes accessible only to authenticated experts
| Middleware: auth, expert
|
| Features:
| - Dashboard with business stats
| - Lead management and responses
| - Job tracking and management
| - Review management
| - Earnings tracking
| - Business settings and profile
|
*/

Route::prefix('expert')->name('expert.')->middleware(['auth', 'expert'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [ExpertDashboardController::class, 'index'])->name('dashboard');

    // Onboarding (for newly registered experts who haven't completed profile)
    Route::get('/onboarding', [ExpertRegistrationController::class, 'onboarding'])->name('onboarding');
    Route::post('/onboarding/complete', [ExpertRegistrationController::class, 'completeOnboarding'])->name('onboarding.complete');

    // Lead Management
    Route::prefix('leads')->name('leads.')->group(function () {
        Route::get('/', [ExpertLeadController::class, 'index'])->name('index');
        Route::get('/{lead}', [ExpertLeadController::class, 'show'])->name('show');
        Route::post('/{lead}/respond', [ExpertLeadController::class, 'respond'])->name('respond');
        Route::put('/{lead}/status', [ExpertLeadController::class, 'updateStatus'])->name('status');
    });

    // Job Management
    Route::prefix('jobs')->name('jobs.')->group(function () {
        Route::get('/', [ExpertDashboardController::class, 'jobs'])->name('index');
        Route::get('/{job}', [ExpertDashboardController::class, 'showJob'])->name('show');
        Route::put('/{job}/status', [ExpertDashboardController::class, 'updateJobStatus'])->name('update-status');
        Route::post('/{job}/complete', [ExpertDashboardController::class, 'completeJob'])->name('complete');
    });

    // Reviews & Ratings
    Route::prefix('reviews')->name('reviews.')->group(function () {
        Route::get('/', [ExpertDashboardController::class, 'reviews'])->name('index');
        Route::post('/{review}/respond', [ExpertDashboardController::class, 'respondToReview'])->name('respond');
    });

    // Earnings & Analytics
    Route::get('/earnings', [ExpertDashboardController::class, 'earnings'])->name('earnings');
    Route::get('/analytics', [ExpertDashboardController::class, 'analytics'])->name('analytics');

    // Profile & Settings
    Route::get('/profile', [ExpertDashboardController::class, 'profile'])->name('profile.edit');
    Route::put('/profile', [ExpertDashboardController::class, 'updateProfile'])->name('profile.update');

    // Business Settings
    Route::get('/settings/business', [ExpertDashboardController::class, 'businessSettings'])->name('settings.business');
    Route::put('/settings/business', [ExpertDashboardController::class, 'updateBusinessSettings'])->name('settings.business.update');

    // Availability & Hours
    Route::get('/settings/availability', [ExpertDashboardController::class, 'availabilitySettings'])->name('settings.availability');
    Route::put('/settings/availability', [ExpertDashboardController::class, 'updateAvailability'])->name('settings.availability.update');

    // Services & Pricing
    Route::get('/settings/services', [ExpertDashboardController::class, 'servicesSettings'])->name('settings.services');
    Route::put('/settings/services', [ExpertDashboardController::class, 'updateServices'])->name('settings.services.update');
});

/*
|--------------------------------------------------------------------------
| Route Summary
|--------------------------------------------------------------------------
|
| Public Routes: ~50+ routes (resources, expert search, diagnose)
| Auth Routes: 12 routes (register, login, password reset, verification)
| Driver Routes: 15+ routes (dashboard, diagnoses, vehicles, reminders)
| Expert Routes: 20+ routes (dashboard, leads, jobs, reviews, settings)
|
| Total: ~100+ routes organized by functionality
|
*/