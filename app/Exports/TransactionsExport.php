<?php
namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TransactionsExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Transaction::with('customer');

        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        if (!empty($this->filters['customer_name'])) {
            $query->whereHas('customer', function ($q) {
                $q->where('name', 'like', '%' . $this->filters['customer_name'] . '%');
            });
        }
        if (!empty($this->filters['date_start'])) {
            $query->whereDate('created_at', '>=', $this->filters['date_start']);
        }
        if (!empty($this->filters['date_end'])) {
            $query->whereDate('created_at', '<=', $this->filters['date_end']);
        }

        // Pilih kolom yang ingin diexport
        return $query->get()->map(function ($trx) {
            return [
                'Invoice' => $trx->invoice_number,
                'Customer' => $trx->customer->name ?? '',
                'Total' => $trx->total_amount,
                'Diskon' => $trx->discount_value,
                'Final Total' => $trx->final_total,
                'Status Pembayaran' => $trx->payment_status,
                'Status' => $trx->status,
                'Tanggal' => $trx->created_at,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Invoice',
            'Customer',
            'Total',
            'Diskon',
            'Final Total',
            'Status Pembayaran',
            'Status',
            'Tanggal',
        ];
    }
}
