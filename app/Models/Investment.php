<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Investment extends Model
{
     use HasFactory, SoftDeletes;

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'for_month',
        'amount',
        'account_id',
        'type'
    ];
}
