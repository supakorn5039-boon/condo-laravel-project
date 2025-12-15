<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Room\RoomController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public room browsing (no auth required)
Route::prefix('rooms')->group(function () {
    Route::get('/', [RoomController::class, 'index']);
    Route::get('/{id}', [RoomController::class, 'show']);
});

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Authenticated room access and admin management
    Route::prefix('room')->group(function () {
        Route::get('/', [RoomController::class, 'index']);
        Route::get('/{id}', [RoomController::class, 'show']);
        Route::post('/', [RoomController::class, 'store']);
        Route::put('/{id}', [RoomController::class, 'update']);
        Route::delete('/{id}', [RoomController::class, 'destroy']);
        Route::post('/{id}/images', [RoomController::class, 'uploadImages']);
        Route::delete('/{roomId}/images/{mediaId}', [RoomController::class, 'deleteImage']);
    });
});
