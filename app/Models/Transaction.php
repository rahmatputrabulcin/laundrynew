<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, Blameable;

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'total_amount',
        'discount',
        'paid_amount',
        'status',
        'estimated_completion',
        'completed_at',
        'delivered_at',
        'notes',
        'discount_type',
        'discount_value',
        'final_total',
        'payment_status',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'estimated_completion' => 'datetime',
        'completed_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    // Relasi ke customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // Relasi ke detail transaksi
    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    // Sisa pembayaran
    public function getRemainingAmountAttribute()
    {
        return $this->total_amount - $this->discount - $this->paid_amount;
    }

    // Status lunas
    public function getIsPaidAttribute()
    {
        return $this->remaining_amount <= 0;
    }

    public function statusLogs()
    {
        return $this->hasMany(StatusLog::class);
    }
}
