<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $fillable = [
        'symbol',
        "name",
    ];

    public function paymentMethod()
    {
        return $this->hasOne(PaymentMethod::class);
    }
}
