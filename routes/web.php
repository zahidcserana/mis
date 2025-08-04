<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\InvestmentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::get('/reset', [UserController::class, 'reset'])->name('user.reset');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [\App\Http\Controllers\HomeController::class, 'dashboard'])->name('dashboard');
    Route::patch('accounts/{account}/activate', [\App\Http\Controllers\AccountController::class, 'activate'])->name('accounts.activate');
    Route::patch('payments/{payment}/adjust', [PaymentController::class, 'adjust'])->name('payments.adjust');
    Route::post('investments/bulk/{payment}', [InvestmentController::class, 'storeBulk'])->name('investments.storeBulk');

    Route::resource('payments', PaymentController::class);
    Route::resource('users', UserController::class);
    Route::resource('accounts', AccountController::class);

    // Investor routes
    Route::resource('investors', \App\Http\Controllers\InvestorController::class);
    Route::patch('investors/{investor}/activate', [\App\Http\Controllers\InvestorController::class, 'activate'])->name('investors.activate');
    Route::patch('investors/{investor}/pending', [\App\Http\Controllers\InvestorController::class, 'setPending'])->name('investors.pending');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
