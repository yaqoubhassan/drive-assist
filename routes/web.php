<?php

use App\Http\Controllers\CarIssueController;
use App\Http\Controllers\ExpertContactController;
use App\Http\Controllers\ExpertController;
use App\Http\Controllers\RoadSignController;
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
