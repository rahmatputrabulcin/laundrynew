import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const statusColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'proses': return 'bg-yellow-100 text-yellow-800';
        case 'selesai': return 'bg-green-100 text-green-800';
        case 'diambil': return 'bg-blue-100 text-blue-800';
        case 'batal': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function Transactions({ transactions, customers, filters, total_income, total_count }) {
    const handleFilter = (e) => {
        e.preventDefault();
        const form = e.target;
        router.get(route('reports.transactions'), {
            date_from: form.date_from.value,
            date_to: form.date_to.value,
            customer_id: form.customer_id.value,
            status: form.status.value,
        });
    };

    return (
          <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold mb-4 text-blue-700">Laporan Transaksi</h2>}
        >
        <div className="max-w-5xl mx-auto p-4">
            <Head title="Laporan Transaksi" />
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Laporan Transaksi</h2>
            <form onSubmit={handleFilter} className="flex gap-2 mb-4 flex-wrap items-end">
                <div>
                    <label className="block text-xs font-semibold">Dari</label>
                    <input type="date" name="date_from" defaultValue={filters.date_from} className="border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-xs font-semibold">Sampai</label>
                    <input type="date" name="date_to" defaultValue={filters.date_to} className="border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block text-xs font-semibold">Pelanggan</label>
                    <select name="customer_id" defaultValue={filters.customer_id || ''} className="border rounded px-2 py-1">
                        <option value="">Semua</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold">Status</label>
                    <select name="status" defaultValue={filters.status || ''} className="border rounded px-2 py-1">
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="proses">Proses</option>
                        <option value="selesai">Selesai</option>
                        <option value="diambil">Diambil</option>
                        <option value="batal">Batal</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded h-9">Filter</button>
            </form>
            <div className="mb-3 flex gap-6">
                <div><b>Total Transaksi:</b> {total_count}</div>
                <div><b>Total Pemasukan:</b> <span className="text-green-700">Rp {parseFloat(total_income).toLocaleString()}</span></div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-xs bg-white shadow rounded">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1">Tanggal</th>
                            <th className="border px-2 py-1">Invoice</th>
                            <th className="border px-2 py-1">Pelanggan</th>
                            <th className="border px-2 py-1">Status</th>
                            <th className="border px-2 py-1">Total</th>
                            <th className="border px-2 py-1">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">Tidak ada data.</td>
                            </tr>
                        )}
                        {transactions.map(trx => (
                            <tr key={trx.id} className="hover:bg-blue-50">
                                <td className="border px-2 py-1">{trx.created_at ? trx.created_at.substring(0,10) : '-'}</td>
                                <td className="border px-2 py-1">{trx.invoice_number}</td>
                                <td className="border px-2 py-1">{trx.customer?.name}</td>
                                <td className="border px-2 py-1">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor(trx.status)}`}>
                                        {trx.status}
                                    </span>
                                </td>
                                <td className="border px-2 py-1">Rp {parseFloat(trx.final_total).toLocaleString()}</td>
                                <td className="border px-2 py-1">
                                    <Link href={route('transactions.show', trx.id)} className="text-blue-600 underline">Detail</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}
