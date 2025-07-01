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
        'quantity',
        'price',
        'is_express',
        'subtotal',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'is_express' => 'boolean',
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
}
