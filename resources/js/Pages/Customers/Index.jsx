import { Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ customers, auth, flash }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            destroy(route('customers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customers</h2>}
        >
            <Head title="Customers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash && flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    {flash && flash.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.error}</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Customer List</h3>
                                <Link
                                    href={route('customers.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Customer
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left">Name</th>
                                            <th className="py-3 px-4 text-left">Phone</th>
                                            <th className="py-3 px-4 text-left">Email</th>
                                            <th className="py-3 px-4 text-left">Address</th>
                                            <th className="py-3 px-4 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {customers && customers.length > 0 ? (
                                            customers.map((customer) => (
                                                <tr key={customer.id}>
                                                    <td className="py-3 px-4">{customer.name}</td>
                                                    <td className="py-3 px-4">{customer.phone}</td>
                                                    <td className="py-3 px-4">{customer.email}</td>
                                                    <td className="py-3 px-4">{customer.address}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('customers.show', customer.id)}
                                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={route('customers.edit', customer.id)}
                                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(customer.id)}
                                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-3 px-4 text-center">
                                                    No customers found. Please add some customers.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
