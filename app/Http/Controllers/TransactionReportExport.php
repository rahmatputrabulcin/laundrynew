<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TransactionReportExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    protected $transactions;

    public function __construct($transactions)
    {
        $this->transactions = $transactions;
    }

    public function collection()
    {
        return $this->transactions->map(function ($transaction, $index) {
            $services = $transaction->details->map(function ($detail) {
                $service = $detail->service->name;
                if ($detail->is_express) {
                    $service .= ' (Express)';
                }
                return $service . ' - ' . $detail->quantity . 'kg';
            })->implode(', ');

            return [
                'no' => $index + 1,
                'tanggal' => $transaction->transaction_date,
                'invoice' => $transaction->invoice_number,
                'customer' => $transaction->customer->name ?? '-',
                'layanan' => $services,
                'status' => $transaction->status,
                'payment_status' => $transaction->payment_status,
                'total' => $transaction->final_total,
                'dibayar' => $transaction->paid_amount,
                'sisa' => $transaction->final_total - $transaction->paid_amount,
                'estimasi_selesai' => $transaction->estimated_completion,
                'catatan' => $transaction->notes ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Tanggal',
            'Invoice',
            'Customer',
            'Layanan',
            'Status',
            'Status Bayar',
            'Total',
            'Dibayar',
            'Sisa',
            'Estimasi Selesai',
            'Catatan',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E3F2FD']
                ]
            ],
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 12,
            'C' => 15,
            'D' => 20,
            'E' => 30,
            'F' => 12,
            'G' => 12,
            'H' => 15,
            'I' => 15,
            'J' => 15,
            'K' => 15,
            'L' => 25,
        ];
    }
}
