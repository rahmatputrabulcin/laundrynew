import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        phone_number: '',
        email: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('customers.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Customer</h2>}
        >
            <Head title="Create Customer" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.name && <div className="text-red-500 mt-1">{errors.name}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone_number</label>
                                    <input
                                        type="text"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.phone_number && <div className="text-red-500 mt-1">{errors.phone_number}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.email && <div className="text-red-500 mt-1">{errors.email}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="3"
                                    />
                                    {errors.address && <div className="text-red-500 mt-1">{errors.address}</div>}
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <Link href={route('customers.index')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {processing ? 'Saving...' : 'Save Customer'}
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
