<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Customer;
use App\Models\Service;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['customer', 'details.service', 'details.product']);

        // Filter berdasarkan search (invoice number atau customer)
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%");
                    });
            });
        }

        // Filter berdasarkan nama customer (terpisah dari search umum)
        if ($request->filled('customer_name')) {
            $customerName = trim($request->customer_name);
            $query->whereHas('customer', function ($customerQuery) use ($customerName) {
                $customerQuery->where('name', 'like', "%{$customerName}%");
            });
        }

        // Filter berdasarkan status transaksi
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter berdasarkan status pembayaran
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter berdasarkan rentang tanggal transaksi
        if ($request->filled('date_start')) {
            $query->whereDate('transaction_date', '>=', $request->date_start);
        }

        if ($request->filled('date_end')) {
            $query->whereDate('transaction_date', '<=', $request->date_end);
        }

        // Filter berdasarkan rentang estimasi selesai
        if ($request->filled('estimation_start')) {
            $query->whereDate('estimated_completion', '>=', $request->estimation_start);
        }

        if ($request->filled('estimation_end')) {
            $query->whereDate('estimated_completion', '<=', $request->estimation_end);
        }

        // Filter berdasarkan range amount
        if ($request->filled('min_amount') && is_numeric($request->min_amount)) {
            $query->where('final_total', '>=', $request->min_amount);
        }

        if ($request->filled('max_amount') && is_numeric($request->max_amount)) {
            $query->where('final_total', '<=', $request->max_amount);
        }

        // Filter untuk transaksi yang terlambat
        if ($request->boolean('is_overdue')) {
            $query->where('estimated_completion', '<', now())
                ->whereNotIn('status', ['completed', 'delivered', 'cancelled']);
        }

        // Filter untuk transaksi hari ini
        if ($request->boolean('today')) {
            $query->whereDate('transaction_date', today());
        }

        // Filter untuk transaksi express
        if ($request->boolean('is_express')) {
            $query->whereHas('details', function ($detailQuery) {
                $detailQuery->where('is_express', true);
            });
        }

        // Sort berdasarkan parameter
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['created_at', 'transaction_date', 'estimated_completion', 'final_total', 'invoice_number'];
        if (in_array($sortBy, $allowedSorts)) {

            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Clone query untuk total filtered
        $filteredQuery = clone $query;

        // Debug query untuk development
        if (config('app.debug')) {
            \Log::info('Transaction Query', [
                'sql' => $query->toSql(),
                'bindings' => $query->getBindings(),
                'filters' => $request->all()
            ]);
        }

        $transactions = $query->paginate(15)->withQueryString();

        // Statistik global (semua data)
        $globalStats = [
            'total_transactions' => Transaction::count(),
            'total_revenue' => Transaction::where('payment_status', 'lunas')->sum('final_total'),
            'total_amount_due' => Transaction::where('payment_status', '!=', 'lunas')->sum('final_total'),
            'total_paid' => Transaction::sum('paid_amount'),
            'total_gross' => Transaction::sum('final_total'), // Total keseluruhan tanpa filter
            'pending_count' => Transaction::where('status', 'pending')->count(),
            'processing_count' => Transaction::where('status', 'processing')->count(),
            'completed_count' => Transaction::where('status', 'completed')->count(),
            'delivered_count' => Transaction::where('status', 'delivered')->count(),
            'cancelled_count' => Transaction::where('status', 'cancelled')->count(),
            'overdue_count' => Transaction::where('estimated_completion', '<', now())
                ->whereNotIn('status', ['completed', 'delivered', 'cancelled'])
                ->count(),
            'unpaid_count' => Transaction::where('payment_status', 'belum lunas')->count(),
            'dp_count' => Transaction::where('payment_status', 'dp')->count(),
            'lunas_count' => Transaction::where('payment_status', 'lunas')->count(),
            'express_count' => Transaction::whereHas('details', function ($q) {
                $q->where('is_express', true);
            })->count(),
        ];

        // Statistik periode (hari ini, minggu ini, bulan ini)
        $periodStats = [
            'today_transactions' => Transaction::whereDate('transaction_date', today())->count(),
            'today_revenue' => Transaction::whereDate('transaction_date', today())
                ->where('payment_status', 'lunas')
                ->sum('final_total'),
            'today_total' => Transaction::whereDate('transaction_date', today())->sum('final_total'),

            'week_transactions' => Transaction::whereBetween('transaction_date', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'week_revenue' => Transaction::whereBetween('transaction_date', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])
                ->where('payment_status', 'lunas')
                ->sum('final_total'),
            'week_total' => Transaction::whereBetween('transaction_date', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->sum('final_total'),

            'month_transactions' => Transaction::whereMonth('transaction_date', now()->month)
                ->whereYear('transaction_date', now()->year)
                ->count(),
            'month_revenue' => Transaction::whereMonth('transaction_date', now()->month)
                ->whereYear('transaction_date', now()->year)
                ->where('payment_status', 'lunas')
                ->sum('final_total'),
            'month_total' => Transaction::whereMonth('transaction_date', now()->month)
                ->whereYear('transaction_date', now()->year)
                ->sum('final_total'),

            'year_transactions' => Transaction::whereYear('transaction_date', now()->year)->count(),
            'year_revenue' => Transaction::whereYear('transaction_date', now()->year)
                ->where('payment_status', 'lunas')
                ->sum('final_total'),
            'year_total' => Transaction::whereYear('transaction_date', now()->year)->sum('final_total'),
        ];

        // Statistik hasil filter saat ini
        $filteredStats = [
            'filtered_count' => $filteredQuery->count(),
            'filtered_total' => $filteredQuery->sum('final_total'),
            'filtered_paid' => $filteredQuery->sum('paid_amount'),
            'filtered_revenue' => $filteredQuery->where('payment_status', 'lunas')->sum('final_total'),
            'filtered_pending_amount' => $filteredQuery->where('payment_status', '!=', 'lunas')
                ->sum('final_total'),
        ];

        // Gabungkan semua stats
        $stats = array_merge($globalStats, $periodStats, $filteredStats);

        // Top customers - Solusi paling mudah
        // $topCustomers = Customer::select('customers.*')
        //                    ->selectRaw('COUNT(transactions.id) as total_transactions')
        //                    ->selectRaw('SUM(transactions.final_total) as total_amount')
        //                    ->join('transactions', 'customers.id', '=', 'transactions.customer_id')
        //                    ->groupBy('customers.id') // Hanya group by primary key
        //                    ->orderBy('total_amount', 'desc')
        //                    ->limit(5)
        //                    ->get();

        $topCustomers = Customer::select(
            'customers.id',
            'customers.name',
            'customers.phone_number',
            'customers.address',
            'customers.email',
            'customers.created_at',
            'customers.updated_at'
        )
            ->selectRaw('COUNT(transactions.id) as total_transactions')
            ->selectRaw('SUM(transactions.final_total) as total_amount')
            ->join('transactions', 'customers.id', '=', 'transactions.customer_id')
            ->groupBy(
                'customers.id',
                'customers.name',
                'customers.phone_number',
                'customers.address',
                'customers.email',
                'customers.created_at',
                'customers.updated_at'
            )
            ->orderBy('total_amount', 'desc')
            ->limit(5)
            ->get();


        // Service paling populer - Solusi paling mudah
        // $popularServices = Service::select('services.*')
        //     ->selectRaw('COUNT(transaction_details.id) as usage_count')
        //     ->selectRaw('SUM(transaction_details.subtotal) as total_revenue')
        //     ->join('transaction_details', 'services.id', '=', 'transaction_details.service_id')
        //     ->groupBy('services.id') // Hanya group by primary key
        //     ->orderBy('usage_count', 'desc')
        //     ->limit(5)
        //     ->get();
        $popularServices = Service::select(
            'services.id',
            'services.name',
            'services.price',
            'services.price_type',
            'services.description',
            'services.created_at',
            'services.updated_at'
        )
            ->selectRaw('COUNT(transaction_details.id) as usage_count')
            ->selectRaw('SUM(transaction_details.subtotal) as total_revenue')
            ->join('transaction_details', 'services.id', '=', 'transaction_details.service_id')
            ->groupBy(
                'services.id',
                'services.name',
                'services.price',
                'services.price_type',
                'services.description',
                'services.created_at',
                'services.updated_at'
            )
            ->orderBy('usage_count', 'desc')
            ->limit(5)
            ->get();


        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only([
                'search',
                'customer_name',
                'status',
                'payment_status',
                'date_start',
                'date_end',
                'estimation_start',
                'estimation_end',
                'min_amount',
                'max_amount',
                'is_overdue',
                'today',
                'is_express',
                'sort_by',
                'sort_order'
            ]),
            'stats' => $stats,
            'topCustomers' => $topCustomers,
            'popularServices' => $popularServices
        ]);
    }

    public function create()
    {
        $customers = Customer::orderBy('name')->get();
        $services = Service::orderBy('name')->get();
        $products = Product::orderBy('name')->get();

        $lastTransaction = Transaction::latest()->first();
        $invoiceNumber = 'INV-' . date('Ymd') . '-' . str_pad(($lastTransaction ? $lastTransaction->id + 1 : 1), 4, '0', STR_PAD_LEFT);

        return Inertia::render('Transactions/Create', [
            'customers' => $customers,
            'services' => $services,
            'products' => $products,
            'invoiceNumber' => $invoiceNumber
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'invoice_number' => 'required|string',
                'customer_id' => 'required|exists:customers,id',
                'transaction_date' => 'required|date',
                'estimated_completion' => 'required|date',
                'total_amount' => 'required|numeric|min:0',
                'items' => 'required|array|min:1',
                'status' => 'nullable|string',
                'payment_status' => 'nullable|string',
            ]);
            $status = $request->status;
            if (!is_string($status) || trim($status) === '') {
                Log::warning('[STORE] Status kosong/tidak string, fallback ke "pending"', ['status' => $status]);
                $status = 'pending';
            }
            $paymentStatus = $request->payment_status;
            if (!is_string($paymentStatus) || trim($paymentStatus) === '') {
                Log::warning('[STORE] Payment status kosong/tidak string, fallback ke "belum lunas"', ['payment_status' => $paymentStatus]);
                $paymentStatus = 'belum lunas';
            }
            DB::beginTransaction();

            // Hitung ulang total dari items
            $calculatedTotal = 0;
            $discount = $request->discount_value ?? 0;

            foreach ($request->items as $item) {
                $itemSubtotal = $item['quantity'] * $item['price'];
                $expressFeé = ($item['is_express'] ?? false) ? ($item['express_fee'] ?? 0) : 0;
                $calculatedTotal += $itemSubtotal + $expressFeé;
            }

            // Apply discount
            $finalTotal = $calculatedTotal;
            if ($request->discount_type === 'amount') {
                $finalTotal = $calculatedTotal - $discount;
            } elseif ($request->discount_type === 'percent') {
                $finalTotal = $calculatedTotal - ($calculatedTotal * $discount / 100);
            }
            $finalTotal = max(0, $finalTotal);

            $transaction = Transaction::create([
                'invoice_number' => $request->invoice_number,
                'customer_id' => $request->customer_id,
                'transaction_date' => $request->transaction_date,
                'estimated_completion' => $request->estimated_completion,
                'total_amount' => $calculatedTotal,
                'final_total' => $finalTotal,
                'paid_amount' => $request->paid_amount ?? 0,
                'status' => $status,
                'payment_status' => $paymentStatus,
                'discount_type' => $request->discount_type,
                'discount_value' => $discount,
                'notes' => $request->notes
            ]);

            foreach ($request->items as $item) {
                $itemSubtotal = $item['quantity'] * $item['price'];
                $isExpress = ($item['is_express'] ?? false) && $item['type'] === 'service';
                $expressFeé = $isExpress ? ($item['express_fee'] ?? 0) : 0;
                $totalSubtotal = $itemSubtotal + $expressFeé;

                // Base detail data
                $detailData = [
                    'transaction_id' => $transaction->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $totalSubtotal,
                    'is_express' => $isExpress,
                    'express_fee' => $expressFeé,
                    'notes' => $item['notes'] ?? null,
                    'service_id' => null,
                    'product_id' => null
                ];

                // Set service_id atau product_id
                if ($item['type'] === 'service' && !empty($item['service_id'])) {
                    $detailData['service_id'] = $item['service_id'];
                } elseif ($item['type'] === 'product' && !empty($item['product_id'])) {
                    $detailData['product_id'] = $item['product_id'];
                    // Product tidak bisa express
                    $detailData['is_express'] = false;
                    $detailData['express_fee'] = 0;
                    $detailData['subtotal'] = $itemSubtotal;
                }

                TransactionDetail::create($detailData);
            }

            DB::commit();

            return redirect()->route('transactions.index')
                ->with('success', 'Transaksi berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Transaction creation failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal membuat transaksi: ' . $e->getMessage()])->withInput();
        }
    }

    public function show($id)
    {
        try {
            $transaction = Transaction::with([
                'customer',
                'details.service',
                'details.product'
            ])->findOrFail($id);

            return Inertia::render('Transactions/Show', [
                'transaction' => $transaction
            ]);
        } catch (\Exception $e) {
            return redirect()->route('transactions.index')
                ->with('error', 'Transaksi tidak ditemukan.');
        }
    }

    public function edit($id)
    {
        try {
            $transaction = Transaction::with(['customer', 'details.service', 'details.product'])->findOrFail($id);
            $customers = Customer::orderBy('name')->get();
            $services = Service::orderBy('name')->get();
            $products = Product::orderBy('name')->get();

            // Format tanggal untuk input date HTML
            $transaction->transaction_date = $transaction->transaction_date ?
                \Carbon\Carbon::parse($transaction->transaction_date)->format('Y-m-d') : '';
            $transaction->estimated_completion = $transaction->estimated_completion ?
                \Carbon\Carbon::parse($transaction->estimated_completion)->format('Y-m-d') : '';

            return Inertia::render('Transactions/Edit', [
                'transaction' => $transaction,
                'customers' => $customers,
                'services' => $services,
                'products' => $products
            ]);
        } catch (\Exception $e) {
            return redirect()->route('transactions.index')
                ->with('error', 'Transaksi tidak ditemukan.');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $transaction = Transaction::findOrFail($id);

            // Log payload mentah dan tipe data untuk debug value status/payment_status dari frontend
            Log::info('[DEBUG] Payload update transaksi', [
                'status_raw' => $request->status,
                'status_type' => gettype($request->status),
                'payment_status_raw' => $request->payment_status,
                'payment_status_type' => gettype($request->payment_status),
                'all' => $request->all()
            ]);

            $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'transaction_date' => 'required|date',
                'estimated_completion' => 'required|date',
                'status' => 'required|string',
                'payment_status' => 'required|string',
                'paid_amount' => 'required|numeric|min:0'
            ]);
            // Mapping status dari frontend ke enum DB
            $statusMap = [
                'pending' => 'pending',
                'processing' => 'proses',
                'proses' => 'proses',
                'completed' => 'selesai',
                'selesai' => 'selesai',
                'delivered' => 'ambil',
                'ambil' => 'ambil',
                'antar' => 'antar',
                'cancelled' => 'pending' // fallback
            ];
            $validStatus = array_values($statusMap);
            $validPaymentStatus = ['belum lunas', 'dp', 'lunas'];
            $statusRaw = (string) $request->status;
            $status = isset($statusMap[$statusRaw]) ? $statusMap[$statusRaw] : 'pending';
            $paymentStatus = (string) $request->payment_status;
            if (!in_array($status, $validStatus, true)) {
                Log::error('[UPDATE] Status tidak valid, update dibatalkan', ['status' => $status, 'request' => $request->all()]);
                return back()->withErrors(['error' => 'Status transaksi tidak valid. Mohon pilih status yang benar.'])->withInput();
            }
            if (!in_array($paymentStatus, $validPaymentStatus, true)) {
                Log::error('[UPDATE] Payment status tidak valid, update dibatalkan', ['payment_status' => $paymentStatus, 'request' => $request->all()]);
                return back()->withErrors(['error' => 'Status pembayaran tidak valid. Mohon pilih status yang benar.'])->withInput();
            }
            // Konversi manual agar field numerik tidak string kosong/null
            $paidAmount = is_numeric($request->paid_amount) ? (float)$request->paid_amount : 0;
            $discount = is_numeric($request->discount_value) ? (float)$request->discount_value : 0;

            DB::beginTransaction();

            // Jika ada items, update semuanya
            if ($request->has('items') && is_array($request->items)) {
                // Hitung ulang total dari items
                $calculatedTotal = 0;
                foreach ($request->items as $item) {
                    $itemSubtotal = (is_numeric($item['quantity']) ? $item['quantity'] : 0) * (is_numeric($item['price']) ? $item['price'] : 0);
                    $expressFeé = (isset($item['is_express']) && $item['is_express']) ? (is_numeric($item['express_fee']) ? $item['express_fee'] : 0) : 0;
                    $calculatedTotal += $itemSubtotal + $expressFeé;
                }

                // Apply discount
                $finalTotal = $calculatedTotal;
                if ($request->discount_type === 'amount') {
                    $finalTotal = $calculatedTotal - $discount;
                } elseif ($request->discount_type === 'percent') {
                    $finalTotal = $calculatedTotal - ($calculatedTotal * $discount / 100);
                }
                $finalTotal = max(0, $finalTotal);

                // DEBUG LOG: cek payload update
                Log::info('[DEBUG] Update transaksi', [
                    'customer_id' => $request->customer_id,
                    'transaction_date' => $request->transaction_date,
                    'estimated_completion' => $request->estimated_completion,
                    'status' => $request->status,
                    'payment_status' => $request->payment_status,
                    'paid_amount' => $paidAmount,
                    'notes' => $request->notes,
                    'discount_type' => $request->discount_type,
                    'discount_value' => $discount,
                    'total_amount' => $calculatedTotal,
                    'final_total' => $finalTotal
                ]);

                // Update transaction
                // Paksa status dan payment_status jadi string literal
                $transaction->customer_id = $request->customer_id;
                $transaction->transaction_date = $request->transaction_date;
                $transaction->estimated_completion = $request->estimated_completion;
                $transaction->status = (string) $status;
                $transaction->payment_status = (string) $paymentStatus;
                $transaction->paid_amount = $paidAmount;
                $transaction->notes = $request->notes;
                $transaction->discount_type = $request->discount_type;
                $transaction->discount_value = $discount;
                $transaction->total_amount = $calculatedTotal;
                $transaction->final_total = $finalTotal;
                $transaction->save();

                // Delete existing details and create new ones
                $transaction->details()->delete();

                foreach ($request->items as $item) {
                    // Pastikan quantity dan price bisa string koma/desimal
                    $qtyRaw = $item['quantity'];
                    $qty = is_string($qtyRaw) ? str_replace(',', '.', $qtyRaw) : $qtyRaw;
                    $qty = is_numeric($qty) ? (float)$qty : 0;
                    $priceRaw = $item['price'];
                    $price = is_string($priceRaw) ? str_replace(',', '.', $priceRaw) : $priceRaw;
                    $price = is_numeric($price) ? (float)$price : 0;
                    $itemSubtotal = $qty * $price;
                    $isExpress = (isset($item['is_express']) && $item['is_express']) && $item['type'] === 'service';
                    $expressFeé = $isExpress ? (is_numeric($item['express_fee']) ? $item['express_fee'] : 0) : 0;
                    $totalSubtotal = $itemSubtotal + $expressFeé;

                    $detailData = [
                        'transaction_id' => $transaction->id,
                        'quantity' => $qty,
                        'price' => $price,
                        'subtotal' => $totalSubtotal,
                        'is_express' => $isExpress,
                        'express_fee' => $expressFeé,
                        'notes' => $item['notes'] ?? null,
                        'service_id' => null,
                        'product_id' => null
                    ];

                    // Set service_id atau product_id
                    if ($item['type'] === 'service' && !empty($item['service_id'])) {
                        $detailData['service_id'] = $item['service_id'];
                    } elseif ($item['type'] === 'product' && !empty($item['product_id'])) {
                        $detailData['product_id'] = $item['product_id'];
                        // Product tidak bisa express
                        $detailData['is_express'] = false;
                        $detailData['express_fee'] = 0;
                        $detailData['subtotal'] = is_numeric($item['quantity']) && is_numeric($item['price']) ? $item['quantity'] * $item['price'] : 0;
                    }

                    // DEBUG LOG
                    Log::info('[DEBUG] Simpan detail transaksi', [
                        'quantity' => $detailData['quantity'],
                        'detailData' => $detailData
                    ]);

                    TransactionDetail::create($detailData);
                }
            } else {
                // Update hanya basic info tanpa items
                $transaction->update([
                    'customer_id' => $request->customer_id,
                    'transaction_date' => $request->transaction_date,
                    'estimated_completion' => $request->estimated_completion,
                    'status' => $status,
                    'payment_status' => $paymentStatus,
                    'paid_amount' => $paidAmount,
                    'notes' => $request->notes
                ]);
            }

            DB::commit();

            return redirect()->route('transactions.show', $transaction->id)
                ->with('success', 'Transaksi berhasil diupdate!');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Transaction update failed: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal mengupdate transaksi: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            $transaction = Transaction::findOrFail($id);

            DB::beginTransaction();
            $transaction->details()->delete();
            $transaction->delete();
            DB::commit();

            return redirect()->route('transactions.index')
                ->with('success', 'Transaksi berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->route('transactions.index')
                ->with('error', 'Gagal menghapus transaksi.');
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->update(['status' => $request->status]);

            return back()->with('success', 'Status berhasil diupdate!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengupdate status.');
        }
    }

    public function updatePayment(Request $request, $id)
    {
        try {
            $transaction = Transaction::findOrFail($id);
            $transaction->update([
                'payment_status' => $request->payment_status,
                'paid_amount' => $request->paid_amount
            ]);

            return back()->with('success', 'Pembayaran berhasil diupdate!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengupdate pembayaran.');
        }
    }

    public function print($id)
    {
        $transaction = Transaction::with(['customer', 'details.service', 'details.product'])
            ->findOrFail($id);

        // Ganti dari view() ke Inertia::render()
        return Inertia::render('Transactions/Print', [
            'transaction' => $transaction,
            'company' => [
                'name' => 'RUMAH LAUNDRY',
                'address' => 'Jl.ra.kartini 114 Rawang, Pariaman',
                'address2' => 'Sebelah SMAN 2 Pariaman alai Guru Penggerak',
                'city' => 'Kota Pariaman, Sumbar 25511',
                'phone' => '0822-8812-6500 / 082387395609'
            ],
            'print_date' => now()->format('d/m/Y H:i:s')
        ]);
    }

    public function export(Request $request)
    {
        $query = Transaction::with(['customer', 'details.service', 'details.product']);

        // Apply same filters as index method
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('customer_name')) {
            $customerName = trim($request->customer_name);
            $query->whereHas('customer', function ($customerQuery) use ($customerName) {
                $customerQuery->where('name', 'like', "%{$customerName}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('date_start')) {
            $query->whereDate('transaction_date', '>=', $request->date_start);
        }

        if ($request->filled('date_end')) {
            $query->whereDate('transaction_date', '<=', $request->date_end);
        }

        if ($request->filled('estimation_start')) {
            $query->whereDate('estimated_completion', '>=', $request->estimation_start);
        }

        if ($request->filled('estimation_end')) {
            $query->whereDate('estimated_completion', '<=', $request->estimation_end);
        }

        if ($request->filled('min_amount') && is_numeric($request->min_amount)) {
            $query->where('final_total', '>=', $request->min_amount);
        }

        if ($request->filled('max_amount') && is_numeric($request->max_amount)) {
            $query->where('final_total', '<=', $request->max_amount);
        }

        if ($request->boolean('is_overdue')) {
            $query->where('estimated_completion', '<', now())
                ->whereNotIn('status', ['completed', 'delivered', 'cancelled']);
        }

        if ($request->boolean('today')) {
            $query->whereDate('transaction_date', today());
        }

        if ($request->boolean('is_express')) {
            $query->whereHas('details', function ($detailQuery) {
                $detailQuery->where('is_express', true);
            });
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        return Excel::download(new TransactionExport($transactions), 'transactions_' . now()->format('Y-m-d') . '.xlsx');
    }

    public function exportPdf(Request $request)
    {
        $query = Transaction::with(['customer', 'details.service', 'details.product']);

        // Apply same filters as export method
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('customer_name')) {
            $customerName = trim($request->customer_name);
            $query->whereHas('customer', function ($customerQuery) use ($customerName) {
                $customerQuery->where('name', 'like', "%{$customerName}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('date_start')) {
            $query->whereDate('transaction_date', '>=', $request->date_start);
        }

        if ($request->filled('date_end')) {
            $query->whereDate('transaction_date', '<=', $request->date_end);
        }

        if ($request->filled('estimation_start')) {
            $query->whereDate('estimated_completion', '>=', $request->estimation_start);
        }

        if ($request->filled('estimation_end')) {
            $query->whereDate('estimated_completion', '<=', $request->estimation_end);
        }

        if ($request->filled('min_amount') && is_numeric($request->min_amount)) {
            $query->where('final_total', '>=', $request->min_amount);
        }

        if ($request->filled('max_amount') && is_numeric($request->max_amount)) {
            $query->where('final_total', '<=', $request->max_amount);
        }

        if ($request->boolean('is_overdue')) {
            $query->where('estimated_completion', '<', now())
                ->whereNotIn('status', ['completed', 'delivered', 'cancelled']);
        }

        if ($request->boolean('today')) {
            $query->whereDate('transaction_date', today());
        }

        if ($request->boolean('is_express')) {
            $query->whereHas('details', function ($detailQuery) {
                $detailQuery->where('is_express', true);
            });
        }

        $transactions = $query->orderBy('created_at', 'desc')->get();

        $data = [
            'transactions' => $transactions,
            'filters' => $request->all(),
            'export_date' => now()->format('d/m/Y H:i:s'),
            'company' => [
                'name' => 'LaundryKu',
                'address' => 'Jl. Bersih No. 123, Jakarta',
                'phone' => '(021) 123-4567',
                'email' => 'info@laundryku.com'
            ]
        ];

        $pdf = PDF::loadView('transactions.pdf', $data);
        return $pdf->download('transactions_' . now()->format('Y-m-d') . '.pdf');
    }
}
