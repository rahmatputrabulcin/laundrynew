import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Edit({ expense, auth }) {
    const { data, setData, put, errors, processing } = useForm({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || '',
        expense_date: expense.expense_date || '',
        description: expense.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('expenses.update', expense.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Expense</h2>}
        >
            <Head title="Edit Expense" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                />
                                {errors.title && <div className="text-red-500">{errors.title}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                />
                                {errors.amount && <div className="text-red-500">{errors.amount}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                >
                                    <option value="">-- Select --</option>
                                    <option value="supplies">Supplies</option>
                                    <option value="utility">Utility</option>
                                    <option value="salary">Salary</option>
                                    <option value="rent">Rent</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.category && <div className="text-red-500">{errors.category}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expense Date</label>
                                <input
                                    type="date"
                                    // value={data.expense_date}
                                    value={data.expense_date ? data.expense_date.substring(0, 10) : ''}
                                    onChange={e => setData('expense_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                />
                                {errors.expense_date && <div className="text-red-500">{errors.expense_date}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300"
                                />
                                {errors.description && <div className="text-red-500">{errors.description}</div>}
                            </div>
                            <div className="flex justify-between">
                                <Link href={route('expenses.index')} className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded">
                                    Cancel
                                </Link>
                                <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                                    {processing ? 'Saving...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
