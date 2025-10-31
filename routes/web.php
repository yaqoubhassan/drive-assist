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
// use App\Http\Controllers\DiagnosisController;
use App\Http\Controllers\Driver\DriverDashboardController;
use App\Http\Controllers\DrivingTipController;
use App\Http\Controllers\ElectricVehicleController;
use App\Http\Controllers\Expert\ExpertDashboardController;
use App\Http\Controllers\Expert\ExpertKycController;
use App\Http\Controllers\Expert\ExpertLeadController;
use App\Http\Controllers\Expert\ExpertOnboardingController;
use App\Http\Controllers\ExpertContactController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\FluidGuideController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\MaintenanceGuideController;
use App\Http\Controllers\MaintenanceScheduleController;
use App\Http\Controllers\RoadSignController;
use App\Http\Controllers\SeasonalChecklistController;
use App\Http\Controllers\WarningLightController;
use Illuminate\Support\Facades\Auth;
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
| 5. Expert Routes (auth + expert + kyc middleware)
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
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
})->name('home');

// Main Pages
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Diagnose (Guest Troubleshooting)
// Route::prefix('diagnose')->name('diagnose.')->group(function () {
//     Route::get('/', [DiagnosisController::class, 'create'])->name('index');
//     Route::post('/submit', [DiagnosisController::class, 'store'])->name('submit');
//     Route::get('/{diagnosis}/results', [DiagnosisController::class, 'show'])->name('results');
// });

// Expert Search & Profiles (Public)
Route::prefix('experts')->name('experts.')->group(function () {
    Route::get('/', [ExpertController::class, 'index'])->name('index');
    Route::get('/{expert}', [ExpertController::class, 'show'])->name('show');

    // Contact Expert (Guest or Authenticated)
    Route::get('/{expert}/contact', [ExpertContactController::class, 'create'])->name('contact.create');
    Route::post('/{expert}/contact', [ExpertContactController::class, 'store'])->name('contact.store');
});

/*
|--------------------------------------------------------------------------
| Educational Resources Routes
|--------------------------------------------------------------------------
|
| Public access to all educational content
|
*/

// Resources Hub
Route::get('/resources', function () {
    return Inertia::render('Resources/Index');
})->name('resources');

// Road Signs
Route::prefix('resources/road-signs')->name('resources.road-signs.')->group(function () {
    Route::get('/', [RoadSignController::class, 'index'])->name('index');
    Route::get('/{roadSign:slug}', [RoadSignController::class, 'show'])->name('show');

    // Quiz
    Route::prefix('quiz')->name('quiz.')->group(function () {
        Route::get('/', [RoadSignController::class, 'quizIndex'])->name('index');
        Route::post('/start', [RoadSignController::class, 'startQuiz'])->name('start');
        Route::post('/submit', [RoadSignController::class, 'submitQuiz'])->name('submit');
    });
});

// Car Issues Library
Route::prefix('resources/car-issues')->name('resources.car-issues.')->group(function () {
    Route::get('/', [CarIssueController::class, 'index'])->name('index');
    Route::get('/{carIssue:slug}', [CarIssueController::class, 'show'])->name('show');
    Route::post('/{carIssue:slug}/helpful', [CarIssueController::class, 'markHelpful'])->name('helpful');
});

// Driving Tips
Route::prefix('resources/driving-tips')->name('resources.driving-tips.')->group(function () {
    Route::get('/', [DrivingTipController::class, 'index'])->name('index');
    Route::get('/{drivingTip:slug}', [DrivingTipController::class, 'show'])->name('show');
    Route::post('/{drivingTip:slug}/helpful', [DrivingTipController::class, 'markHelpful'])->name('helpful');
});

