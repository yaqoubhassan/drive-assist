<?php

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
    Route::get('/', [App\Http\Controllers\RoadSignController::class, 'index'])->name('index');
    Route::get('/quiz', [App\Http\Controllers\RoadSignController::class, 'quizIndex'])->name('quiz.index');
    Route::post('/quiz/start', [App\Http\Controllers\RoadSignController::class, 'startQuiz'])->name('quiz.start');
    Route::post('/quiz/submit', [App\Http\Controllers\RoadSignController::class, 'submitQuiz'])->name('quiz.submit');
    Route::get('/{slug}', [App\Http\Controllers\RoadSignController::class, 'show'])->name('show');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});
