<?php

namespace App\Http\Controllers;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyController extends Controller
{


        /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $currencies = Currency::latest()->get();
        return Inertia::render('Monedas/Index', [
            'currencies' => $currencies
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Monedas/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'symbol' => 'required|string|max:5',
            'name' => 'required|string|max:20|unique:currencies,name',
        ]);

        Currency::create($validated);

        return redirect()->route('currencies.index')->with('success', 'Moneda creada exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $currency = Currency::findOrFail($id);
        return Inertia::render('Monedas/Edit', [
            'currency' => $currency
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $currency = Currency::findOrFail($id);

        $validated = $request->validate([
            'symbol' => 'required|string|max:5',
            'name' => 'required|string|max:20|unique:currencies,name,' . $currency->id,
        ]);

        $currency->update($validated);

        return redirect()->route('currencies.index')->with('success', 'Moneda actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $currency = Currency::findOrFail($id);
        $currency->delete();

        return redirect()->route('currencies.index')->with('success', 'Moneda eliminada exitosamente.');
    }
}
