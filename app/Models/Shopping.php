<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shopping extends Model
{
    protected $fillable = [
        'raffle_id',
        'payment_method_id',
        'name',
        'dni',
        'phone',
        'email',
        'quantity',
        'amount',
        'reference',
        'voucher',
        'status',
        'assigned_numbers',
    ];

    protected $casts = [
        'assigned_numbers' => 'array',
    ];

    public function raffle()
    {
        return $this->belongsTo(Raffle::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }
}
