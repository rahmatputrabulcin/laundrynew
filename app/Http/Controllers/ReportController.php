<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Customer;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function transactions(Request $request)
    {
        $date_from = $request->date_from ?? now()->format('Y-m-01');
        $date_to = $request->date_to ?? now()->format('Y-m-d');
        $customer_id = $request->customer_id;
        $status = $request->status;

        $query = Transaction::with('customer')
            ->whereBetween('created_at', [$date_from, $date_to]);

        if ($customer_id) {
            $query->where('customer_id', $customer_id);
        }
        if ($status) {
            $query->where('status', $status);
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        $total_income = $transactions->sum('final_total');
        $total_count = $transactions->count();

        return inertia('Reports/Transactions', [
            'transactions' => $transactions,
            'customers' => Customer::all(),
            'filters' => [
                'date_from' => $date_from,
                'date_to' => $date_to,
                'customer_id' => $customer_id,
                'status' => $status,
            ],
            'total_income' => $total_income,
            'total_count' => $total_count,
        ]);
    }
}
