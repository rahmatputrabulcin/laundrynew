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
                padding: '0 2mm 2mm 2mm',
                color: '#000',
                lineHeight: 1.2,
                backgroundColor: '#fff',
                margin: 0,
                boxSizing: 'border-box'
            }}
        >
            {/* Spacer untuk menghindari terpotong */}
            <div style={{ height: '5mm' }}></div>
            
            {/* Header - Compact */}
            <div style={{ textAlign: 'center', marginBottom: '2mm' }}>
                <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '10px', 
                    margin: 0,
                    marginBottom: '1.5mm',
                    letterSpacing: '0.5px'
                }}>
                    RUMAH LAUNDRY
                </div>
                <div style={{ fontSize: '7px', lineHeight: 1.3, margin: 0 }}>
                    Jl.ra.kartini 114 Rawang<br />
                    Sebelah SMAN 2 Pariaman<br />
                    Kota Pariaman, Sumbar 25511<br />
                    WA: 0822-8812-6500
                </div>
                <div style={{ borderTop: '1px dashed #000', margin: '2mm 0 1mm 0' }}></div>
            </div>

           {/* Info Transaksi - 2 Kolom */}
            <div style={{ fontSize: '8px', marginBottom: '1mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>INV: {transaction.invoice_number}</span>
                    {/* <span>CUSTOMER: {transaction.customer?.name}</span> */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>TGL: {formatDateIndonesia(transaction.transaction_date)}</span>
                    <span>STATUS: {transaction.status.toUpperCase()}</span>
                </div>
            </div>

            <div style={{ borderTop: '1px dashed #000', margin: '1mm 0' }}></div>

            {/* Detail Layanan - Compact */}
            <div style={{ fontWeight: 'bold', fontSize: '8px', marginBottom: '1mm', textAlign: 'center' }}>
                DETAIL LAYANAN
            </div>

            {transaction.details.map((d, i) => (
                <div key={i} style={{ fontSize: '7px', marginBottom: '1mm' }}>
                    <div style={{ fontWeight: 'bold' }}>
                        {d.service?.name}{d.is_express && ' [EXPRESS]'}
                    </div>
                    <div>{d.quantity}kg x Rp{parseFloat(d.price).toLocaleString('id-ID')}</div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        = Rp{parseFloat(d.subtotal).toLocaleString('id-ID')}
                    </div>
                    {d.is_express && d.express_fee > 0 && (
                        <div style={{ fontSize: '6px' }}>
                            + Express: Rp{parseFloat(d.express_fee).toLocaleString('id-ID')}
                        </div>
                    )}
                    {d.notes && (
                        <div style={{ fontSize: '6px', fontStyle: 'italic' }}>"{d.notes}"</div>
                    )}
                    {i < transaction.details.length - 1 && (
                        <div style={{ borderTop: '1px dotted #666', margin: '1mm 0' }}></div>
                    )}
                </div>
            ))}

            <div style={{ borderTop: '1px dashed #000', margin: '1mm 0' }}></div>

            {/* Ringkasan Pembayaran - Full Width */}
            <div style={{ fontSize: '8px', marginBottom: '1mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>Rp{parseFloat(transaction.total_amount).toLocaleString('id-ID')}</span>
                </div>

                {transaction.discount_value > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Diskon</span>
                        <span>
                            -{transaction.discount_type === 'amount'
                                ? `Rp${parseFloat(transaction.discount_value).toLocaleString('id-ID')}`
                                : `${transaction.discount_value}%`}
                        </span>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Dibayar</span>
                    <span>Rp{parseFloat(transaction.paid_amount).toLocaleString('id-ID')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sisa</span>
                    <span style={{ fontWeight: 'bold' }}>
                        Rp{(parseFloat(transaction.final_total) - parseFloat(transaction.paid_amount)).toLocaleString('id-ID')}
                    </span>
                </div>
            </div>


            {/* Total & Customer - Prominent */}
            <div style={{
                fontWeight: 'bold',
                fontSize: '10px',
                borderTop: '2px solid #000',
                borderBottom: '2px solid #000',
                padding: '1.5mm 0 0.5mm 0',
                textAlign: 'center',
                margin: '1mm 0'
            }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '0.5mm', letterSpacing: '0.5px' }}>
                    {transaction.customer?.name?.toUpperCase() || '-'}
                </div>
                <div style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    TOTAL: Rp{parseFloat(transaction.final_total).toLocaleString('id-ID')}
                </div>
            </div>

            {/* Status Pembayaran */}
            <div style={{ textAlign: 'center', fontSize: '8px', fontWeight: 'bold', marginBottom: '1mm' }}>
                PEMBAYARAN: {transaction.payment_status.toUpperCase()}
            </div>

            {/* Info Tambahan - Compact */}
            <div style={{ fontSize: '7px', marginBottom: '1mm' }}>
                <div>Selesai: {formatDateIndonesia(transaction.estimated_completion)}</div>
                {transaction.notes && (
                    <div style={{ fontStyle: 'italic' }}>Catatan: {transaction.notes}</div>
                )}
            </div>

            <div style={{ borderTop: '1px dashed #000', margin: '1mm 0' }}></div>

            {/* Footer - Minimal */}
            <div style={{ textAlign: 'center', fontSize: '8px', fontWeight: 'bold' }}>
                TERIMA KASIH
            </div>
            <div style={{ textAlign: 'center', fontSize: '7px' }}>
                Jangan lupa kembali lagi ya!
            </div>
        </div>
    );
}
