<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AwardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $awards = \App\Models\Award::with('raffle')->latest()->get();
        return \Inertia\Inertia::render('Awards/Index', [
            'awards' => $awards
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $raffles = \App\Models\Raffle::all();
        return \Inertia\Inertia::render('Awards/Create', [
            'raffles' => $raffles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'raffle_id' => 'required|exists:raffles,id',
        ]);

        \App\Models\Award::create($validated);

        return redirect()->route('awards.index')->with('success', 'Premio creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $award = \App\Models\Award::findOrFail($id);
        $raffles = \App\Models\Raffle::all();
        return \Inertia\Inertia::render('Awards/Edit', [
            'award' => $award,
            'raffles' => $raffles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $award = \App\Models\Award::findOrFail($id);

        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'raffle_id' => 'required|exists:raffles,id',
        ]);

        $award->update($validated);

        return redirect()->route('awards.index')->with('success', 'Premio actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $award = \App\Models\Award::findOrFail($id);
        $award->delete();

        return redirect()->route('awards.index')->with('success', 'Premio eliminado exitosamente.');
    }
}
