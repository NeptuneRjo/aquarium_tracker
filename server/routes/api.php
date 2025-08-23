<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TankController;

Route::get('/data/tank', [TankController::class, 'index']);
Route::get('/data/tank/{tank_ulid}', [TankController::class, 'show']);
