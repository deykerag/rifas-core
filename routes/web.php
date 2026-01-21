<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Artisan;

Route::get('/generate-storage-link', function () {
    Artisan::call('storage:link');
    return '¡Enlace simbólico creado o ya existente!';
});

Route::get('/', function () {
    $activeRaffle = \App\Models\Raffle::with('awards')
        ->where('status', 'active')
        ->latest()
        ->first();

    $paymentMethods = \App\Models\PaymentMethod::where('status', 'active')->get();

    $socialNetworks = \App\Models\SocialNetwork::all();

    // Debug: Log what we found
    \Log::info('Active Raffle Query Result:', [
        'found' => $activeRaffle ? 'YES' : 'NO',
        'raffle_id' => $activeRaffle?->id,
        'description' => $activeRaffle?->description,
        'status' => $activeRaffle?->status,
    ]);

    $percentageSold = 0;
    if ($activeRaffle) {
        $soldTicketsCount = \App\Models\Shopping::where('raffle_id', $activeRaffle->id)
            ->whereIn('status', ['pending', 'paid'])
            ->get()
            ->sum(function ($shopping) {
                return count($shopping->assigned_numbers ?? []);
            });

        if ($activeRaffle->tickets_quantity > 0) {
            $percentageSold = round(($soldTicketsCount / $activeRaffle->tickets_quantity) * 100, 2);
        }
    }

    $topBuyers = [];
    if ($activeRaffle) {
        $topBuyers = \App\Models\Shopping::where('raffle_id', $activeRaffle->id)
            ->where('status', 'paid')
            ->select('name', \DB::raw('SUM(quantity) as total_tickets'))
            ->groupBy('name')
            ->orderByDesc('total_tickets')
            ->take(5)
            ->get();
    }

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'activeRaffle' => $activeRaffle,
        'paymentMethods' => $paymentMethods,
        'percentageSold' => $percentageSold,
        'socialNetworks' => $socialNetworks,
        'topBuyers' => $topBuyers,
    ]);
    
})->name('home');

Route::post('/purchase', [\App\Http\Controllers\ShoppingController::class, 'storePublic'])->name('purchase.store');

Route::get('/verify', function () {
    return Inertia::render('VerifyTicket');
})->name('verify');

Route::post('/verify-ticket', [\App\Http\Controllers\ShoppingController::class, 'verify'])->name('verify.ticket');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

// Route::get('/history', function () {
//     return Inertia::render('RaffleHistory');
// })->name('history');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/winner-search', [\App\Http\Controllers\RaffleController::class, 'winnerSearchView'])->name('dashboard.winner-search');
    Route::post('dashboard/find-winner', [\App\Http\Controllers\RaffleController::class, 'findWinner'])->name('dashboard.find-winner');
    Route::resource('users', \App\Http\Controllers\UserController::class);
    Route::resource('companies', \App\Http\Controllers\CompanyController::class);
    Route::resource('raffles', \App\Http\Controllers\RaffleController::class);
    Route::resource('payment-methods', \App\Http\Controllers\PaymentMethodController::class);
    Route::resource('awards', \App\Http\Controllers\AwardController::class);
    Route::resource('social-networks', \App\Http\Controllers\SocialNetworkController::class);
    Route::resource('shoppings', \App\Http\Controllers\ShoppingController::class);
    Route::resource('currencies', \App\Http\Controllers\CurrencyController::class);
});

require __DIR__ . '/settings.php';
