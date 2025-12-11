<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SocialNetworkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $socialNetworks = \App\Models\SocialNetwork::with('company')->latest()->get();
        return \Inertia\Inertia::render('SocialNetworks/Index', [
            'socialNetworks' => $socialNetworks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $companies = \App\Models\Company::all();
        return \Inertia\Inertia::render('SocialNetworks/Create', [
            'companies' => $companies
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        \App\Models\SocialNetwork::create($validated);

        return redirect()->route('social-networks.index')->with('success', 'Red social creada exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $socialNetwork = \App\Models\SocialNetwork::findOrFail($id);
        $companies = \App\Models\Company::all();
        return \Inertia\Inertia::render('SocialNetworks/Edit', [
            'socialNetwork' => $socialNetwork,
            'companies' => $companies
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $socialNetwork = \App\Models\SocialNetwork::findOrFail($id);

        $validated = $request->validate([
            'platform' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        $socialNetwork->update($validated);

        return redirect()->route('social-networks.index')->with('success', 'Red social actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $socialNetwork = \App\Models\SocialNetwork::findOrFail($id);
        $socialNetwork->delete();

        return redirect()->route('social-networks.index')->with('success', 'Red social eliminada exitosamente.');
    }
}
