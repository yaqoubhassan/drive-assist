<?php

use App\Http\Controllers\Api\ExpertMapController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('api')->group(function () {
    // Expert map data for landing page
    Route::get('/experts/map', [ExpertMapController::class, 'getNearbyExperts']);

    // User info endpoint (for authenticated requests)
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
});
