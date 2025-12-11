<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialNetwork extends Model
{
    protected $fillable = [
        'platform',
        'url',
        'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
