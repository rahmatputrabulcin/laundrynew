import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Link } from "@inertiajs/react";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    role: "operator",
    phone_number: "",
    address: "",
    is_active: true,
  });

  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    post(route("users.store"));
  }

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah User</h2>}
    >
      <div className="py-12">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nama"
                value={data.name}
                onChange={e => setData("name", e.target.value)}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              {errors.name && <div className="text-red-500">{errors.name}</div>}

              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={e => setData("email", e.target.value)}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              {errors.email && <div className="text-red-500">{errors.email}</div>}

              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  onChange={e => setData("password", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
                    // Eye-off icon (SVG)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.562 2.175A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.562-2.175A9.956 9.956 0 0112 19c-1.657 0-3.236-.336-4.675-.938" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    // Eye icon (SVG)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </span>
              </div>
              {errors.password && <div className="text-red-500">{errors.password}</div>}

              <select
                value={data.role}
                onChange={e => setData("role", e.target.value)}
                className="border rounded px-2 py-1 w-full mb-2"
              >
                <option value="admin">Admin</option>
                <option value="cashier">Kasir</option>
                <option value="operator">Operator</option>
                <option value="delivery">Kurir</option>
                <option value="setrika">setrika/cuci</option>
              </select>

              <input
                type="text"
                placeholder="Telepon"
                value={data.phone_number}
                onChange={e => setData("phone_number", e.target.value)}
                className="border rounded px-2 py-1 w-full mb-2"
              />

              <textarea
                placeholder="Alamat"
                value={data.address}
                onChange={e => setData("address", e.target.value)}
                className="border rounded px-2 py-1 w-full mb-2"
              />

              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={data.is_active}
                  onChange={e => setData("is_active", e.target.checked)}
                  className="mr-2"
                />
                Aktif
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={processing} className="bg-blue-500 text-white px-4 py-2 rounded">Simpan</button>
                <Link href={route("users.index")} className="bg-gray-300 px-4 py-2 rounded">Batal</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
