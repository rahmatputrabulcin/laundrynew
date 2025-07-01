<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
     use HasFactory, Blameable;

    protected $fillable = ['name', 'price', 'description'];
}
