import { Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ products, auth, flash }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash && flash.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{flash.success}</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Product List</h3>
                                <Link
                                    href={route('products.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add Product
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-3 px-4 text-left">Name</th>
                                            <th className="py-3 px-4 text-left">Price</th>
                                            <th className="py-3 px-4 text-left">Description</th>
                                            <th className="py-3 px-4 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products && products.length > 0 ? (
                                            products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="py-3 px-4">{product.name}</td>
                                                    <td className="py-3 px-4">Rp {parseFloat(product.price).toLocaleString()}</td>
                                                    <td className="py-3 px-4">{product.description}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={route('products.edit', product.id)}
                                                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
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
                                                <td colSpan="4" className="py-3 px-4 text-center">
                                                    No products found. Please add some products.
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
