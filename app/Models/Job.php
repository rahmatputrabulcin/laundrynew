<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
       'user_id', 'transaction_id', 'detail_id', 'jenis', 'jumlah_kilo', 'tarif_per_kilo', 'tanggal'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function transaction()
{
    return $this->belongsTo(\App\Models\Transaction::class);
}
public function detail()
{
    return $this->belongsTo(\App\Models\TransactionDetail::class, 'detail_id');
}

public function getTotalUpahAttribute()
{
    return $this->jumlah_kilo * $this->tarif_per_kilo;
}
}
