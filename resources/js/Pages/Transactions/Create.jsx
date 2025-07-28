import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import TransactionForm from '@/Components/TransactionForm';

export default function Create({ customers, services, products, auth, invoiceNumber }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_number: invoiceNumber || '',
        customer_id: '',
        transaction_date: '',
        estimated_completion: '',
        notes: '',
        discount_type: 'amount',
        discount_value: 0,
        paid_amount: 0,
        payment_status: 'belum lunas',
        status: 'pending',
        total_amount: 0,
        items: [
            {
                type: 'service',
                service_id: '',
                product_id: '',
                quantity: 0,
                price: 0,
                is_express: false,
                express_fee: 0,
                notes: ''
            }
        ]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.customer_id) {
            alert('Silakan pilih pelanggan terlebih dahulu');
            return;
        }

        if (!data.transaction_date) {
            alert('Silakan pilih tanggal transaksi');
            return;
        }

        if (!data.estimated_completion) {
            alert('Silakan pilih estimasi selesai');
            return;
        }

        const validItems = data.items.filter(item => {
            const hasValidId = (item.type === 'service' && item.service_id) ||
                              (item.type === 'product' && item.product_id);
            return hasValidId && item.quantity > 0 && item.price > 0;
        });

        if (validItems.length === 0) {
            alert('Silakan tambahkan minimal satu item yang valid');
            return;
        }

        post(route('transactions.store'), {
            ...data,
            items: validItems
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        ➕ Tambah Transaksi Baru
                    </h2>
                    <Link
                        href={route('transactions.index')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        ← Kembali
                    </Link>
                </div>
            }
        >
            <Head title="Tambah Transaksi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {errors.error && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {errors.error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <TransactionForm
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    customers={customers}
                                    services={services}
                                    products={products}
                                    isEdit={false}
                                />

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : '💾 Simpan Transaksi'}
                                    </button>
                                    <Link
                                        href={route('transactions.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded"
                                    >
                                        Batal
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
