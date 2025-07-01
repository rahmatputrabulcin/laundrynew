<?php
namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use Blameable;
    protected $fillable = [
        'title',
        'amount',
        'category',
        'expense_date',
        'description',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
    ];
}
