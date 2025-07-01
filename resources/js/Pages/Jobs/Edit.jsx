import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Link } from "@inertiajs/react";

export default function Edit({ job, users, wages }) {
  const { data, setData, put, processing, errors } = useForm({
    user_id: job.user_id,
    jenis: job.jenis,
    jumlah_kilo: job.jumlah_kilo,
    tarif_per_kilo: job.tarif_per_kilo,
    tanggal: job.tanggal,
  });

  React.useEffect(() => {
    const wage = wages.find(w => w.jenis === data.jenis);
    if (wage) setData("tarif_per_kilo", wage.tarif_per_kilo);
    // eslint-disable-next-line
  }, [data.jenis]);

  function handleSubmit(e) {
    e.preventDefault();
    put(route("jobs.update", job.id));
  }

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Edit Pekerjaan</h2>}>
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-8">
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Pegawai</label>
          <select
            value={data.user_id}
            onChange={e => setData("user_id", e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
          >
            <option value="">Pilih Pegawai</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
          {errors.user_id && <div className="text-red-500 mb-2">{errors.user_id}</div>}

          <label className="block mb-2 font-semibold">Jenis Pekerjaan</label>
          <select
            value={data.jenis}
            onChange={e => setData("jenis", e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
          >
            {wages.map(w => (
              <option key={w.jenis} value={w.jenis}>
                {w.jenis.charAt(0).toUpperCase() + w.jenis.slice(1)}
              </option>
            ))}
          </select>
          {errors.jenis && <div className="text-red-500 mb-2">{errors.jenis}</div>}

          <label className="block mb-2 font-semibold">Jumlah Kilo</label>
          <input
            type="number"
            value={data.jumlah_kilo}
            onChange={e => setData("jumlah_kilo", e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
          />
          {errors.jumlah_kilo && <div className="text-red-500 mb-2">{errors.jumlah_kilo}</div>}

          <label className="block mb-2 font-semibold">Tarif per Kilo</label>
          <input
            type="number"
            value={data.tarif_per_kilo}
            readOnly
            className="border rounded px-2 py-1 w-full mb-2 bg-gray-100"
          />

          <label className="block mb-2 font-semibold">Tanggal</label>
          <input
            type="date"
            value={data.tanggal || ""}
            onChange={e => setData("tanggal", e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
          />
          {errors.tanggal && <div className="text-red-500 mb-2">{errors.tanggal}</div>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow transition"
            >
              Update
            </button>
            <Link
              href={route("jobs.index")}
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
