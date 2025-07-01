import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        price: '',
        price_type: 'per_kg',
        is_express: false,
        express_multiplier: '1.5',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('services.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Service</h2>}
        >
            <Head title="Create Service" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Service Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.price && <div className="text-red-500 mt-1">{errors.price}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price Type</label>
                                    <select
                                        value={data.price_type}
                                        onChange={(e) => setData('price_type', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="per_kg">Per KG</option>
                                        <option value="per_item">Per Item</option>
                                        <option value="fixed">Fixed Price</option>
                                    </select>
                                    {errors.price_type && <div className="text-red-500 mt-1">{errors.price_type}</div>}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_express"
                                        checked={data.is_express}
                                        onChange={(e) => setData('is_express', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="is_express" className="ml-2 block text-sm font-medium text-gray-700">
                                        Is Express Service
                                    </label>
                                </div>

                                {data.is_express && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Express Multiplier</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="1"
                                            value={data.express_multiplier}
                                            onChange={(e) => setData('express_multiplier', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Express price = Regular price × multiplier
                                        </p>
                                        {errors.express_multiplier && <div className="text-red-500 mt-1">{errors.express_multiplier}</div>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                    />
                                    {errors.description && <div className="text-red-500 mt-1">{errors.description}</div>}
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <Link href={route('services.index')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {processing ? 'Saving...' : 'Save Service'}
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
