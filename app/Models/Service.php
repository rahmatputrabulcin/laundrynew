<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory, Blameable;

    protected $fillable = [
        'name',
        'price',
        'price_type',
        'is_express',
        'express_multiplier',
        'description'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'express_multiplier' => 'decimal:2',
        'is_express' => 'boolean',
    ];

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
