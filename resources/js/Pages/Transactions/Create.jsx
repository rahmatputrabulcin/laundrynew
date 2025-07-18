import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Create({ customers, services, invoiceNumber, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        transaction_date: new Date().toISOString().slice(0, 10), // Default hari ini
        estimated_completion: '',
        items: [{ service_id: '', quantity: 0.1, is_express: false, notes: '' }], // ← UBAH DARI 1 KE 0.1
        total_amount: 0,
        discount_type: 'amount',
        discount_value: 0,
        paid_amount: 0,
        payment_status: 'belum lunas',
        notes: '',
        invoice_number: invoiceNumber,
    });

    // Hitung total sebelum diskon
    const calculateTotal = () => {
        return data.items.reduce((sum, item) => {
            const service = services.find(s => s.id == item.service_id);
            const price = service ? parseFloat(service.price) : 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    // Hitung final total setelah diskon
    const calculateFinalTotal = () => {
        const total = calculateTotal();
        if (data.discount_type === 'amount') {
            return Math.max(total - parseFloat(data.discount_value || 0), 0);
        } else if (data.discount_type === 'percent') {
            return Math.max(total - (total * parseFloat(data.discount_value || 0) / 100), 0);
        }
        return total;
    };

    const handleItemChange = (idx, field, value) => {
        const items = [...data.items];
        items[idx][field] = value;
        setData('items', items);
        setData('total_amount', calculateTotal());
    };

    const addItem = () => {
        setData('items', [...data.items, { service_id: '', quantity: 0.1, is_express: false, notes: '' }]);
    };

    const removeItem = (idx) => {
        const items = data.items.filter((_, i) => i !== idx);
        setData('items', items);
        setData('total_amount', calculateTotal());
    };

    const handleDiscountTypeChange = (e) => {
        setData('discount_type', e.target.value);
    };

    const handleDiscountValueChange = (e) => {
        setData('discount_value', e.target.value);
    };

    const handlePaymentStatusChange = (e) => {
        setData('payment_status', e.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        setData('total_amount', calculateTotal());
        setData('final_total', calculateFinalTotal());
        post(route('transactions.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Transaction</h2>}>
            <Head title="Add Transaction" />
            <form onSubmit={submit} className="space-y-4 p-6 bg-white rounded shadow max-w-2xl mx-auto mt-8">
                <div>
                    <label className="block">Invoice Number</label>
                    <input
                        type="text"
                        value={data.invoice_number}
                        disabled
                        className="w-full border rounded px-2 py-1"
                    />
                    {errors.invoice_number && <div className="text-red-500">{errors.invoice_number}</div>}
                </div>
                <div>
                    <label className="block">Customer</label>
                    <select value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} className="w-full border rounded px-2 py-1">
                        <option value="">-- Select --</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {errors.customer_id && <div className="text-red-500">{errors.customer_id}</div>}
                </div>
                <div>
                    <label className="block">Items</label>
                    {data.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <select value={item.service_id} onChange={e => handleItemChange(idx, 'service_id', e.target.value)} className="border rounded px-2 py-1">
                                <option value="">-- Service --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                           <input
    type="number"
    min="0.1"
    step="any"
    value={item.quantity}
    onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
    className="border rounded px-2 py-1 w-20"
    placeholder="kg"
/>
                            <label>
                                <input type="checkbox" checked={item.is_express} onChange={e => handleItemChange(idx, 'is_express', e.target.checked)} /> Express
                            </label>
                            <input type="text" value={item.notes} onChange={e => handleItemChange(idx, 'notes', e.target.value)} placeholder="Notes" className="border rounded px-2 py-1" />
                            {data.items.length > 1 && (
                                <button type="button" onClick={() => removeItem(idx)} className="text-red-500">Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addItem} className="bg-green-500 text-white px-2 py-1 rounded">Add Item</button>
                </div>
                <div>
                    <label className="block">Total</label>
                    <input type="number" value={calculateTotal()} disabled className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block">Discount Type</label>
                    <select value={data.discount_type} onChange={handleDiscountTypeChange} className="w-full border rounded px-2 py-1">
                        <option value="amount">Nominal (Rp)</option>
                        <option value="percent">Persen (%)</option>
                    </select>
                </div>
                <div>
                    <label className="block">Discount Value</label>
                    <input type="number" min="0" value={data.discount_value} onChange={handleDiscountValueChange} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block font-bold">Final Total</label>
                    <input type="number" value={calculateFinalTotal()} disabled className="w-full border rounded px-2 py-1 bg-gray-100 font-bold" />
                </div>
                <div>
                    <label className="block">Paid Amount</label>
                    <input type="number" min="0" value={data.paid_amount} onChange={e => setData('paid_amount', e.target.value)} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                    <label className="block">Payment Status</label>
                    <select value={data.payment_status} onChange={handlePaymentStatusChange} className="w-full border rounded px-2 py-1">
                        <option value="belum lunas">Belum Lunas</option>
                        <option value="lunas">Lunas</option>
                    </select>
                </div>
                <div>
                    <label className="block">Tanggal Transaksi</label>
                    <input
                        type="date"
                        value={data.transaction_date || ''}
                        onChange={e => setData('transaction_date', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    />
                    {errors.transaction_date && <div className="text-red-500 text-sm">{errors.transaction_date}</div>}
                </div>
                <div>
                    <label className="block">Estimated Completion</label>
                    <input
                        type="date"
                        value={data.estimated_completion || ''}
                        onChange={e => setData('estimated_completion', e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    />
                    {errors.estimated_completion && <div className="text-red-500 text-sm">{errors.estimated_completion}</div>}
                </div>
                <div>
                    <label className="block">Notes</label>
                    <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full border rounded px-2 py-1" />
                </div>
                <div className="flex justify-between">
                    <Link href={route('transactions.index')} className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded">Cancel</Link>
                    <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        {processing ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
