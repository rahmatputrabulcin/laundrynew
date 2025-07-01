<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory, Blameable;

    protected $fillable = ['name', 'phone_number', 'email', 'address'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
