{{-- filepath: resources/views/exports/transactions-pdf.blade.php --}}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Transaksi</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .company-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .report-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
        .report-date { font-size: 12px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .total-row { background-color: #f9f9f9; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">RUMAH LAUNDRY</div>
        <div style="font-size: 12px;">
            Jl.ra.kartini 114 Rawang, Pariaman<br>
            Sebelah SMAN 2 Pariaman alai Guru Penggerak<br>
            Kota Pariaman, Sumbar 25511<br>
            WA: 0822-8812-6500 / 082387395609
        </div>
        <div class="report-title">LAPORAN TRANSAKSI</div>
        <div class="report-date">Dicetak pada: {{ date('d/m/Y H:i:s') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="10%">Tanggal</th>
                <th width="12%">Invoice</th>
                <th width="15%">Customer</th>
                <th width="20%">Layanan</th>
                <th width="8%">Status</th>
                <th width="10%">Pembayaran</th>
                <th width="10%">Total</th>
                <th width="10%">Dibayar</th>
            </tr>
        </thead>
        <tbody>
            @php 
                $totalGross = 0;
                $totalPaid = 0;
            @endphp
            @foreach($transactions as $index => $transaction)
                @php
                    $totalGross += $transaction->final_total;
                    $totalPaid += $transaction->paid_amount;
                @endphp
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($transaction->transaction_date)->format('d/m/Y') }}</td>
                    <td>{{ $transaction->invoice_number }}</td>
                    <td>{{ $transaction->customer->name ?? '-' }}</td>
                    <td>
                        @foreach($transaction->details as $detail)
                            {{ $detail->service->name }} ({{ $detail->quantity }}kg)
                            @if($detail->is_express) ⚡ @endif
                            @if(!$loop->last), @endif
                        @endforeach
                    </td>
                    <td class="text-center">{{ $transaction->status }}</td>
                    <td class="text-center">{{ $transaction->payment_status }}</td>
                    <td class="text-right">Rp {{ number_format($transaction->final_total, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($transaction->paid_amount, 0, ',', '.') }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="7" class="text-right">TOTAL:</td>
                <td class="text-right">Rp {{ number_format($totalGross, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($totalPaid, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 20px;">
        <div style="display: inline-block; width: 48%; vertical-align: top;">
            <strong>Ringkasan:</strong><br>
            Total Transaksi: {{ $transactions->count() }}<br>
            Total Pemasukan: Rp {{ number_format($totalPaid, 0, ',', '.') }}<br>
            Outstanding: Rp {{ number_format($totalGross - $totalPaid, 0, ',', '.') }}
        </div>
    </div>

    <div class="footer">
        <div>Laporan ini digenerate otomatis oleh sistem</div>
        <div>Rumah Laundry - {{ date('Y') }}</div>
    </div>
</body>
</html>
