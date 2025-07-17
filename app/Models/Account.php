<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'amount' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'amount',
        'investor_id',
        'is_active'
    ];

    /**
     * Get the investor that owns the account record.
     */
    public function investor(): BelongsTo
    {
        return $this->belongsTo(Investor::class);
    }
}
