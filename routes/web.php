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

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});
