import { useEffect } from 'react';

export default function Print({ transaction }) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div
            style={{
                width: '58mm',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '4px 0',
                color: '#222'
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 'bold', fontSize: 18, letterSpacing: 1, marginBottom: 2 }}>RUMAH LAUNDRY</div>
                <div style={{ fontSize: 11, marginBottom: 2, lineHeight: 1.2 }}>
                    BGP SUMBAR, Jl.ra.kartini 114 Rawang Pariaman<br />
                    Sebelah SMAN 2 Pariaman alai Guru Penggerak<br />
                    Kota Pariaman, Sumatera Barat 25511
                </div>
                <div style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 2 }}>
                    WA: 0822-8812-6500 / 082387395609
                </div>
                <hr style={{ margin: '6px 0' }} />
            </div>

            {/* Info Transaksi */}
            <div style={{ marginBottom: 4 }}>
                <div><b>INVOICE</b>: {transaction.invoice_number}</div>
                <div><b>TGL</b>: {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('en-CA') : '-'}</div>
                <div><b>PELANGGAN</b>: {transaction.customer?.name}</div>
                <div><b>STATUS</b>: {transaction.status}</div>
            </div>
            <hr style={{ margin: '6px 0' }} />

            {/* Detail Item */}
            <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2, textAlign: 'center' }}>DETAIL</div>
            <table style={{ width: '100%', fontSize: 12, marginBottom: 2 }}>
                <tbody>
                    {transaction.details.map((d, i) => (
                        <tr key={i}>
                            <td style={{ width: '45%' }}>{d.service?.name}</td>
                            <td style={{ textAlign: 'right', width: '15%' }}>x{d.quantity}</td>
                            <td style={{ textAlign: 'right', width: '40%' }}>Rp {parseFloat(d.subtotal).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr style={{ margin: '6px 0' }} />

            {/* Pembayaran */}
            <div style={{ marginBottom: 2 }}>
                <div>
                    <span>Total</span>
                    <span style={{ float: 'right', fontWeight: 'bold' }}>Rp {parseFloat(transaction.total_amount).toLocaleString()}</span>
                </div>
                <div>
                    <span>Diskon</span>
                    <span style={{ float: 'right' }}>
                        {transaction.discount_type === 'amount'
                            ? `Rp ${parseFloat(transaction.discount_value).toLocaleString()}`
                            : transaction.discount_type === 'percent'
                            ? `${transaction.discount_value}%`
                            : '-'}
                    </span>
                </div>
            </div>
            <div style={{
                fontWeight: 'bold',
                fontSize: 15,
                margin: '8px 0 2px 0',
                borderTop: '1px dashed #222',
                borderBottom: '1px dashed #222',
                padding: '2px 0',
                textAlign: 'center',
                letterSpacing: 1
            }}>
                TOTAL BAYAR<br />
                Rp {parseFloat(transaction.final_total).toLocaleString()}
            </div>
            <div style={{ marginBottom: 2 }}>
                <span style={{ fontWeight: 'bold' }}>DIBAYAR</span>
                <span style={{ float: 'right', fontWeight: 'bold' }}>
                    Rp {parseFloat(transaction.paid_amount).toLocaleString()}
                </span>
            </div>
            <div>
                <span>SISA</span>
                <span style={{ float: 'right', fontWeight: 'bold' }}>
                    Rp {(parseFloat(transaction.final_total) - parseFloat(transaction.paid_amount)).toLocaleString()}
                </span>
            </div>
            <div>
                <span>Status Bayar</span>
                <span style={{
                    float: 'right',
                    fontWeight: 'bold',
                    color: transaction.payment_status === 'lunas' ? 'green' : 'red'
                }}>
                    {transaction.payment_status}
                </span>
            </div>
            <hr style={{ margin: '6px 0' }} />

            {/* Estimasi & Catatan */}
            <div style={{ fontSize: 11, marginBottom: 2 }}>
                <span>Estimasi Selesai: </span>
                <span style={{ fontWeight: 'bold' }}>
                    {transaction.estimated_completion ? new Date(transaction.estimated_completion).toLocaleDateString('en-CA') : '-'}
                </span>
            </div>
            <div style={{ fontSize: 11, marginBottom: 2 }}>
                <span>Catatan: </span>
                <span>{transaction.notes || '-'}</span>
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                marginTop: 10,
                fontWeight: 'bold',
                fontSize: 13,
                borderTop: '1px dashed #222',
                paddingTop: 4
            }}>
                --- TERIMA KASIH ---
            </div>
        </div>
    );
}
