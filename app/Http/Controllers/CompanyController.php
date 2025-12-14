<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $companies = \App\Models\Company::with('user')->latest()->get();
        return \Inertia\Inertia::render('Companies/Index', [
            'companies' => $companies
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        /*hola*/
        $users = \App\Models\User::all();
        return \Inertia\Inertia::render('Companies/Create', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:companies',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('companies', 'public');
        }

        \App\Models\Company::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'logo' => $logoPath,
            'user_id' => $validated['user_id'],
        ]);

        return redirect()->route('companies.index')->with('success', 'Empresa creada exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $company = \App\Models\Company::findOrFail($id);
        $users = \App\Models\User::all();
        return \Inertia\Inertia::render('Companies/Edit', [
            'company' => $company,
            'users' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $company = \App\Models\Company::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:companies,email,' . $company->id,
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $company->name = $validated['name'];
        $company->email = $validated['email'];
        $company->user_id = $validated['user_id'];

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('companies', 'public');
            $company->logo = $logoPath;
        }

        $company->save();

        return redirect()->route('companies.index')->with('success', 'Empresa actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $company = \App\Models\Company::findOrFail($id);
        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Empresa eliminada exitosamente.');
    }
}
