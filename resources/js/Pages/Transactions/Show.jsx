import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ transaction, auth }) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return `Rp ${parseFloat(amount || 0).toLocaleString('id-ID')}`;
    };

    const formatQuantity = (quantity) => {
        const num = parseFloat(quantity || 0);
        // Jika bilangan bulat, tampilkan tanpa desimal
        if (num % 1 === 0) {
            return num.toString();
        }
        // Jika ada desimal, tampilkan dengan maksimal 3 digit
        return num.toFixed(3).replace(/\.?0+$/, '');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'delivered': return 'bg-purple-100 text-purple-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'lunas': return 'text-green-600 font-medium';
            case 'belum lunas': return 'text-red-600 font-medium';
            case 'dp': return 'text-yellow-600 font-medium';
            default: return 'text-gray-600';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        📋 Detail Transaksi #{transaction.invoice_number}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('transactions.edit', transaction.id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            ✏️ Edit
                        </Link>
                        <Link
                            href={route('transactions.index')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            ← Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Detail Transaksi ${transaction.invoice_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">📝 Informasi Transaksi</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">No. Invoice:</span>
                                            <span className="text-blue-600 font-bold">{transaction.invoice_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Tanggal Transaksi:</span>
                                            <span>{formatDate(transaction.transaction_date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Estimasi Selesai:</span>
                                            <span>{formatDate(transaction.estimated_completion)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Pembayaran:</span>
                                            <span className={getPaymentStatusColor(transaction.payment_status)}>
                                                {transaction.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">👤 Informasi Pelanggan</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Nama:</span>
                                            <span>{transaction.customer?.name || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Telepon:</span>
                                            <span>{transaction.customer?.phone_number || '-'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium">Alamat:</span>
                                            <span className="text-right">{transaction.customer?.address || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Detail */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4">🛍️ Detail Layanan/Produk</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Item
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Kuantitas
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Harga
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Express
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subtotal
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Catatan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transaction.details?.map((detail, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div>
                                                            <div className="font-medium">
                                                                {detail.service?.name || detail.product?.name}
                                                            </div>
                                                            <div className="text-gray-500 text-xs">
                                                                {detail.service ? 'Layanan' : 'Produk'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {formatQuantity(detail.quantity)}
                                                        {detail.service
                                                            ? (detail.service.price_type === 'per_kg' ? ' kg' :
                                                               detail.service.price_type === 'per_item' ? ' item' :
                                                               ' unit')
                                                            : ' pcs'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {formatCurrency(detail.price)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {detail.is_express ? (
                                                            <div>
                                                                <span className="text-red-600">⚡ Express</span>
                                                                <div className="text-xs text-gray-500">
                                                                    {formatCurrency(detail.express_fee)}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium">
                                                        {formatCurrency(detail.subtotal)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        {detail.notes || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">💰 Ringkasan Keuangan</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(transaction.total_amount)}</span>
                                        </div>
                                        {transaction.discount_value > 0 && (
                                            <div className="flex justify-between text-red-600">
                                                <span>Diskon:</span>
                                                <span>
                                                    -{transaction.discount_type === 'amount'
                                                        ? formatCurrency(transaction.discount_value)
                                                        : `${transaction.discount_value}%`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        <hr />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-blue-600">{formatCurrency(transaction.final_total)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Dibayar:</span>
                                            <span className="text-green-600">{formatCurrency(transaction.paid_amount)}</span>
                                        </div>
                                        {transaction.paid_amount < transaction.final_total && (
                                            <div className="flex justify-between text-red-600 font-medium">
                                                <span>Sisa:</span>
                                                <span>{formatCurrency(transaction.final_total - transaction.paid_amount)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium mb-4">📝 Catatan</h3>
                                    <p className="text-gray-700">
                                        {transaction.notes || 'Tidak ada catatan'}
                                    </p>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">⏰ Informasi Waktu</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Dibuat:</span>
                                        <span>{transaction.created_at}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Terakhir Diupdate:</span>
                                        <span>{transaction.updated_at}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
