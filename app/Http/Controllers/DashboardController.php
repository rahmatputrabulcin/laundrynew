<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Product;
use App\Models\Service;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Counts
        $customersCount = Customer::count();
        $servicesCount = Service::count();
        $productsCount = Product::count();

        // Transactions
        $pendingTransactions = Transaction::where('status', 'pending')->count();
        $processingTransactions = Transaction::where('status', 'processing')->count();
        $completedTransactions = Transaction::where('status', 'completed')->count();
        $deliveredTransactions = Transaction::where('status', 'delivered')->count();

        // Revenue
        $totalRevenue = Transaction::sum('total_amount');
        $paidRevenue = Transaction::sum('paid_amount');
        $todayRevenue = Transaction::whereDate('created_at', today())->sum('total_amount');

        // Recent transactions
        $recentTransactions = Transaction::with('customer')
            ->latest()
            ->take(5)
            ->get();

        return inertia('Dashboard', [
            'stats' => [
                'customers' => $customersCount,
                'services' => $servicesCount,
                'products' => $productsCount,
                'transactions' => [
                    'pending' => $pendingTransactions,
                    'processing' => $processingTransactions,
                    'completed' => $completedTransactions,
                    'delivered' => $deliveredTransactions,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'paid' => $paidRevenue,
                    'today' => $todayRevenue,
                ],
            ],
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
