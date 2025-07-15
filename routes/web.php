<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class);

    // Investor routes
    Route::resource('investors', \App\Http\Controllers\InvestorController::class);
    Route::get('investors/create-with-user', [\App\Http\Controllers\InvestorController::class, 'createWithUser'])->name('investors.create-with-user');
    Route::post('investors/create-with-user', [\App\Http\Controllers\InvestorController::class, 'storeWithUser'])->name('investors.store-with-user');
    Route::patch('investors/{investor}/activate', [\App\Http\Controllers\InvestorController::class, 'activate'])->name('investors.activate');
    Route::patch('investors/{investor}/pending', [\App\Http\Controllers\InvestorController::class, 'setPending'])->name('investors.pending');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
