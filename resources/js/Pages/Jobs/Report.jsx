import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, router } from "@inertiajs/react";

export default function Report({ jobs, users, services, filters, total_upah,total_kiloan,rekap_per_pegawai,rekap_per_layanan }) {
  function handleFilter(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    router.get(route("jobs.report"), data);
  }

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Laporan Pekerjaan</h2>}>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow mt-8">
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
          <table className="min-w-full bg-white shadow rounded text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Pegawai</th>
                <th className="border px-3 py-2">Layanan</th>
                <th className="border px-3 py-2">Jenis</th>
                <th className="border px-3 py-2">Jumlah Kilo</th>
                <th className="border px-3 py-2">Tarif/Kilo</th>
                <th className="border px-3 py-2">Total Upah</th>
                <th className="border px-3 py-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? jobs.map(job => (
                <tr key={job.id}>
                  <td className="border px-3 py-2">{job.user?.name}</td>
                  <td className="border px-3 py-2">{job.detail?.service?.name}</td>
                  <td className="border px-3 py-2">{job.jenis}</td>
                  <td className="border px-3 py-2">{job.jumlah_kilo}</td>
                  <td className="border px-3 py-2">Rp {job.tarif_per_kilo.toLocaleString()}</td>
                  <td className="border px-3 py-2">Rp {(job.jumlah_kilo * job.tarif_per_kilo).toLocaleString()}</td>
                  <td className="border px-3 py-2">{job.tanggal}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-400">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
          {rekap_per_pegawai && rekap_per_pegawai.length > 0 && (
  <div className="mt-6">
    <h3 className="font-bold mb-2">Rekap Per Pegawai</h3>
    <table className="min-w-full bg-white shadow rounded text-sm mb-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-3 py-2">Pegawai</th>
          <th className="border px-3 py-2">Total Kiloan</th>
          <th className="border px-3 py-2">Total Upah</th>
        </tr>
      </thead>
      <tbody>
        {rekap_per_pegawai.map((r, i) => (
          <tr key={i}>
            <td className="border px-3 py-2">{r.nama}</td>
            <td className="border px-3 py-2">{r.total_kiloan}</td>
            <td className="border px-3 py-2">Rp {r.total_upah.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{rekap_per_layanan && rekap_per_layanan.length > 0 && (
  <div className="mt-6">
    <h3 className="font-bold mb-2">Rekap Per Layanan</h3>
    <table className="min-w-full bg-white shadow rounded text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-3 py-2">Layanan</th>
          <th className="border px-3 py-2">Total Kiloan</th>
          <th className="border px-3 py-2">Total Upah</th>
        </tr>
      </thead>
      <tbody>
        {rekap_per_layanan.map((r, i) => (
          <tr key={i}>
            <td className="border px-3 py-2">{r.layanan}</td>
            <td className="border px-3 py-2">{r.total_kiloan}</td>
            <td className="border px-3 py-2">Rp {r.total_upah.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
        </div>
        <Link href={route("jobs.index")} className="inline-block mt-4 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded shadow transition">
          Kembali
        </Link>
      </div>
    </AuthenticatedLayout>
  );
}
