<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Customer;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TransactionReportExport;
use PDF;

class ReportController extends Controller
{
    public function transactions(Request $request)
    {
        $query = Transaction::with(['customer', 'details.service'])
            ->orderBy('transaction_date', 'desc');

        // Apply filters
        if ($request->date_from) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        if ($request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        // Handle export
        if ($request->export) {
            return $this->exportTransactions($request);
        }

        // Get transactions with pagination
        $transactions = $query->paginate(20)->withQueryString();

        // Calculate statistics
        $statsQuery = clone $query;
        $allTransactions = $statsQuery->get();
        
        $stats = [
            'total_count' => $allTransactions->count(),
            'total_income' => $allTransactions->where('payment_status', 'lunas')->sum('final_total'),
            'total_pending' => $allTransactions->where('payment_status', '!=', 'lunas')
                ->sum(function($transaction) {
                    return $transaction->final_total - $transaction->paid_amount;
                }),
            'total_gross' => $allTransactions->sum('final_total'),
        ];

        return Inertia::render('Reports/Transactions', [
            'transactions' => $transactions,
            'customers' => Customer::select('id', 'name')->get(),
            'services' => Service::select('id', 'name')->get(),
            'filters' => $request->only(['date_from', 'date_to', 'customer_id', 'status', 'payment_status']),
            'stats' => $stats,
        ]);
    }

    public function exportTransactions(Request $request)
    {
        $query = Transaction::with(['customer', 'details.service'])
            ->orderBy('transaction_date', 'desc');

        // Apply same filters
        if ($request->date_from) {
            $query->whereDate('transaction_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('transaction_date', '<=', $request->date_to);
        }

        if ($request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        // If specific IDs selected
        if ($request->ids) {
            $ids = explode(',', $request->ids);
            $query->whereIn('id', $ids);
        }

        $transactions = $query->get();

        $filename = 'laporan-transaksi-' . date('Y-m-d');

        if ($request->export === 'excel') {
            return Excel::download(new TransactionReportExport($transactions), $filename . '.xlsx');
        }

        if ($request->export === 'pdf') {
            $pdf = PDF::loadView('exports.transactions-pdf', compact('transactions'));
            return $pdf->download($filename . '.pdf');
        }
    }

    public function newreport() {
        return Inertia::render('Reports/NewReport');
    }
}
