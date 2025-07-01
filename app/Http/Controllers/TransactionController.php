<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Service;
use App\Models\StatusLog;
use Illuminate\Http\Request;
use App\Exports\TransactionsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        // $transactions = Transaction::with('customer')->latest()->get();
        $query = Transaction::with('customer');

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->customer_name) {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->customer_name . '%');
            });
        }
        // Filter tanggal
        if ($request->date_start) {
            $query->whereDate('created_at', '>=', $request->date_start);
        }
        if ($request->date_end) {
            $query->whereDate('created_at', '<=', $request->date_end);
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(10);

        return inertia('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'customer_name', 'date_start', 'date_end']),
        ]);
    }

    public function create()
    {
        $customers = Customer::all();
        $services = Service::all();
        $products = Product::all();
        return inertia('Transactions/Create', [
            'customers' => $customers,
            'services' => $services,
            'products' => $products,
            'invoiceNumber' => $this->generateInvoiceNumber(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'invoice_number' => 'required|string|unique:transactions',
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.is_express' => 'boolean',
            'total_amount' => 'required|numeric|min:0',
            'discount_type' => 'nullable|in:amount,percent',
            'discount_value' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'required|in:lunas,belum lunas',
            'notes' => 'nullable|string',
            'estimated_completion' => 'nullable|date',
        ]);

        // Hitung final_total
        $totalAmount = $request->total_amount;
        $discountType = $request->discount_type;
        $discountValue = $request->discount_value ?? 0;
        $finalTotal = $totalAmount;

        if ($discountType === 'amount') {
            $finalTotal = $totalAmount - $discountValue;
        } elseif ($discountType === 'percent') {
            $finalTotal = $totalAmount - ($totalAmount * $discountValue / 100);
        }

        // Pastikan final_total tidak negatif
        $finalTotal = max($finalTotal, 0);

        $invoiceNumber = $this->generateInvoiceNumber();
        $transaction = Transaction::create([
            'invoice_number' => $invoiceNumber,
            'customer_id' => $request->customer_id,
            'total_amount' => $totalAmount,
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'final_total' => $finalTotal,
            'paid_amount' => $request->paid_amount ?? 0,
            'payment_status' => $request->payment_status,
            'status' => 'pending',
            'estimated_completion' => $request->estimated_completion,
            'notes' => $request->notes,
        ]);

        foreach ($request->items as $item) {
            $service = Service::find($item['service_id']);
            $price = $service->price;
            $subtotal = $price * $item['quantity'];
            $transaction->details()->create([
                'service_id' => $item['service_id'],
                'quantity' => $item['quantity'],
                'price' => $price,
                'subtotal' => $subtotal,
                'is_express' => $item['is_express'] ?? false,
                'notes' => $item['notes'] ?? null,
            ]);
        }

        return redirect()->route('transactions.show', $transaction->id)
            ->with('success', 'Transaction created successfully.');
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['customer', 'details.service']);
        $statusLogs = $transaction->statusLogs()->with('user')->orderBy('created_at', 'desc')->get();
        return inertia('Transactions/Show', [
            'transaction' => $transaction,
            'auth' => [
                'user' => auth()->user()
            ],
            'statusLogs' => $statusLogs,

        ]);
    }

    public function edit(Transaction $transaction)
    {
        $transaction->load(['customer', 'details.service']);
        $customers = Customer::all();
        $services = Service::all();

        return inertia('Transactions/Edit', [
            'transaction' => $transaction,
            'customers' => $customers,
            'services' => $services,
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'discount_type' => 'nullable|in:amount,percent',
            'discount_value' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'payment_status' => 'required|in:lunas,belum lunas',
            'status' => 'required|in:pending,proses,selesai,ambil,antar',
            'estimated_completion' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        // Hitung final_total
        $totalAmount = $transaction->total_amount;
        $discountType = $request->discount_type;
        $discountValue = $request->discount_value ?? 0;
        $finalTotal = $totalAmount;

        if ($discountType === 'amount') {
            $finalTotal = $totalAmount - $discountValue;
        } elseif ($discountType === 'percent') {
            $finalTotal = $totalAmount - ($totalAmount * $discountValue / 100);
        }
        $finalTotal = max($finalTotal, 0);

        $transaction->update([
            'customer_id' => $request->customer_id,
            'discount_type' => $discountType,
            'discount_value' => $discountValue,
            'final_total' => $finalTotal,
            'paid_amount' => $request->paid_amount ?? 0,
            'payment_status' => $request->payment_status,
            'status' => $request->status,
            'estimated_completion' => $request->estimated_completion,
            'notes' => $request->notes,
        ]);

        // Update status-specific timestamps
        if ($request->status === 'completed' && !$transaction->completed_at) {
            $transaction->update(['completed_at' => now()]);
        } elseif ($request->status === 'delivered' && !$transaction->delivered_at) {
            $transaction->update(['delivered_at' => now()]);
        }

        return redirect()->route('transactions.show', $transaction->id)
            ->with('success', 'Transaction updated successfully.');
    }

    public function updateStatus(Request $request, Transaction $transaction)
    {
        \Log::info('UpdateStatus called', ['status' => $request->status]);
        $request->validate([
            'status' => 'required|in:pending,proses,selesai,ambil,antar',
        ]);

        $oldStatus = $transaction->status;

        $transaction->update(['status' => $request->status]);

        // Catat log perubahan status
        if ($oldStatus !== $request->status) {
            StatusLog::create([
                'transaction_id' => $transaction->id,
                'old_status' => $oldStatus,
                'new_status' => $request->status,
                'user_id' => auth()->id(),
            ]);
        }

        // Update status-specific timestamps jika perlu
        if ($request->status === 'selesai' && !$transaction->completed_at) {
            $transaction->update(['completed_at' => now()]);
        } elseif ($request->status === 'ambil' && !$transaction->delivered_at) {
            $transaction->update(['delivered_at' => now()]);
        } elseif ($request->status === 'antar' && !$transaction->delivered_at) {
            $transaction->update(['delivered_at' => now()]);
        }

        return redirect()->route('transactions.show', $transaction->id)
            ->with('success', 'Status transaksi berhasil diupdate.');
    }

    public function updatePayment(Request $request, Transaction $transaction)
    {
        $request->validate([
            'paid_amount' => 'required|numeric|min:0',
            'payment_status' => 'required|in:lunas,belum lunas',
        ]);

        $transaction->update([
            'paid_amount' => $request->paid_amount,
            'payment_status' => $request->payment_status,
        ]);

        return back()->with('success', 'Payment updated successfully.');
    }

    private function generateInvoiceNumber()
    {
        $prefix = 'INV-';
        $date = date('Ymd');
        $lastInvoice = Transaction::where('invoice_number', 'like', $prefix . $date . '%')
            ->orderBy('id', 'desc')
            ->first();

        if ($lastInvoice) {
            $lastNumber = (int) substr($lastInvoice->invoice_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . $date . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }

    public function print(Transaction $transaction)
    {
        $transaction->load(['customer', 'details.service']);
        return inertia('Transactions/Print', [
            'transaction' => $transaction,
        ]);
    }

public function export(Request $request)
{
    $filters = $request->only(['status', 'customer_name', 'date_start', 'date_end']);
    return Excel::download(new TransactionsExport($filters), 'transactions.xlsx');
}

public function exportPdf(Request $request)
{
    $query = Transaction::with('customer');

    if ($request->status) {
        $query->where('status', $request->status);
    }
    if ($request->customer_name) {
        $query->whereHas('customer', function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->customer_name . '%');
        });
    }
    if ($request->date_start) {
        $query->whereDate('created_at', '>=', $request->date_start);
    }
    if ($request->date_end) {
        $query->whereDate('created_at', '<=', $request->date_end);
    }

    $transactions = $query->get();

    $pdf = Pdf::loadView('exports.transactions_pdf', compact('transactions'));
    return $pdf->download('transactions.pdf');
}

public function printPdf(Transaction $transaction)
{
    $transaction->load(['customer', 'details.service']);
    $pdf = Pdf::loadView('exports.transaction_struk', compact('transaction'));
    return $pdf->download('struk-'.$transaction->invoice_number.'.pdf');
}
}
