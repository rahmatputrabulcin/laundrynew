<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatusLog extends Model
{
    protected $fillable = [
        'transaction_id',
        'old_status',
        'new_status',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
