<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Currency;

class PaymentMethodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paymentMethods = \App\Models\PaymentMethod::latest()->get();
        return \Inertia\Inertia::render('PaymentMethods/Index', [
            'paymentMethods' => $paymentMethods
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $monedas = Currency::select('id', 'name')->get();
        return \Inertia\Inertia::render('PaymentMethods/Create', [
            'monedas' => $monedas
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'currency_id' => 'required|exists:currencies,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        \App\Models\PaymentMethod::create($validated);

        return redirect()->route('payment-methods.index')->with('success', 'Método de pago creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $paymentMethod = \App\Models\PaymentMethod::findOrFail($id);
        $monedas = Currency::select('id', 'name')->get();
        return \Inertia\Inertia::render('PaymentMethods/Edit', [
            'paymentMethod' => $paymentMethod,
            'monedas' => $monedas
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $paymentMethod = \App\Models\PaymentMethod::findOrFail($id);

        $validated = $request->validate([
            'currency_id' => 'required|exists:currencies,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $paymentMethod->update($validated);

        return redirect()->route('payment-methods.index')->with('success', 'Método de pago actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $paymentMethod = \App\Models\PaymentMethod::findOrFail($id);
        $paymentMethod->delete();

        return redirect()->route('payment-methods.index')->with('success', 'Método de pago eliminado exitosamente.');
    }  
}
