<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    protected $fillable = [
        'description',
        'raffle_id',
    ];

    public function raffle()
    {
        return $this->belongsTo(Raffle::class);
    }
}
