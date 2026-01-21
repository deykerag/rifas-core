<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'currency_id',
        'name',
        'description',
        'status',
    ];

    public function shoppings()
    {
        return $this->hasMany(Shopping::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
    
}
