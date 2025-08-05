<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    AccountController, 
    InvestmentController, 
    PaymentController,
    UserController, 
    InvestorController, 
    HomeController
};

Route::middleware(['auth', 'verified'])->group(function () {
    // Only members (and optionally admins) can access
    Route::middleware(['role:member,admin'])->group(function () {
        Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
        Route::get('/profile', [UserController::class, 'profile'])->name('profile');
    });

    // Admin-only routes
    Route::middleware(['role:admin'])->group(function () {
        Route::patch('accounts/{account}/activate', [AccountController::class, 'activate'])->name('accounts.activate');
        Route::patch('payments/{payment}/adjust', [PaymentController::class, 'adjust'])->name('payments.adjust');
        Route::post('investments/bulk/{payment}', [InvestmentController::class, 'storeBulk'])->name('investments.storeBulk');

        Route::resource('payments', PaymentController::class);
        Route::resource('users', UserController::class);
        Route::resource('accounts', AccountController::class);

        Route::resource('investors', InvestorController::class);
        Route::patch('investors/{investor}/activate', [InvestorController::class, 'activate'])->name('investors.activate');
        Route::patch('investors/{investor}/pending', [InvestorController::class, 'setPending'])->name('investors.pending');
    });
});

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::get('/reset', [UserController::class, 'reset'])->name('user.reset');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/', [\App\Http\Controllers\HomeController::class, 'dashboard'])->name('dashboard');
//     Route::patch('accounts/{account}/activate', [\App\Http\Controllers\AccountController::class, 'activate'])->name('accounts.activate');
//     Route::patch('payments/{payment}/adjust', [PaymentController::class, 'adjust'])->name('payments.adjust');
//     Route::post('investments/bulk/{payment}', [InvestmentController::class, 'storeBulk'])->name('investments.storeBulk');

//     Route::resource('payments', PaymentController::class);
//     Route::resource('users', UserController::class);
//     Route::resource('accounts', AccountController::class);

//     // Investor routes
//     Route::resource('investors', \App\Http\Controllers\InvestorController::class);
//     Route::patch('investors/{investor}/activate', [\App\Http\Controllers\InvestorController::class, 'activate'])->name('investors.activate');
//     Route::patch('investors/{investor}/pending', [\App\Http\Controllers\InvestorController::class, 'setPending'])->name('investors.pending');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
