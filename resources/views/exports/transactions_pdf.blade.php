<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Export Transaksi PDF</title>
    <style>
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #333; padding: 4px; text-align: left; }
        th { background: #eee; }
    </style>
</head>
<body>
    <h2>Daftar Transaksi</h2>
    <p>
      @if(request('date_start') && request('date_end'))
        Periode: {{ request('date_start') }} s/d {{ request('date_end') }}<br>
      @endif
      @if(request('status'))
        Status: {{ request('status') }}<br>
      @endif
    </p>
    <table>
        <thead>
            <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Diskon</th>
                <th>Final Total</th>
                <th>Status Pembayaran</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $trx)
            <tr>
                <td>{{ $trx->invoice_number }}</td>
                <td>{{ $trx->customer->name ?? '' }}</td>
                <td>{{ number_format($trx->total_amount) }}</td>
                <td>{{ $trx->discount_value }}</td>
                <td>{{ number_format($trx->final_total) }}</td>
                <td>{{ $trx->payment_status }}</td>
                <td>{{ $trx->status }}</td>
                <td>{{ \Carbon\Carbon::parse($trx->created_at)->format('d-m-Y H:i') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
