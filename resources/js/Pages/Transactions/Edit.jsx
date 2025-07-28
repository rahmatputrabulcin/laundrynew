import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SearchableSelect from '@/Components/SearchableSelect';

export default function Edit({ transaction, customers, services, products, auth }) {
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    // Function untuk convert tanggal ke format YYYY-MM-DD
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Konversi transaction details ke format items
    const convertDetailsToItems = (details) => {
        return details.map(detail => ({
            type: detail.service_id ? 'service' : 'product',
            service_id: detail.service_id || '',
            product_id: detail.product_id || '',
            // Store as string for input, but parse to float for backend
            quantity: detail.quantity !== undefined && detail.quantity !== null ? detail.quantity.toString().replace('.', ',') : '',
            price: parseFloat(detail.price),
            is_express: detail.is_express || false,
            express_fee: parseFloat(detail.express_fee || 0),
            notes: detail.notes || ''
        }));
    };

    const { data, setData, put, processing, errors } = useForm({
        customer_id: transaction.customer_id || '',
        transaction_date: formatDateForInput(transaction.transaction_date),
        estimated_completion: formatDateForInput(transaction.estimated_completion),
        status: transaction.status || 'pending',
        payment_status: transaction.payment_status || 'belum lunas',
        paid_amount: transaction.paid_amount || 0,
        notes: transaction.notes || '',
        discount_type: transaction.discount_type || 'amount',
        discount_value: transaction.discount_value || 0,
        total_amount: transaction.total_amount || 0,
        final_total: transaction.final_total || transaction.total_amount || 0,
        items: convertDetailsToItems(transaction.details || [])
    });

    // Debug: Cek data yang dimuat
    useEffect(() => {
        console.log('Transaction data:', transaction);
        console.log('Formatted dates:', {
            transaction_date: formatDateForInput(transaction.transaction_date),
            estimated_completion: formatDateForInput(transaction.estimated_completion)
        });
        console.log('Form data:', data);
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [data.items, data.discount_type, data.discount_value]);

    const calculateTotal = () => {
        const newSubtotal = data.items.reduce((sum, item) => {
            if (!item.quantity || !item.price) return sum;

            const itemTotal = parseFloat(item.quantity) * parseFloat(item.price);
            const expressFeé = (item.is_express && item.type === 'service') ? parseFloat(item.express_fee || 0) : 0;

            return sum + itemTotal + expressFeé;
        }, 0);

        setSubtotal(newSubtotal);

        let discountAmount = 0;
        if (data.discount_type === 'amount') {
            discountAmount = parseFloat(data.discount_value) || 0;
        } else if (data.discount_type === 'percent') {
            discountAmount = (newSubtotal * (parseFloat(data.discount_value) || 0)) / 100;
        }

        const finalTotal = Math.max(0, newSubtotal - discountAmount);
        setTotal(finalTotal);

        setData(prevData => ({
            ...prevData,
            total_amount: newSubtotal,
            final_total: finalTotal
        }));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;

        // Auto-fill price when service/product is selected
        if ((field === 'service_id' || field === 'product_id') && value) {
            const options = field === 'service_id' ? services : products;
            const selectedItem = options.find(item => item.id == value);
            if (selectedItem) {
                newItems[index].price = parseFloat(selectedItem.price) || 0;
            }
        }

        // Reset fields when type changes
        if (field === 'type') {
            newItems[index].service_id = '';
            newItems[index].product_id = '';
            newItems[index].price = 0;
            newItems[index].is_express = false;
            newItems[index].express_fee = 0;
        }

        // Reset express jika bukan service
        if (field === 'type' && value === 'product') {
            newItems[index].is_express = false;
            newItems[index].express_fee = 0;
        }

        // Reset express_fee jika is_express di-uncheck
        if (field === 'is_express' && !value) {
            newItems[index].express_fee = 0;
        }

        setData('items', newItems);
    };

    const addItem = () => {
        setData('items', [...data.items, {
            type: 'service',
            service_id: '',
            product_id: '',
            quantity: 0,
            price: 0,
            is_express: false,
            express_fee: 0,
            notes: ''
        }]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const newItems = data.items.filter((_, i) => i !== index);
            setData('items', newItems);
        }
    };

    const formatCurrency = (amount) => {
        return `Rp ${parseFloat(amount || 0).toLocaleString('id-ID')}`;
    };

    // ✅ PERBAIKAN: Step untuk decimal kg
    const getQuantityStep = (item) => {
        if (item.type === 'service' && item.service_id) {
            const service = services.find(s => s.id == item.service_id);
            return service?.price_type === 'per_kg' ? '0.001' : '1';
        }
        return '1';
    };

    const getQuantityPlaceholder = (item) => {
        if (item.type === 'service' && item.service_id) {
            const service = services.find(s => s.id == item.service_id);
            return service?.price_type === 'per_kg' ? '0.0 kg' : '0 item';
        }
        return '0 pcs';
    };

    const getQuantityLabel = (item) => {
        if (item.type === 'service' && item.service_id) {
            const service = services.find(s => s.id == item.service_id);
            if (service?.price_type === 'per_kg') return 'Berat (kg)';
            if (service?.price_type === 'per_item') return 'Jumlah (item)';
            return 'Jumlah (satuan)';
        }
        return 'Jumlah (pcs)';
    };

    // ✅ PERBAIKAN: Handler untuk decimal input
    const handleQuantityChange = (index, value) => {
        // Simpan string ke state agar input tidak terblokir
        updateItem(index, 'quantity', value);
    };

    const getItemSubtotal = (item) => {
        const baseTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
        const expressFeé = (item.is_express && item.type === 'service') ? (parseFloat(item.express_fee) || 0) : 0;
        return baseTotal + expressFeé;
    };

    // Customer options untuk searchable select
    const customerOptions = customers.map(customer => ({
        value: customer.id,
        label: `${customer.name} - ${customer.phone_number}`
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('[FORM SUBMIT DEBUG]', JSON.stringify(data, null, 2));

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

        // Validasi dan normalisasi items
        const validItems = data.items
            .filter(item => {
                const hasValidId = (item.type === 'service' && item.service_id) ||
                                  (item.type === 'product' && item.product_id);
                // Parse quantity (replace comma with dot)
                const qty = typeof item.quantity === 'string' ? parseFloat(item.quantity.replace(',', '.')) : item.quantity;
                return hasValidId && qty > 0 && item.price > 0;
            })
            .map(item => ({
                ...item,
                // Parse quantity to float, replace comma with dot
                quantity: typeof item.quantity === 'string' ? parseFloat(item.quantity.replace(',', '.')) : item.quantity,
                service_id: item.type === 'service' ? item.service_id : null,
                product_id: item.type === 'product' ? item.product_id : null
            }));

        if (validItems.length === 0) {
            alert('Silakan tambahkan minimal satu item yang valid');
            return;
        }

        // Pastikan semua field numerik dikirim sebagai number
        put(route('transactions.update', transaction.id), {
            ...data,
            paid_amount: parseFloat(data.paid_amount) || 0,
            discount_value: parseFloat(data.discount_value) || 0,
            total_amount: parseFloat(data.total_amount) || 0,
            final_total: parseFloat(data.final_total) || 0,
            items: validItems
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        ✏️ Edit Transaksi #{transaction.invoice_number}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('transactions.show', transaction.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            👁️ Detail
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
            <Head title={`Edit Transaksi ${transaction.invoice_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {errors.error && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {errors.error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Invoice Info */}
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2 text-blue-800">📋 Informasi Invoice</h4>
                                    <div className="text-sm text-blue-600">
                                        <strong>No. Invoice:</strong> {transaction.invoice_number}
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Pelanggan *</label>
                                        <SearchableSelect
                                            options={customerOptions}
                                            value={data.customer_id}
                                            onChange={(value) => setData('customer_id', value)}
                                            placeholder="Cari dan pilih pelanggan..."
                                            error={!!errors.customer_id}
                                        />
                                        {errors.customer_id && <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tanggal Transaksi *</label>
                                        <input
                                            type="date"
                                            value={data.transaction_date}
                                            onChange={(e) => {
                                                console.log('Tanggal dipilih:', e.target.value);
                                                setData('transaction_date', e.target.value);
                                            }}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.transaction_date && <p className="text-red-500 text-xs mt-1">{errors.transaction_date}</p>}
                                        <small className="text-gray-500">Debug: {data.transaction_date}</small>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Estimasi Selesai *</label>
                                        <input
                                            type="date"
                                            value={data.estimated_completion}
                                            onChange={(e) => {
                                                console.log('Estimasi dipilih:', e.target.value);
                                                setData('estimated_completion', e.target.value);
                                            }}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.estimated_completion && <p className="text-red-500 text-xs mt-1">{errors.estimated_completion}</p>}
                                        <small className="text-gray-500">Debug: {data.estimated_completion}</small>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Status Transaksi</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Status Pembayaran</label>
                                        <select
                                            value={data.payment_status}
                                            onChange={(e) => setData('payment_status', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="belum lunas">Belum Lunas</option>
                                            <option value="dp">DP</option>
                                            <option value="lunas">Lunas</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Jumlah Dibayar</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.paid_amount}
                                            onChange={(e) => setData('paid_amount', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">📦 Detail Layanan/Produk</h3>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                                        >
                                            + Tambah Item
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {data.items.map((item, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Tipe</label>
                                                        <select
                                                            value={item.type}
                                                            onChange={(e) => updateItem(index, 'type', e.target.value)}
                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="service">Layanan</option>
                                                            <option value="product">Produk</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">
                                                            {item.type === 'service' ? 'Layanan' : 'Produk'}
                                                        </label>
                                                        <select
                                                            value={item.type === 'service' ? item.service_id : item.product_id}
                                                            onChange={(e) => updateItem(index, item.type === 'service' ? 'service_id' : 'product_id', e.target.value)}
                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="">Pilih {item.type === 'service' ? 'Layanan' : 'Produk'}</option>
                                                            {(item.type === 'service' ? services : products).map(option => (
                                                                <option key={option.id} value={option.id}>
                                                                    {option.name} - {formatCurrency(option.price)}
                                                                    {item.type === 'service' && option.price_type && ` (${option.price_type})`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">{getQuantityLabel(item)} <span className="text-gray-400">(max 3 digit desimal)</span></label>
                                                        <input
                                                            key={`qty-${index}`}
                                                            name={`qty-${index}`}
                                                            id={`qty-${index}`}
                                                            type="text"
                                                            autoComplete="off"
                                                            value={typeof item.quantity === 'string' ? item.quantity : (item.quantity || '')}
                                                            onChange={e => {
                                                                let val = e.target.value;
                                                                // Cek apakah item ini per_kg (boleh desimal) atau bukan (hanya integer)
                                                                let allowDecimal = false;
                                                                if (item.type === 'service' && item.service_id) {
                                                                    const service = services.find(s => s.id == item.service_id);
                                                                    allowDecimal = service && service.price_type === 'per_kg';
                                                                }
                                                                if (allowDecimal) {
                                                                    // Allow only numbers, comma, dot, and up to 3 decimals
                                                                    val = val.replace(/[^\d.,]/g, '');
                                                                    const parts = val.split(/[.,]/);
                                                                    if (parts.length > 2) {
                                                                        val = parts[0] + '.' + parts.slice(1).join('').slice(0,3);
                                                                    } else if (parts.length === 2) {
                                                                        val = parts[0] + (val.includes(',') ? ',' : '.') + parts[1].slice(0,3);
                                                                    }
                                                                    const regex = /^\d+([,.]?\d{0,3})?$/;
                                                                    if (val === '' || regex.test(val)) {
                                                                        handleQuantityChange(index, val);
                                                                    }
                                                                } else {
                                                                    // Only allow integer (no comma/dot)
                                                                    val = val.replace(/[^\d]/g, '');
                                                                    handleQuantityChange(index, val);
                                                                }
                                                            }}
                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder={getQuantityPlaceholder(item)}
                                                        />
                                                        <small className="text-gray-500 text-xs mt-1 block">
                                                            {(() => {
                                                                let allowDecimal = false;
                                                                if (item.type === 'service' && item.service_id) {
                                                                    const service = services.find(s => s.id == item.service_id);
                                                                    allowDecimal = service && service.price_type === 'per_kg';
                                                                }
                                                                return allowDecimal
                                                                    ? 'Contoh: 3,234 atau 2,5 (boleh koma atau titik)'
                                                                    : 'Contoh: 2, 5, 10 (hanya angka bulat)';
                                                            })()}
                                                        </small>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Harga</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={item.price || ''}
                                                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Subtotal</label>
                                                        <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm">
                                                            {formatCurrency(getItemSubtotal(item))}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                                                            disabled={data.items.length === 1}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Express dan Notes */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                    {item.type === 'service' && (
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`express-${index}`}
                                                                checked={item.is_express || false}
                                                                onChange={(e) => updateItem(index, 'is_express', e.target.checked)}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`express-${index}`} className="text-sm">Express</label>
                                                        </div>
                                                    )}

                                                    {item.is_express && item.type === 'service' && (
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Biaya Express</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={item.express_fee || ''}
                                                                onChange={(e) => updateItem(index, 'express_fee', parseFloat(e.target.value) || 0)}
                                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Catatan</label>
                                                        <input
                                                            type="text"
                                                            value={item.notes || ''}
                                                            onChange={(e) => updateItem(index, 'notes', e.target.value)}
                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Catatan khusus..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Discount Section */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium mb-3">💰 Diskon</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Tipe Diskon</label>
                                            <select
                                                value={data.discount_type}
                                                onChange={(e) => setData('discount_type', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="amount">Nominal (Rp)</option>
                                                <option value="percent">Persentase (%)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Nilai Diskon</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={data.discount_value}
                                                onChange={(e) => setData('discount_value', parseFloat(e.target.value) || 0)}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Potongan</label>
                                            <div className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm">
                                                {data.discount_type === 'amount'
                                                    ? formatCurrency(data.discount_value)
                                                    : `${data.discount_value}% = ${formatCurrency((subtotal * data.discount_value) / 100)}`
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Catatan Transaksi</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        placeholder="Catatan tambahan untuk transaksi ini..."
                                    />
                                </div>

                                {/* Summary */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium mb-3">📊 Ringkasan</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        {data.discount_value > 0 && (
                                            <div className="flex justify-between text-red-600">
                                                <span>Diskon:</span>
                                                <span>
                                                    -{data.discount_type === 'amount'
                                                        ? formatCurrency(data.discount_value)
                                                        : `${data.discount_value}% (${formatCurrency((subtotal * data.discount_value) / 100)})`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                                            <span>Total:</span>
                                            <span>{formatCurrency(total)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Dibayar:</span>
                                            <span>{formatCurrency(data.paid_amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Sisa:</span>
                                            <span className={total - data.paid_amount > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>
                                                {formatCurrency(Math.max(0, total - data.paid_amount))}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4">
                                    <Link
                                        href={route('transactions.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : '💾 Update Transaksi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