// Maintenance Resources
Route::prefix('resources/maintenance')->name('maintenance.')->group(function () {
    // Main Maintenance Hub
    Route::get('/', [MaintenanceController::class, 'index'])->name('index');

    // Maintenance Guides
    Route::prefix('guides')->name('guides.')->group(function () {
        Route::get('/', [MaintenanceGuideController::class, 'index'])->name('index');
        Route::get('/{guide:slug}', [MaintenanceGuideController::class, 'show'])->name('show');
        Route::post('/{guide:slug}/bookmark', [MaintenanceGuideController::class, 'bookmark'])->middleware('auth')->name('bookmark');
    });

    // Maintenance Schedules
    Route::prefix('schedules')->name('schedules.')->group(function () {
        Route::get('/', [MaintenanceScheduleController::class, 'index'])->name('index');
        Route::get('/{schedule:slug}', [MaintenanceScheduleController::class, 'show'])->name('show');
    });

    // Seasonal Checklists
    Route::prefix('seasonal')->name('seasonal.')->group(function () {
        Route::get('/', [SeasonalChecklistController::class, 'index'])->name('index');
        Route::get('/{checklist:slug}', [SeasonalChecklistController::class, 'show'])->name('show');
    });

    // Fluid Guides
    Route::prefix('fluids')->name('fluids.')->group(function () {
        Route::get('/', [FluidGuideController::class, 'index'])->name('index');
        Route::get('/{fluid:slug}', [FluidGuideController::class, 'show'])->name('show');
    });

    // Warning Lights
    Route::prefix('warning-lights')->name('warning-lights.')->group(function () {
        Route::get('/', [WarningLightController::class, 'index'])->name('index');
        Route::get('/{light:slug}', [WarningLightController::class, 'show'])->name('show');
        Route::post('/{light:slug}/feedback', [WarningLightController::class, 'feedback'])->name('feedback');
    });
});

// Electric Vehicles
Route::prefix('resources/electric-vehicles')->name('resources.electric-vehicles.')->group(function () {
    Route::get('/', [ElectricVehicleController::class, 'index'])->name('index');
    Route::get('/{electricVehicle:slug}', [ElectricVehicleController::class, 'show'])->name('show');
    Route::post('/{electricVehicle:slug}/helpful', [ElectricVehicleController::class, 'markHelpful'])->name('helpful');
});

// E-Bikes & Scooters
Route::get('/resources/e-bikes', function () {
    return Inertia::render('Resources/EBikes');
})->name('resources.e-bikes');

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Routes for user registration, login, password reset, and verification
|
*/

