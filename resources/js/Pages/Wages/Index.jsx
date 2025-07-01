import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Index({ wages }) {
  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Manajemen Upah</h2>}>
      <div className="p-6">
        <Link href={route("wages.create")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow mb-4 inline-block">+ Tambah Upah</Link>
        <table className="min-w-full bg-white shadow rounded mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Jenis</th>
              <th className="border px-3 py-2">Tarif per Kilo</th>
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {wages.map(wage => (
              <tr key={wage.id}>
                <td className="border px-3 py-2 capitalize">{wage.jenis}</td>
                <td className="border px-3 py-2">Rp {wage.tarif_per_kilo.toLocaleString()}</td>
                <td className="border px-3 py-2">
                  <Link href={route("wages.edit", wage.id)} className="text-blue-500 mr-2">Edit</Link>
                  <Link as="button" method="delete" href={route("wages.destroy", wage.id)} className="text-red-500">Hapus</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout>
  );
}
