<?php

use App\Http\Controllers\ParamController;
use App\Http\Controllers\ParamNodeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TankController;
use App\Http\Middleware\EnsureHasClerkId;

Route::middleware([EnsureHasClerkId::class])->group(function () {
    Route::prefix('tanks')->group(function () {
        Route::controller(TankController::class)->group(function () {
            Route::get('/', 'index');
            Route::get('/{tank_ulid}', 'show');

            Route::post('/', 'store');

            Route::patch('/{tank_ulid}', 'edit');

            Route::delete('/{tank_ulid}', 'delete');
        });
    });

    Route::prefix('params')->group(function () {
        Route::controller(ParamController::class)->group(function () {
            Route::get('/{param_ulid}', 'show');

            Route::post('/', 'store');

            Route::patch('/{param_ulid}', 'edit');

            Route::delete('/{param_ulid}', 'delete');
        });
    });

    Route::prefix('nodes')->group(function () {
        Route::controller(ParamNodeController::class)->group(function () {
            Route::post('/', 'store');

            Route::patch('/{param_node_ulid}', 'edit');

            Route::delete('/{param_node_ulid}', 'delete');
        });
    });
});
