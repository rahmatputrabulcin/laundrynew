import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link, usePage } from "@inertiajs/react";

export default function Index({ users }) {
  const { auth } = usePage().props;

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User Management</h2>}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <Link
              href={route("users.create")}
              className="bg-blue-500 text-white px-3 py-1 rounded mb-4 inline-block"
            >
              Tambah User
            </Link>
            <table className="min-w-full mt-2">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Nama</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Role</th>
                  <th className="border px-2 py-1">Telepon</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.data.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-2 py-1">{user.name}</td>
                    <td className="border px-2 py-1">{user.email}</td>
                    <td className="border px-2 py-1">{user.role}</td>
                    <td className="border px-2 py-1">{user.phone_number}</td>
                    <td className="border px-2 py-1">{user.is_active ? "Aktif" : "Nonaktif"}</td>
                    <td className="border px-2 py-1">
                      <Link
                        href={route("users.edit", user.id)}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </Link>
                      <Link
                        href={route("users.destroy", user.id)}
                        method="delete"
                        as="button"
                        className="text-red-600 hover:underline"
                        onClick={e => !confirm("Yakin hapus user ini?") && e.preventDefault()}
                      >
                        Hapus
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              {/* Pagination jika ada */}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
