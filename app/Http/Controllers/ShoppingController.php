<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderApprovedMail;

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
            'reference' => 'nullable|string|max:255|unique:shoppings,reference',
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
            'raffle_id' => 'sometimes|required|exists:raffles,id',
            'payment_method_id' => 'sometimes|required|exists:payment_methods,id',
            'name' => 'sometimes|required|string|max:150',
            'dni' => 'sometimes|nullable|string|max:50',
            'phone' => 'sometimes|required|string|max:50',
            'email' => 'sometimes|required|email|max:150',
            'quantity' => 'sometimes|required|integer|min:1',
            'amount' => 'sometimes|required|numeric|min:0',
            'reference' => 'sometimes|nullable|string|max:255|unique:shoppings,reference,' . $id,
            'status' => 'sometimes|required|in:pending,paid,rejected',
            'voucher' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $data = $validated;
        unset($data['voucher']); // Handle voucher separately

        if (isset($data['status']) && $data['status'] === 'rejected') {
            $data['quantity'] = 0;
            $data['amount'] = 0;
            $data['reference'] = null;
            $data['assigned_numbers'] = null;
        }

        if ($request->hasFile('voucher')) {
            $data['voucher'] = $request->file('voucher')->store('vouchers', 'public');
        }

        $oldStatus = $shopping->status;
        $shopping->update($data);

        if ($oldStatus !== 'paid' && $shopping->status === 'paid') {
            Mail::to($shopping->email)->send(new OrderApprovedMail($shopping));
        }

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

        $query = \App\Models\Shopping::with(['raffle']);

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

    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'raffle_id' => 'required|exists:raffles,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'name' => 'required|string|max:150',
            'dni' => 'required|string|max:50',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|max:150',
            'quantity' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0',
            'reference' => 'required|string|max:255|unique:shoppings,reference',
            'voucher' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        ]);

        // Get Raffle configuration
        $raffle = \App\Models\Raffle::findOrFail($validated['raffle_id']);
        $maxTickets = $raffle->tickets_quantity;
        
        // Determine padding based on maxTickets (e.g. 100 -> 2 digits, 1000 -> 3 digits)
        $digits = strlen((string)($maxTickets - 1));

        // Get already assigned numbers for this raffle
        $usedNumbers = \App\Models\Shopping::where('raffle_id', $raffle->id)
            ->whereIn('status', ['pending', 'paid']) // Consider pending as reserved
            ->pluck('assigned_numbers')
            ->flatten()
            ->toArray();

        // Check availability
        $availableCount = $maxTickets - count($usedNumbers);
        if ($validated['quantity'] > $availableCount) {
             return response()->json([
                'message' => 'No hay suficientes tickets disponibles. Quedan ' . $availableCount
             ], 422);
        }

        // Generate unique random numbers
        $assignedNumbers = [];
        $needed = $validated['quantity'];
        
        // Strategy: if needed is small relative to max, random guessing is efficient.
        // If needed is large, shuffling an array of available is better? 
        // For now, random guess loop with safety is standard for typical raffle sizes.
        
        // Optimizing for larger datasets:
        // Create a pool of available numbers if usage is high could be memory intensive.
        // Let's rely on a generation loop for now, assuming sufficient sparsity.
        // If raffle is almost full, this might be slow, but it's a start.
        
        while (count($assignedNumbers) < $needed) {
            $num = mt_rand(0, $maxTickets - 1);
            $formattedNum = str_pad((string)$num, $digits, '0', STR_PAD_LEFT);
            
            if (!in_array($formattedNum, $usedNumbers) && !in_array($formattedNum, $assignedNumbers)) {
                $assignedNumbers[] = $formattedNum;
            }
            
            // Safety break just in case (though validation above should prevent infinite loop)
            if (count($usedNumbers) + count($assignedNumbers) >= $maxTickets) {
                break;
            }
        }

        $voucherPath = $request->file('voucher')->store('vouchers', 'public');

        $shopping = \App\Models\Shopping::create([
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
            'status' => 'pending',
            'assigned_numbers' => $assignedNumbers,
        ]);

        return response()->json([
            'message' => 'Compra registrada exitosamente',
            'shopping' => $shopping,
            'tickets' => $assignedNumbers
        ]);
    }
}
