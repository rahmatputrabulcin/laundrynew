import { useState, useEffect } from 'react';
import SearchableSelect from './SearchableSelect';

export default function TransactionForm({ 
    data, 
    setData, 
    errors, 
    customers, 
    services, 
    products, 
    isEdit = false 
}) {
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!isEdit) {
            calculateTotal();
        }
    }, [data.items, data.discount_type, data.discount_value]);

    const calculateTotal = () => {
        if (isEdit) return; // Tidak hitung ulang di edit mode

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
        
        // Update form data
        setData(prevData => ({
            ...prevData,
            total_amount: finalTotal
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

    const getQuantityStep = (item) => {
        if (item.type === 'service' && item.service_id) {
            const service = services.find(s => s.id == item.service_id);
            return service?.price_type === 'per_kg' ? '0.001' : '1';
        }
        return '1'; // Default untuk product
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
            return service?.price_type === 'per_kg' ? 'Berat (kg)' : 'Jumlah (item)';
        }
        return 'Jumlah (pcs)';
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

    return (
        <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isEdit && (
                    <div>
                        <label className="block text-sm font-medium mb-1">No. Invoice *</label>
                        <input
                            type="text"
                            value={data.invoice_number}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100"
                            readOnly
                        />
                    </div>
                )}

                <div className={isEdit ? 'md:col-span-2' : ''}>
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
                        onChange={(e) => setData('transaction_date', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.transaction_date && <p className="text-red-500 text-xs mt-1">{errors.transaction_date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Estimasi Selesai *</label>
                    <input
                        type="date"
                        value={data.estimated_completion}
                        onChange={(e) => setData('estimated_completion', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {errors.estimated_completion && <p className="text-red-500 text-xs mt-1">{errors.estimated_completion}</p>}
                </div>

                {isEdit && (
                    <>
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
                    </>
                )}
            </div>

            {/* Items Section - Hanya di Create */}
            {!isEdit && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Detail Layanan/Produk</h3>
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
                                            value={item.quantity || ''}
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
                                                        updateItem(index, 'quantity', val);
                                                    }
                                                } else {
                                                    // Only allow integer (no comma/dot)
                                                    val = val.replace(/[^\d]/g, '');
                                                    updateItem(index, 'quantity', val);
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
                                            value={item.price}
                                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>

                                    {item.type === 'service' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Express</label>
                                            <div className="space-y-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.is_express}
                                                        onChange={(e) => updateItem(index, 'is_express', e.target.checked)}
                                                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm">⚡ Express</span>
                                                </label>
                                                {item.is_express && (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.express_fee}
                                                        onChange={(e) => updateItem(index, 'express_fee', parseFloat(e.target.value) || 0)}
                                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Biaya Express"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm disabled:opacity-50"
                                            disabled={data.items.length === 1}
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Item Subtotal */}
                                <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal Item #{index + 1}:</span>
                                        <span className="font-medium text-blue-600">
                                            {formatCurrency(getItemSubtotal(item))}
                                        </span>
                                    </div>
                                    {item.is_express && item.express_fee > 0 && (
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>• Base: {formatCurrency(item.quantity * item.price)}</span>
                                            <span>• Express: {formatCurrency(item.express_fee)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Discount & Total Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {!isEdit && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tipe Diskon</label>
                                <select
                                    value={data.discount_type}
                                    onChange={(e) => setData('discount_type', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                />
                            </div>
                        </>
                    )}

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

                    {!isEdit && (
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
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="font-medium mb-3 text-blue-800">💰 Ringkasan Total</h4>
                    <div className="space-y-2 text-sm">
                        {!isEdit ? (
                            <>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
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
                                <hr className="border-blue-300" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">{formatCurrency(total)}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">{formatCurrency(data.final_total || data.total_amount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Dibayar:</span>
                                    <span className="text-green-600">{formatCurrency(data.paid_amount)}</span>
                                </div>
                                {data.paid_amount < (data.final_total || data.total_amount) && (
                                    <div className="flex justify-between text-red-600 font-medium">
                                        <span>Sisa:</span>
                                        <span>{formatCurrency((data.final_total || data.total_amount) - data.paid_amount)}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium mb-1">Catatan</label>
                <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Catatan tambahan (opsional)"
                />
            </div>
        </div>
    );
}