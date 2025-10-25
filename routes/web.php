<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page
Route::get('/', function () {
    return Inertia::render('Landing/Index');
})->name('home');

// Educational Content Routes
Route::prefix('learn')->name('learn.')->group(function () {
    Route::get('/road-signs', function () {
        return Inertia::render('Learn/RoadSigns');
    })->name('road-signs');

    Route::get('/common-issues', function () {
        return Inertia::render('Learn/CommonIssues');
    })->name('common-issues');

    Route::get('/driving-tips', function () {
        return Inertia::render('Learn/DrivingTips');
    })->name('driving-tips');

    Route::get('/beginner-guide', function () {
        return Inertia::render('Learn/BeginnerGuide');
    })->name('beginner-guide');

    Route::get('/electric-vehicles', function () {
        return Inertia::render('Learn/ElectricVehicles');
    })->name('electric-vehicles');
});

// Troubleshooting Tool
Route::get('/troubleshoot', function () {
    return Inertia::render('Troubleshoot/Index');
})->name('troubleshoot');

// Find Expert
Route::get('/find-expert', function () {
    return Inertia::render('Expert/Find');
})->name('find-expert');
