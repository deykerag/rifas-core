<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShoppingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shoppings = \App\Models\Shopping::with(['raffle', 'paymentMethod'])->latest()->get();
        return \Inertia\Inertia::render('Shoppings/Index', [
            'shoppings' => $shoppings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $raffles = \App\Models\Raffle::where('status', 'active')->get();
        $paymentMethods = \App\Models\PaymentMethod::where('status', 'active')->get();
        return \Inertia\Inertia::render('Shoppings/Create', [
            'raffles' => $raffles,
            'paymentMethods' => $paymentMethods
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'raffle_id' => 'required|exists:raffles,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'name' => 'required|string|max:150',
            'dni' => 'nullable|string|max:50',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:150',
            'quantity' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0',
            'reference' => 'nullable|string|max:255',
            'voucher' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'required|in:pending,paid,rejected',
        ]);

        $voucherPath = null;
        if ($request->hasFile('voucher')) {
            $voucherPath = $request->file('voucher')->store('vouchers', 'public');
        }

        \App\Models\Shopping::create([
            'raffle_id' => $validated['raffle_id'],
            'payment_method_id' => $validated['payment_method_id'],
            'name' => $validated['name'],
            'dni' => $validated['dni'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'quantity' => $validated['quantity'],
            'amount' => $validated['amount'],
            'reference' => $validated['reference'],
            'voucher' => $voucherPath,
            'status' => $validated['status'],
        ]);

        return redirect()->route('shoppings.index')->with('success', 'Venta registrada exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $shopping = \App\Models\Shopping::findOrFail($id);
        $raffles = \App\Models\Raffle::all();
        $paymentMethods = \App\Models\PaymentMethod::all();
        return \Inertia\Inertia::render('Shoppings/Edit', [
            'shopping' => $shopping,
            'raffles' => $raffles,
            'paymentMethods' => $paymentMethods
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $shopping = \App\Models\Shopping::findOrFail($id);

        $validated = $request->validate([
            'raffle_id' => 'required|exists:raffles,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'name' => 'required|string|max:150',
            'dni' => 'nullable|string|max:50',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:150',
            'quantity' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0',
            'reference' => 'nullable|string|max:255',
            'status' => 'required|in:pending,paid,rejected',
            'voucher' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $validated;
        unset($data['voucher']); // Handle voucher separately

        if ($request->hasFile('voucher')) {
            $data['voucher'] = $request->file('voucher')->store('vouchers', 'public');
        }

        $shopping->update($data);

        return redirect()->route('shoppings.index')->with('success', 'Venta actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $shopping = \App\Models\Shopping::findOrFail($id);
        $shopping->delete();

        return redirect()->route('shoppings.index')->with('success', 'Venta eliminada exitosamente.');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'type' => 'required|in:dni,email',
            'value' => 'required|string',
        ]);

        $query = \App\Models\Shopping::with(['raffle'])
            ->where('status', 'paid'); // Only paid tickets are valid

        switch ($request->type) {
            case 'dni':
                $query->where('dni', $request->value);
                break;
            case 'email':
                $query->where('email', $request->value);
                break;
        }

        $tickets = $query->get();

        return response()->json([
            'valid' => $tickets->isNotEmpty(),
            'tickets' => $tickets
        ]);
    }
}
