import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function NewReport({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-2xl font-bold text-blue-700">📊 Laporan Baru</h2>}
        >
            <Head title="Laporan Baru" />
            
            <div className="max-w-7xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">🚧 Coming Soon</h3>
                    <p className="text-gray-600">
                        Fitur laporan baru sedang dalam pengembangan. 
                        Silakan gunakan laporan transaksi yang sudah tersedia.
                    </p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-800">📈 Laporan Penjualan</h4>
                            <p className="text-sm text-blue-600">Coming Soon...</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-800">💰 Laporan Keuangan</h4>
                            <p className="text-sm text-green-600">Coming Soon...</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-medium text-purple-800">👥 Laporan Customer</h4>
                            <p className="text-sm text-purple-600">Coming Soon...</p>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-800">📊 Laporan Statistik</h4>
                            <p className="text-sm text-yellow-600">Coming Soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}