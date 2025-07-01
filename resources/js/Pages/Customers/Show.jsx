import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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

export default function Show({ customer, transactions, auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customer Details</h2>}
        >
            <Head title={`Customer: ${customer.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Customer Info */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Customer Information</h3>
                                <div className="flex space-x-2">
                                    <Link
                                        href={route('customers.edit', customer.id)}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={route('customers.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                                    >
                                        Back to List
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="mt-1">{customer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="mt-1">{customer.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1">{customer.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                    <p className="mt-1">{customer.address || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Riwayat Transaksi</h3>
                                <Link
                                    href={route('transactions.create', { customer_id: customer.id })}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    Transaksi Baru
                                </Link>
                            </div>

                            {transactions && transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left">Invoice #</th>
                                                <th className="py-3 px-4 text-left">Tanggal</th>
                                                <th className="py-3 px-4 text-left">Total</th>
                                                <th className="py-3 px-4 text-left">Status</th>
                                                <th className="py-3 px-4 text-left">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {transactions.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td className="py-3 px-4">{transaction.invoice_number}</td>
                                                    <td className="py-3 px-4">{new Date(transaction.created_at).toLocaleDateString()}</td>
                                                    <td className="py-3 px-4">Rp {parseFloat(transaction.final_total ?? transaction.total_amount).toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor(transaction.status)}`}>
                                                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Link
                                                            href={route('transactions.show', transaction.id)}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            Lihat
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center py-4">Belum ada transaksi untuk pelanggan ini.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
