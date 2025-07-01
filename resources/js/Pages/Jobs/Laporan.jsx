import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Laporan({ jobs, totalKilo, totalGaji }) {
  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Gaji Pegawai</h2>}>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Tanggal</th>
                <th className="border px-3 py-2">Jenis</th>
                <th className="border px-3 py-2">Jumlah Kilo</th>
                <th className="border px-3 py-2">Tarif/Kilo</th>
                <th className="border px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {jobs && jobs.length > 0 ? jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{job.tanggal}</td>
                  <td className="border px-3 py-2 capitalize">{job.jenis}</td>
                  <td className="border px-3 py-2">{job.jumlah_kilo}</td>
                  <td className="border px-3 py-2">Rp {job.tarif_per_kilo.toLocaleString()}</td>
                  <td className="border px-3 py-2">Rp {(job.jumlah_kilo * job.tarif_per_kilo).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">Belum ada data pekerjaan.</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td colSpan={2} className="border px-3 py-2 text-right">Total</td>
                <td className="border px-3 py-2">{totalKilo}</td>
                <td className="border px-3 py-2"></td>
                <td className="border px-3 py-2">Rp {totalGaji.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
