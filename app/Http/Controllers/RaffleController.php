<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RaffleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $raffles = \App\Models\Raffle::with('company')->latest()->get();
        return \Inertia\Inertia::render('Raffles/Index', [
            'raffles' => $raffles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $companies = \App\Models\Company::all();
        return \Inertia\Inertia::render('Raffles/Create', [
            'companies' => $companies
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'tickets_quantity' => 'required|integer|min:1',
            'price_usd' => 'required|integer|min:0',
            'price_bs' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'required|in:draft,active,inactive',
            'company_id' => 'required|exists:companies,id',
            'draw_date' => 'nullable|date',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('raffles', 'public');
        }

        \App\Models\Raffle::create([
            'description' => $validated['description'],
            'tickets_quantity' => $validated['tickets_quantity'],
            'price_usd' => $validated['price_usd'],
            'price_bs' => $validated['price_bs'],
            'image' => $imagePath,
            'status' => $validated['status'],
            'company_id' => $validated['company_id'],
            'draw_date' => $validated['draw_date'] ?? null,
        ]);

        return redirect()->route('raffles.index')->with('success', 'Rifa creada exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $raffle = \App\Models\Raffle::findOrFail($id);
        $companies = \App\Models\Company::all();
        return \Inertia\Inertia::render('Raffles/Edit', [
            'raffle' => $raffle,
            'companies' => $companies
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $raffle = \App\Models\Raffle::findOrFail($id);

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'tickets_quantity' => 'required|integer|min:1',
            'price_usd' => 'required|integer|min:0',
            'price_bs' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'required|in:draft,active,inactive',
            'company_id' => 'required|exists:companies,id',
            'draw_date' => 'nullable|date',
        ]);

        $raffle->description = $validated['description'];
        $raffle->tickets_quantity = $validated['tickets_quantity'];
        $raffle->price_usd = $validated['price_usd'];
        $raffle->price_bs = $validated['price_bs'];
        $raffle->status = $validated['status'];
        $raffle->company_id = $validated['company_id'];
        $raffle->draw_date = $validated['draw_date'] ?? null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('raffles', 'public');
            $raffle->image = $imagePath;
        }

        $raffle->save();

        return redirect()->route('raffles.index')->with('success', 'Rifa actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $raffle = \App\Models\Raffle::findOrFail($id);
        $raffle->delete();

        return redirect()->route('raffles.index')->with('success', 'Rifa eliminada exitosamente.');
    }
}
