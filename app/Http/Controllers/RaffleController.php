<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Raffle;
use App\Models\Shopping;
use Inertia\Inertia;

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
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

    public function winnerSearchView()
    {
        return Inertia::render('WinnerSearch', [
            'raffles' => Raffle::orderBy('created_at', 'desc')->get(),
        ]);
    }

    public function findWinner(Request $request)
    {
        $request->validate([
            'raffle_id' => 'required',
            'winner_number' => 'required',
        ]);

        $inputNumber = trim($request->winner_number);

        // Log para debugging
        \Log::info('Winner search request', [
            'raffle_id' => $request->raffle_id,
            'input_number' => $inputNumber
        ]);

        // Primero obtenemos la rifa para saber cuántos dígitos debe tener el número
        $raffle = Raffle::find($request->raffle_id);
        if (!$raffle) {
            return response()->json([
                'success' => false,
                'message' => 'Rifa no encontrada'
            ]);
        }

        // Determinamos el número de dígitos basado en la cantidad de tickets
        $ticketsQuantity = $raffle->tickets_quantity;
        $requiredDigits = strlen((string) ($ticketsQuantity - 1));

        // Normalizamos el número de entrada con el padding correcto
        $paddedNumber = str_pad($inputNumber, $requiredDigits, '0', STR_PAD_LEFT);

        \Log::info('Number normalization', [
            'tickets_quantity' => $ticketsQuantity,
            'required_digits' => $requiredDigits,
            'padded_number' => $paddedNumber
        ]);

        // Buscamos usando JSON_CONTAINS para coincidencia exacta
        $shopping = Shopping::where('raffle_id', $request->raffle_id)
            ->whereRaw('JSON_CONTAINS(assigned_numbers, ?)', ['"' . $paddedNumber . '"'])
            ->first();

        // Si no encontramos con el padding calculado, intentamos con el número original
        if (!$shopping && $paddedNumber !== $inputNumber) {
            $shopping = Shopping::where('raffle_id', $request->raffle_id)
                ->whereRaw('JSON_CONTAINS(assigned_numbers, ?)', ['"' . $inputNumber . '"'])
                ->first();
        }

        // Si aún no encontramos, intentamos con diferentes paddings (3, 4, 5 dígitos)
        if (!$shopping) {
            foreach ([3, 4, 5] as $digits) {
                $testNumber = str_pad($inputNumber, $digits, '0', STR_PAD_LEFT);
                $shopping = Shopping::where('raffle_id', $request->raffle_id)
                    ->whereRaw('JSON_CONTAINS(assigned_numbers, ?)', ['"' . $testNumber . '"'])
                    ->first();

                if ($shopping) {
                    \Log::info('Found with padding', ['digits' => $digits, 'number' => $testNumber]);
                    break;
                }
            }
        }

        if (!$shopping) {
            \Log::warning('Winner number not found', [
                'raffle_id' => $request->raffle_id,
                'searched_number' => $inputNumber,
                'padded_number' => $paddedNumber
            ]);

            return response()->json([
                'success' => false,
                'message' => "No se encontró el número " . $inputNumber . " en esta rifa"
            ]);
        }

        // Cargamos las relaciones después de encontrar el registro
        $shopping->load(['raffle', 'paymentMethod']);

        \Log::info('Winner found successfully', [
            'shopping_id' => $shopping->id,
            'winner_name' => $shopping->name
        ]);

        return response()->json([
            'success' => true,
            'shopping' => $shopping,
        ]);
    }
}
