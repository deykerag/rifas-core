<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Raffle;
use App\Models\Shopping;
use App\Models\PaymentMethod;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $activeRafflesCount = Raffle::where('status', 'active')->count();

        // Get stats for the most recent active raffle
        $activeRaffle = Raffle::where('status', 'active')->latest()->first();

        $percentageSold = 0;
        $totalRevenue = 0;
        $paymentMethodStats = [];

        if ($activeRaffle) {
            // Calculate sold tickets (paid only)
            $soldTicketsCount = Shopping::where('raffle_id', $activeRaffle->id)
                ->where('status', 'paid')
                ->get()
                ->sum(function ($shopping) {
                    return count($shopping->assigned_numbers ?? []);
                });
            
            // Calculate revenue
            $totalRevenue = $soldTicketsCount * $activeRaffle->price_bs;

            // Calculate percentage sold
            if ($activeRaffle->tickets_quantity > 0) {
                $percentageSold = round(($soldTicketsCount / $activeRaffle->tickets_quantity) * 100, 2);
            }

            // Get all active payment methods with their currency
            $paymentMethods = PaymentMethod::where('status', 'active')
                ->with('currency')
                ->get();
            
            // Get sales grouped by payment method
            $salesByPaymentMethod = Shopping::where('status', 'paid')
                ->with(['paymentMethod.currency'])
                ->get()
                ->groupBy(function ($shopping) {
                    return $shopping->payment_method_id ?? null;
                })
                ->map(function ($group) {
                    return [
                        'total_amount' => $group->sum('amount'),
                        'total_tickets' => $group->sum('quantity'),
                    ];
                });

            // Build stats for each payment method
            $paymentMethodStats = $paymentMethods->map(function ($paymentMethod) use ($salesByPaymentMethod, $activeRaffle) {
                $sales = $salesByPaymentMethod->get($paymentMethod->id, [
                    'total_amount' => 0,
                    'total_tickets' => 0,
                ]);
                
                // For VEF (Bolívar): calculate using tickets * price_bs
                // For other currencies: use the amount field
                $totalAmount = $sales['total_amount'];
                $currency = $paymentMethod->currency;
                
                if ($currency && (strtoupper($currency->symbol) === 'BS' || 
                    stripos($currency->name, 'bolívar') !== false || 
                    stripos($currency->name, 'bolivar') !== false)) {
                    // VEF: multiply tickets by price_bs
                    $totalAmount = $sales['total_tickets'] * $activeRaffle->price_bs;
                }
                
                return [
                    'payment_method_id' => $paymentMethod->id,
                    'payment_method_name' => $paymentMethod->name,
                    'currency_name' => $currency?->name ?? 'N/A',
                    'currency_symbol' => $currency?->symbol ?? '',
                    'total_amount' => $totalAmount,
                    'total_tickets' => $sales['total_tickets'],
                ];
            })->toArray();
        }

        // Chart Data: Last 5 days sales
        $salesChartData = [];
        $last5Days = collect(range(0, 4))->map(function ($i) {
            return now()->subDays(4 - $i);
        });

        if ($activeRaffle) {
            $salesByDate = Shopping::where('raffle_id', $activeRaffle->id)
                ->where('status', 'paid')
                ->whereDate('created_at', '>=', now()->subDays(5))
                ->get()
                ->groupBy(function ($date) {
                    return \Carbon\Carbon::parse($date->created_at)->format('d/m');
                });

            foreach ($last5Days as $date) {
                $formatDate = $date->format('d/m');
                $daySales = 0;
                
                if (isset($salesByDate[$formatDate])) {
                    $daySales = $salesByDate[$formatDate]->sum(function ($shopping) {
                        return count($shopping->assigned_numbers ?? []);
                    });
                }
                
                $percentage = 0;
                if ($activeRaffle->tickets_quantity > 0) {
                    $percentage = round(($daySales / $activeRaffle->tickets_quantity) * 100, 2);
                }

                $salesChartData[] = [
                    'name' => $formatDate,
                    'value' => $percentage
                ];
            }
        } else {
            // Fallback for no active raffle
            foreach ($last5Days as $date) {
                $salesChartData[] = [
                    'name' => $date->format('d/m'),
                    'value' => 0
                ];
            }
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'activeRafflesCount' => $activeRafflesCount,
                'percentageSold' => $percentageSold,
                'percentageAvailable' => 100 - $percentageSold,
                'totalRevenue' => $totalRevenue,
                'paymentMethodStats' => $paymentMethodStats,
            ],
            'salesChartData' => $salesChartData,
        ]);
    }

}
