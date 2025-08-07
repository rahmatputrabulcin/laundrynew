<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'service_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
        'is_express',
        'express_fee',
        'notes'
    ];

    protected $casts = [
        'quantity' => 'float',
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'express_fee' => 'decimal:2',
        'is_express' => 'boolean'
    ];

    // Relasi ke transaksi induk
    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    // Relasi ke service
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    // Relasi ke produk
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
