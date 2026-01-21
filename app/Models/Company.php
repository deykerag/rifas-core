<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name',
        'email',
        'logo',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function raffles()
    {
        return $this->hasMany(Raffle::class);
    }

    public function socialNetworks()
    {
        return $this->hasMany(SocialNetwork::class);
    }
}