// Guest Authentication Routes (Registration & Login)
Route::middleware('guest')->group(function () {
    // Registration
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

    // Login
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Password Reset
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

// Authenticated User Routes (Email Verification, Password Management, Logout)
Route::middleware('auth')->group(function () {
    // Email Verification
    Route::get('verify-email', EmailVerificationPromptController::class)->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Password Confirmation
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])->name('password.confirm');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    // Update Password
    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
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
| Middleware hierarchy:
| - auth, expert: Basic authentication
| - onboarding.check: Ensures profile is completed
| - check.expert.kyc: KYC verification status check
|
| KYC Requirements by Feature:
| - Dashboard access: in_progress (KYC at least started)
| - Lead viewing/responding: submitted (KYC submitted for review)
| - Job management: approved (KYC fully approved)
| - Earnings/payments: approved (KYC fully approved)
|
*/

Route::prefix('expert')->name('expert.')->middleware(['auth', 'expert'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Expert Onboarding Routes
    |--------------------------------------------------------------------------
    | Initial multi-step onboarding flow for new experts
    | No additional middleware - basic setup required before KYC
    */
    Route::prefix('onboarding')->name('onboarding.')->group(function () {
        Route::get('/', [ExpertOnboardingController::class, 'index'])->name('index');
        Route::post('/save', [ExpertOnboardingController::class, 'save'])->name('save');
        Route::post('/complete', [ExpertOnboardingController::class, 'complete'])->name('complete');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert KYC (Know Your Customer) Routes
    |--------------------------------------------------------------------------
    | Complete verification process for expert accounts
    | Middleware: onboarding.check (ensures profile is completed first)
    | 
    | KYC Status Flow:
    | not_started -> in_progress -> submitted -> under_review -> approved/rejected/resubmission_required
    |
    | Available Routes:
    | - GET    /expert/kyc                   View KYC form
    | - POST   /expert/kyc/save-progress     Auto-save progress
    | - POST   /expert/kyc/upload-document   Upload verification documents
    | - DELETE /expert/kyc/delete-document   Remove uploaded document
    | - POST   /expert/kyc/submit            Final submission for review
    | - GET    /expert/kyc/status            Get current KYC status (AJAX)
    */
    Route::prefix('kyc')->name('kyc.')->middleware(['onboarding.check'])->group(function () {
        // View KYC form (available at any status)
        Route::get('/', [ExpertKycController::class, 'index'])->name('index');

        // Save progress (auto-save while filling form)
        Route::post('/save-progress', [ExpertKycController::class, 'saveProgress'])->name('save-progress');

        // Upload documents (business license, insurance, ID, etc.)
        Route::post('/upload-document', [ExpertKycController::class, 'uploadDocument'])->name('upload-document');

        // Delete document (if user wants to re-upload)
        Route::delete('/delete-document', [ExpertKycController::class, 'deleteDocument'])->name('delete-document');

        // Submit for review (final submission)
        Route::post('/submit', [ExpertKycController::class, 'submit'])->name('submit');

        // Get current KYC status (AJAX endpoint for real-time updates)
        Route::get('/status', [ExpertKycController::class, 'getStatus'])->name('status');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert Dashboard Routes
    |--------------------------------------------------------------------------
    | Main dashboard and overview
    | Middleware: onboarding.check, check.expert.kyc:in_progress
    | 
    | Requirements: Profile completed, KYC at least started
    | Experts can access basic dashboard once they begin KYC verification
    */
    Route::middleware(['onboarding.check', 'check.expert.kyc:in_progress'])->group(function () {
        Route::get('/dashboard', [ExpertDashboardController::class, 'index'])->name('dashboard');
        Route::get('/stats', [ExpertDashboardController::class, 'stats'])->name('stats');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert Lead Management Routes
    |--------------------------------------------------------------------------
    | View and respond to customer leads/inquiries
    | Middleware: onboarding.check, check.expert.kyc:submitted
    | 
    | Requirements: Profile completed, KYC submitted for review
    | Experts need at least submitted KYC to view and respond to leads
    | This provides some protection while still allowing business operations
    */
    Route::prefix('leads')->name('leads.')->middleware(['onboarding.check', 'check.expert.kyc:submitted'])->group(function () {
        Route::get('/', [ExpertLeadController::class, 'index'])->name('index');
        Route::get('/{lead}', [ExpertLeadController::class, 'show'])->name('show');
        Route::post('/{lead}/respond', [ExpertLeadController::class, 'respond'])->name('respond');
        Route::patch('/{lead}/status', [ExpertLeadController::class, 'updateStatus'])->name('update-status');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert Job Management Routes
    |--------------------------------------------------------------------------
    | Track and manage active jobs/services
    | Middleware: onboarding.check, check.expert.kyc:approved
    | 
    | Requirements: Profile completed, KYC fully approved
    | Full job management with payment tracking requires approved KYC
    */
    Route::prefix('jobs')->name('jobs.')->middleware(['onboarding.check', 'check.expert.kyc:approved'])->group(function () {
        Route::get('/', [ExpertDashboardController::class, 'jobs'])->name('index');
        Route::get('/{job}', [ExpertDashboardController::class, 'showJob'])->name('show');
        Route::patch('/{job}/status', [ExpertDashboardController::class, 'updateJobStatus'])->name('update-status');
        Route::post('/{job}/complete', [ExpertDashboardController::class, 'completeJob'])->name('complete');
        Route::post('/{job}/notes', [ExpertDashboardController::class, 'addJobNote'])->name('add-note');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert Review Management Routes
    |--------------------------------------------------------------------------
    | View and respond to customer reviews
    | Middleware: onboarding.check, check.expert.kyc:approved
    | 
    | Requirements: Profile completed, KYC fully approved
    */
    Route::prefix('reviews')->name('reviews.')->middleware(['onboarding.check', 'check.expert.kyc:approved'])->group(function () {
        Route::get('/', [ExpertDashboardController::class, 'reviews'])->name('index');
        Route::post('/{review}/respond', [ExpertDashboardController::class, 'respondToReview'])->name('respond');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert Earnings & Analytics Routes
    |--------------------------------------------------------------------------
    | Financial tracking and analytics dashboard
    | Middleware: onboarding.check, check.expert.kyc:approved
    | 
    | Requirements: Profile completed, KYC fully approved
    | Financial features require full verification for security and compliance
    */
    Route::prefix('earnings')->name('earnings.')->middleware(['onboarding.check', 'check.expert.kyc:approved'])->group(function () {
        Route::get('/', [ExpertDashboardController::class, 'earnings'])->name('index');
        Route::get('/report', [ExpertDashboardController::class, 'earningsReport'])->name('report');
        Route::get('/export', [ExpertDashboardController::class, 'exportEarnings'])->name('export');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert Profile & Settings Routes
    |--------------------------------------------------------------------------
    | Update business profile and account settings
    | Middleware: onboarding.check, check.expert.kyc:in_progress
    | 
    | Requirements: Profile completed, KYC at least started
    | Experts can update their profile while KYC is in progress
    */
    Route::middleware(['onboarding.check', 'check.expert.kyc:in_progress'])->group(function () {
        // Profile Management
        Route::get('/profile', [ExpertDashboardController::class, 'profile'])->name('profile.edit');
        Route::put('/profile', [ExpertDashboardController::class, 'updateProfile'])->name('profile.update');

        // Business Hours and Availability
        Route::get('/availability', [ExpertDashboardController::class, 'availability'])->name('availability.edit');
        Route::put('/availability', [ExpertDashboardController::class, 'updateAvailability'])->name('availability.update');

        // Services and Specialties
        Route::get('/services', [ExpertDashboardController::class, 'services'])->name('services.edit');
        Route::put('/services', [ExpertDashboardController::class, 'updateServices'])->name('services.update');

        // Pricing Settings
        Route::get('/pricing', [ExpertDashboardController::class, 'pricing'])->name('pricing.edit');
        Route::put('/pricing', [ExpertDashboardController::class, 'updatePricing'])->name('pricing.update');

        // Gallery Management (shop photos, work examples)
        Route::post('/gallery/upload', [ExpertDashboardController::class, 'uploadGalleryImage'])->name('gallery.upload');
        Route::delete('/gallery/{image}', [ExpertDashboardController::class, 'deleteGalleryImage'])->name('gallery.delete');
    });

    /*
    |--------------------------------------------------------------------------
    | Expert Notification Settings
    |--------------------------------------------------------------------------
    | Manage notification preferences and read status
    | Middleware: onboarding.check
    | 
    | Requirements: Profile completed only
    | Basic notification management available once onboarding is complete
    */
    Route::middleware(['onboarding.check'])->group(function () {
        Route::get('/notifications/settings', [ExpertDashboardController::class, 'notificationSettings'])->name('notifications.settings');
        Route::put('/notifications/settings', [ExpertDashboardController::class, 'updateNotificationSettings'])->name('notifications.update');
        Route::post('/notifications/{notification}/mark-read', [ExpertDashboardController::class, 'markNotificationRead'])->name('notifications.mark-read');
        Route::post('/notifications/mark-all-read', [ExpertDashboardController::class, 'markAllNotificationsRead'])->name('notifications.mark-all-read');
    });
});

/*
|--------------------------------------------------------------------------
| Development/Admin Routes (Future)
|--------------------------------------------------------------------------
|
| These routes will be added in future phases:
| - Admin panel for managing users, experts, content
| - Analytics and reporting
| - Payment processing
| - Advanced search and filtering
|
*/