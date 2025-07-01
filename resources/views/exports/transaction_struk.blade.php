<html>
<head>
    <meta charset="utf-8">
    <title>Struk Transaksi</title>
    <style>
        body { font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #333; padding: 4px; text-align: left; }
        th { background: #eee; }
    </style>
</head>
<body>
    <h3>Struk Transaksi Laundry</h3>
    <p>
        <strong>Invoice:</strong> {{ $transaction->invoice_number }}<br>
        <strong>Pelanggan:</strong> {{ $transaction->customer->name ?? '-' }}<br>
        <strong>Tanggal:</strong> {{ \Carbon\Carbon::parse($transaction->created_at)->format('d-m-Y H:i') }}<br>
        <strong>Status:</strong> {{ $transaction->status }}<br>
    </p>
    <table>
        <thead>
            <tr>
                <th>Layanan</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transaction->details as $item)
            <tr>
                <td>{{ $item->service->name ?? '-' }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ number_format($item->price) }}</td>
                <td>{{ number_format($item->subtotal) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <p>
        <strong>Total:</strong> Rp {{ number_format($transaction->total_amount) }}<br>
        <strong>Diskon:</strong> {{ $transaction->discount_value }}<br>
        <strong>Final Total:</strong> Rp {{ number_format($transaction->final_total) }}<br>
        <strong>Status Pembayaran:</strong> {{ $transaction->payment_status }}
    </p>
</body>
</html>
