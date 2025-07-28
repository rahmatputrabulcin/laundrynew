import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

const statusColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'delivered': return 'bg-purple-100 text-purple-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const paymentStatusColor = (status) => {
    switch (status) {
        case 'lunas': return 'bg-green-100 text-green-800';
        case 'belum lunas': return 'bg-red-100 text-red-800';
        case 'dp': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

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

export default function Transactions({ 
    transactions, 
    customers, 
    services, 
    filters, 
    stats,
    auth 
}) {
    const [viewMode, setViewMode] = useState('table');
    const [selectedTransactions, setSelectedTransactions] = useState([]);

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const params = {};
        
        for (let [key, value] of formData.entries()) {
            if (value) params[key] = value;
        }
        
        router.get(route('reports.transactions'), params);
    };

    const handleExport = (format) => {
        const params = { 
            ...filters, 
            export: format,
            ids: selectedTransactions.join(',')
        };
        window.open(route('reports.transactions.export', params));
    };

    const toggleSelectAll = () => {
        if (selectedTransactions.length === transactions.data?.length) {
            setSelectedTransactions([]);
        } else {
            setSelectedTransactions(transactions.data?.map(t => t.id) || []);
        }
    };

    const toggleSelect = (id) => {
        setSelectedTransactions(prev => 
            prev.includes(id) 
                ? prev.filter(tid => tid !== id)
                : [...prev, id]
        );
    };

    const resetFilters = () => {
        router.get(route('reports.transactions'));
    };

    const transactionData = transactions.data || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-blue-700">📊 Laporan Transaksi</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1 rounded text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            📋 Tabel
                        </button>
                        <button 
                            onClick={() => setViewMode('summary')}
                            className={`px-3 py-1 rounded text-sm ${viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            📈 Ringkasan
                        </button>
                    </div>
                </div>
            }
        >
            <div className="max-w-7xl mx-auto p-4">
                <Head title="Laporan Transaksi" />

                {/* Filter Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h3 className="text-lg font-semibold mb-3">🔍 Filter Laporan</h3>
                    <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Dari Tanggal</label>
                            <input 
                                type="date" 
                                name="date_from" 
                                defaultValue={filters?.date_from || ''} 
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sampai Tanggal</label>
                            <input 
                                type="date" 
                                name="date_to" 
                                defaultValue={filters?.date_to || ''} 
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Pelanggan</label>
                            <select 
                                name="customer_id" 
                                defaultValue={filters?.customer_id || ''} 
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">Semua Pelanggan</option>
                                {customers?.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status Transaksi</label>
                            <select 
                                name="status" 
                                defaultValue={filters?.status || ''} 
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status Bayar</label>
                            <select 
                                name="payment_status" 
                                defaultValue={filters?.payment_status || ''} 
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="">Semua</option>
                                <option value="lunas">Lunas</option>
                                <option value="belum lunas">Belum Lunas</option>
                                <option value="dp">DP</option>
                            </select>
                        </div>
                        <div className="flex flex-col justify-end gap-2">
                            <button 
                                type="submit" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                            >
                                🔍 Filter
                            </button>
                            <button 
                                type="button" 
                                onClick={resetFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
                            >
                                🔄 Reset
                            </button>
                        </div>
                    </form>
                </div>

                {viewMode === 'summary' ? (
                    /* Summary View */
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100">Total Transaksi</p>
                                    <p className="text-2xl font-bold">{stats?.total_count || 0}</p>
                                </div>
                                <div className="text-3xl">📝</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100">Total Pemasukan</p>
                                    <p className="text-xl font-bold">{formatCurrency(stats?.total_income)}</p>
                                </div>
                                <div className="text-3xl">💰</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-100">Belum Lunas</p>
                                    <p className="text-xl font-bold">{formatCurrency(stats?.total_pending)}</p>
                                </div>
                                <div className="text-3xl">⏳</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100">Rata-rata/Transaksi</p>
                                    <p className="text-xl font-bold">
                                        {formatCurrency(stats?.total_count > 0 ? stats?.total_income / stats?.total_count : 0)}
                                    </p>
                                </div>
                                <div className="text-3xl">📊</div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Export & Action Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">
                                {selectedTransactions.length > 0 
                                    ? `${selectedTransactions.length} item dipilih` 
                                    : `${stats?.total_count || 0} total transaksi`
                                }
                            </span>
                            <div className="flex gap-2 text-sm">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                    💰 {formatCurrency(stats?.total_income)}
                                </span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    ⏳ {formatCurrency(stats?.total_pending)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleExport('excel')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                            >
                                📊 Excel
                            </button>
                            <button 
                                onClick={() => handleExport('pdf')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                            >
                                📄 PDF
                            </button>
                            <button 
                                onClick={() => window.print()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                            >
                                🖨️ Print
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedTransactions.length === transactionData.length && transactionData.length > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pelanggan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Layanan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pembayaran
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactionData.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <div className="text-6xl mb-4">📭</div>
                                                <p className="text-lg font-medium">Tidak ada data transaksi</p>
                                                <p className="text-sm">Coba ubah filter atau buat transaksi baru</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactionData.map(transaction => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedTransactions.includes(transaction.id)}
                                                    onChange={() => toggleSelect(transaction.id)}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div>
                                                    <div className="font-medium">{formatDate(transaction.transaction_date)}</div>
                                                    <div className="text-gray-500 text-xs">
                                                        Selesai: {formatDate(transaction.estimated_completion)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                                {transaction.invoice_number}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div>
                                                    <div className="font-medium">{transaction.customer?.name || '-'}</div>
                                                    <div className="text-gray-500 text-xs">{transaction.customer?.phone || '-'}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="space-y-1">
                                                    {transaction.details?.slice(0, 2).map((detail, idx) => (
                                                        <div key={idx} className="text-xs">
                                                            <span className="font-medium">{detail.service?.name}</span>
                                                            <span className="text-gray-500"> ({detail.quantity}kg)</span>
                                                            {detail.is_express && (
                                                                <span className="text-red-600 ml-1">⚡</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {transaction.details?.length > 2 && (
                                                        <div className="text-xs text-gray-500">
                                                            +{transaction.details.length - 2} lainnya
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="space-y-1">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColor(transaction.payment_status)}`}>
                                                        {transaction.payment_status}
                                                    </span>
                                                    {transaction.payment_status !== 'lunas' && (
                                                        <div className="text-xs text-gray-500">
                                                            Sisa: {formatCurrency(transaction.final_total - transaction.paid_amount)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div>
                                                    <div className="font-bold text-green-600">
                                                        {formatCurrency(transaction.final_total)}
                                                    </div>
                                                    {transaction.paid_amount > 0 && transaction.paid_amount < transaction.final_total && (
                                                        <div className="text-xs text-gray-500">
                                                            Dibayar: {formatCurrency(transaction.paid_amount)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className="flex gap-2">
                                                    <Link 
                                                        href={route('transactions.show', transaction.id)} 
                                                        className="text-blue-600 hover:text-blue-800 text-xs bg-blue-100 px-2 py-1 rounded"
                                                    >
                                                        👁️ Detail
                                                    </Link>
                                                    <Link 
                                                        href={route('transactions.print', transaction.id)} 
                                                        className="text-green-600 hover:text-green-800 text-xs bg-green-100 px-2 py-1 rounded"
                                                        target="_blank"
                                                    >
                                                        🖨️ Print
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {transactions.total > transactions.per_page && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {transactions.prev_page_url && (
                                        <Link 
                                            href={transactions.prev_page_url} 
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {transactions.next_page_url && (
                                        <Link 
                                            href={transactions.next_page_url} 
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{transactions.from}</span> to{' '}
                                            <span className="font-medium">{transactions.to}</span> of{' '}
                                            <span className="font-medium">{transactions.total}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {transactions.links?.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
