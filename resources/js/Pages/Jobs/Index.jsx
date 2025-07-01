import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, router } from "@inertiajs/react";

export default function Index({ jobs }) {
  function handleDelete(id) {
    if (confirm("Yakin ingin menghapus pekerjaan ini?")) {
      router.delete(route("jobs.destroy", id));
    }
  }

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Pekerjaan</h2>}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
          <Link
            href={route("jobs.create")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition text-center"
          >
            + Tambah Pekerjaan
          </Link>
          <Link
  href={route("jobs.report")}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow transition text-center"
>
  Laporan Pekerjaan
</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Nama Pegawai</th>
                <th className="border px-3 py-2">Jenis</th>
                <th className="border px-3 py-2">Jumlah Kilo</th>
                <th className="border px-3 py-2">Tarif/Kilo</th>
                <th className="border px-3 py-2">Tanggal</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.data && jobs.data.length > 0 ? jobs.data.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{job.user ? job.user.name : '-'}</td>
                  <td className="border px-3 py-2 capitalize">{job.jenis || '-'}</td>
                  <td className="border px-3 py-2">{job.jumlah_kilo ?? '-'}</td>
                  <td className="border px-3 py-2"> {job.tarif_per_kilo !== undefined && job.tarif_per_kilo !== null
    ? `Rp ${job.tarif_per_kilo.toLocaleString()}`
    : '-'}</td>
                  <td className="border px-3 py-2">{job.tanggal || '-'}</td>
                  <td className="border px-3 py-2 whitespace-nowrap flex flex-wrap gap-1">
                    <Link
                      href={route("jobs.show", job.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded"
                    >
                      View
                    </Link>
                    <Link
                      href={route("jobs.edit", job.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                      type="button"
                    >
                      Hapus
                    </button>
                   <Link
  href={route("jobs.singleReport", job.id)}
  className="bg-yellow-400 hover:bg-yellow-500 text-xs px-2 py-1 rounded"
>
  Laporan
</Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-400">Belum ada data pekerjaan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
