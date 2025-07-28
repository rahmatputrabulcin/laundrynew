<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'transaction_date',
        'estimated_completion',
        'total_amount',
        'final_total',
        'paid_amount',
        'payment_status',
        'status',
        'discount_type',
        'discount_value',
        'notes'
    ];

    protected $casts = [
        'transaction_date' => 'date:Y-m-d', // ← Format tanggal
        'estimated_completion' => 'date:Y-m-d', // ← Format tanggal
        'total_amount' => 'decimal:2',
        'final_total' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'status' => 'string',
        'payment_status' => 'string'
    ];
    // Mutator: pastikan status dan payment_status selalu string
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = is_string($value) ? $value : (string)$value;
    }

    public function setPaymentStatusAttribute($value)
    {
        $this->attributes['payment_status'] = is_string($value) ? $value : (string)$value;
    }

    // Accessor untuk memastikan format tanggal konsisten
    public function getTransactionDateAttribute($value)
    {
        return $value ? \Carbon\Carbon::parse($value)->format('Y-m-d') : null;
    }

    public function getEstimatedCompletionAttribute($value)
    {
        return $value ? \Carbon\Carbon::parse($value)->format('Y-m-d') : null;
    }

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
    // Mutator: pastikan field decimal selalu float, walau input string/null
    public function setTotalAmountAttribute($value)
    {
        $this->attributes['total_amount'] = is_numeric($value) ? (float)$value : 0;
    }

    public function setFinalTotalAttribute($value)
    {
        $this->attributes['final_total'] = is_numeric($value) ? (float)$value : 0;
    }

    public function setPaidAmountAttribute($value)
    {
        $this->attributes['paid_amount'] = is_numeric($value) ? (float)$value : 0;
    }

    public function setDiscountValueAttribute($value)
    {
        $this->attributes['discount_value'] = is_numeric($value) ? (float)$value : 0;
    }
}
