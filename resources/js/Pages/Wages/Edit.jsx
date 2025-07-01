import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Link } from "@inertiajs/react";

export default function Edit({ wage }) {
  const { data, setData, put, processing, errors } = useForm({
    jenis: wage.jenis || "",
    tarif_per_kilo: wage.tarif_per_kilo || "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    put(route("wages.update", wage.id));
  }

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Edit Upah</h2>}>
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Jenis Pekerjaan</label>
          <input
            type="text"
            value={data.jenis}
            onChange={e => setData("jenis", e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
            placeholder="setrika / cuci / operator"
          />
          {errors.jenis && <div className="text-red-500 mb-2">{errors.jenis}</div>}

          <label className="block mb-2 font-semibold">Tarif per Kilo</label>
          <input
            type="number"
            value={data.tarif_per_kilo}
            onChange={e => setData("tarif_per_kilo", e.target.value)}
            className="border rounded px-2 py-1 w-full mb-4"
            placeholder="Contoh: 2000"
            min={1}
          />
          {errors.tarif_per_kilo && <div className="text-red-500 mb-2">{errors.tarif_per_kilo}</div>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
            >
              Update
            </button>
            <Link
              href={route("wages.index")}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded shadow transition"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
