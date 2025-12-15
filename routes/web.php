<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $activeRaffle = \App\Models\Raffle::with('awards')
        ->where('status', 'active')
        ->latest()
        ->first();

    $paymentMethods = \App\Models\PaymentMethod::where('status', 'active')->get();

    // Debug: Log what we found
    \Log::info('Active Raffle Query Result:', [
        'found' => $activeRaffle ? 'YES' : 'NO',
        'raffle_id' => $activeRaffle?->id,
        'description' => $activeRaffle?->description,
        'status' => $activeRaffle?->status,
    ]);

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'activeRaffle' => $activeRaffle,
        'paymentMethods' => $paymentMethods,
    ]);
})->name('home');

Route::get('/verify', function () {
    return Inertia::render('VerifyTicket');
})->name('verify');

Route::post('/verify-ticket', [\App\Http\Controllers\ShoppingController::class, 'verify'])->name('verify.ticket');

Route::get('/history', function () {
    return Inertia::render('RaffleHistory');
})->name('history');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', \App\Http\Controllers\UserController::class);
    Route::resource('companies', \App\Http\Controllers\CompanyController::class);
    Route::resource('raffles', \App\Http\Controllers\RaffleController::class);
    Route::resource('payment-methods', \App\Http\Controllers\PaymentMethodController::class);
    Route::resource('awards', \App\Http\Controllers\AwardController::class);
    Route::resource('social-networks', \App\Http\Controllers\SocialNetworkController::class);
    Route::resource('shoppings', \App\Http\Controllers\ShoppingController::class);
});

require __DIR__ . '/settings.php';
