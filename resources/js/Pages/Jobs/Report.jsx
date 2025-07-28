import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Report({ jobs, users, services, filters, total_upah,total_kiloan,rekap_per_pegawai,rekap_per_layanan, auth }) {
  function handleFilter(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    router.get(route("jobs.report"), data);
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="text-2xl font-bold text-blue-700">📋 Laporan Pekerjaan</h2>}
    >
      <Head title="Laporan Pekerjaan" />
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Daftar Pekerjaan</h3>
          <form onSubmit={handleFilter} className="flex flex-wrap gap-2 mb-4">
            <select name="user_id" defaultValue={filters.user_id || ""} className="border rounded px-2 py-1">
              <option value="">Semua Pegawai</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <select name="service_id" defaultValue={filters.service_id || ""} className="border rounded px-2 py-1">
              <option value="">Semua Layanan</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input type="date" name="tanggal" defaultValue={filters.tanggal || ""} className="border rounded px-2 py-1" />
            <select name="bulan" defaultValue={filters.bulan || ""} className="border rounded px-2 py-1">
              <option value="">Semua Bulan</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1}</option>
              ))}
            </select>
            <input type="number" name="tahun" placeholder="Tahun" defaultValue={filters.tahun || ""} className="border rounded px-2 py-1 w-24" />
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Filter</button>
          </form>
          <div className="mb-2 font-semibold">
  Total Kiloan Masuk: <span className="text-blue-600">{total_kiloan.toLocaleString()} kg</span>
</div>
<div className="mb-4 font-semibold">
  Total Upah: <span className="text-green-600">Rp {total_upah.toLocaleString()}</span>
</div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.length > 0 ? jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(job.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {job.transaction?.customer?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {job.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${job.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{job.progress || 0}%</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">📭</div>
                        <p>Tidak ada data pekerjaan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
