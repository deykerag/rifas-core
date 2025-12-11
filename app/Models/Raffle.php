<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Raffle extends Model
{
    protected $fillable = [
        'description',
        'tickets_quantity',
        'price_usd',
        'price_bs',
        'image',
        'status',
        'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function awards()
    {
        return $this->hasMany(Award::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function shoppings()
    {
        return $this->hasMany(Shopping::class);
    }
}
