import { useEffect } from 'react';

// Helper function untuk format tanggal Indonesia
const formatDateIndonesia = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export default function Print({ transaction }) {
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div
            style={{
                width: '58mm',
                fontFamily: 'monospace',
                fontSize: '10px',
                padding: '2px',
                color: '#000',
                lineHeight: 1.2
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 3 }}>
                <div style={{ fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 }}>RUMAH LAUNDRY</div>
                <div style={{ fontSize: 9, lineHeight: 1.1 }}>
                    Jl.ra.kartini 114 Rawang, Pariaman<br />
                    Sebelah SMAN 2 Pariaman alai Guru Penggerak<br />
                    Kota Pariaman, Sumbar 25511<br />
                    WA: 0822-8812-6500 / 082387395609
                </div>
                <div style={{ borderTop: '1px dashed #000', margin: '2px 0' }}></div>
            </div>

            {/* Info Transaksi */}
            <div style={{ fontSize: 9, marginBottom: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                    <span><b>INV:</b> {transaction.invoice_number}</span>
                    <span><b>TGL:</b> {formatDateIndonesia(transaction.transaction_date)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><b>CUSTOMER:</b> {transaction.customer?.name}</span>
                    <span><b>STATUS:</b> {transaction.status.toUpperCase()}</span>
                </div>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '2px 0' }}></div>

            {/* Detail Layanan */}
            <div style={{ fontWeight: 'bold', fontSize: 10, marginBottom: 2, textAlign: 'center' }}>DETAIL LAYANAN</div>
            {transaction.details.map((d, i) => (
                <div key={i} style={{ fontSize: 9, marginBottom: 2, borderBottom: '1px dotted #666', paddingBottom: 1 }}>
                    {/* Nama layanan + Express */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>{d.service?.name}</span>
                        {d.is_express && <span style={{ fontSize: 8, color: 'red' }}>EXPRESS</span>}
                    </div>
                    {/* Qty x Harga = Subtotal */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                        <span>{d.quantity}kg x Rp{parseFloat(d.price).toLocaleString('id-ID')}</span>
                        <span style={{ fontWeight: 'bold' }}>Rp{parseFloat(d.subtotal).toLocaleString('id-ID')}</span>
                    </div>
                    {/* Express fee + Notes */}
                    {(d.is_express || d.notes) && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, fontStyle: 'italic', marginTop: 1 }}>
                            <span>{d.is_express ? `+ Express: Rp${parseFloat(d.express_fee || 0).toLocaleString('id-ID')}` : ''}</span>
                            <span>{d.notes ? `"${d.notes}"` : ''}</span>
                        </div>
                    )}
                </div>
            ))}

            {/* Ringkasan Pembayaran */}
            <div style={{ fontSize: 9, marginTop: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                    <span>Subtotal:</span>
                    <span>Rp{parseFloat(transaction.total_amount).toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                    <span>Diskon:</span>
                    <span>
                        {transaction.discount_type === 'amount'
                            ? `Rp${parseFloat(transaction.discount_value).toLocaleString('id-ID')}`
                            : transaction.discount_type === 'percent'
                            ? `${transaction.discount_value}%`
                            : 'Rp0'}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                    <span>Dibayar:</span>
                    <span style={{ fontWeight: 'bold' }}>Rp{parseFloat(transaction.paid_amount).toLocaleString('id-ID')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sisa:</span>
                    <span style={{
                        fontWeight: 'bold',
                        color: (parseFloat(transaction.final_total) - parseFloat(transaction.paid_amount)) > 0 ? 'red' : 'green'
                    }}>
                        Rp{(parseFloat(transaction.final_total) - parseFloat(transaction.paid_amount)).toLocaleString('id-ID')}
                    </span>
                </div>
            </div>

            {/* Total + Status Bayar */}
            <div style={{
                fontWeight: 'bold',
                fontSize: 11,
                margin: '3px 0',
                borderTop: '1px dashed #000',
                borderBottom: '1px dashed #000',
                padding: '2px 0',
                textAlign: 'center',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>TOTAL: Rp{parseFloat(transaction.final_total).toLocaleString('id-ID')}</span>
                <span style={{
                    fontSize: 9,
                    color: transaction.payment_status === 'lunas' ? 'green' : 'red'
                }}>
                    {transaction.payment_status.toUpperCase()}
                </span>
            </div>

            {/* Info Tambahan */}
            <div style={{ fontSize: 8, marginTop: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <b>Selesai:</b> {formatDateIndonesia(transaction.estimated_completion)}
                </div>
                {transaction.notes && (
                    <div style={{ flex: 1, textAlign: 'right', fontStyle: 'italic' }}>
                        <b>Note:</b> {transaction.notes}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{
                textAlign: 'center',
                marginTop: 3,
                fontWeight: 'bold',
                fontSize: 10,
                borderTop: '1px dashed #000',
                paddingTop: 2
            }}>
                TERIMA KASIH<br />
                <span style={{ fontSize: 8 }}>Jangan lupa kembali lagi ya!</span>
            </div>
        </div>
    );
}
