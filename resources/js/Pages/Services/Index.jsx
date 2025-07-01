import { Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ services, auth, flash }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this service?')) {
            destroy(route('services.destroy', id));
        }
    };

    const getPriceTypeLabel = (priceType) => {
        switch (priceType) {
            case 'per_kg':
                return 'Per KG';
            case 'per_item':
                return 'Per Item';
            case 'fixed':
                return 'Fixed Price';
            default:
                return priceType;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Services</h2>}
        >
            <Head title="Services" />

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
                                <h3 className="text-lg font-semibold">Service List</h3>
                                <Link
                                    href={route('services.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Service
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left">Name</th>
                                            <th className="py-3 px-4 text-left">Price</th>
                                            <th className="py-3 px-4 text-left">Price Type</th>
                                            <th className="py-3 px-4 text-left">Express</th>
                                            <th className="py-3 px-4 text-left">Description</th>
                                            <th className="py-3 px-4 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {services && services.length > 0 ? (
                                            services.map((service) => (
                                                <tr key={service.id}>
                                                    <td className="py-3 px-4">{service.name}</td>
                                                    <td className="py-3 px-4">Rp {parseFloat(service.price).toLocaleString()}</td>
                                                    <td className="py-3 px-4">{getPriceTypeLabel(service.price_type)}</td>
                                                    <td className="py-3 px-4">
                                                        {service.is_express ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Yes (x{service.express_multiplier})
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                No
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">{service.description}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('services.edit', service.id)}
                                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(service.id)}
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
                                                <td colSpan="6" className="py-3 px-4 text-center">
                                                    No services found. Please add some services.
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
