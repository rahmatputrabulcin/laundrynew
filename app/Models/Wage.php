<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wage extends Model
{
    protected $fillable = ['jenis', 'tarif_per_kilo'];
}
