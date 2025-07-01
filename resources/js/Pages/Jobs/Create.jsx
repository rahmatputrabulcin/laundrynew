import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, Link } from "@inertiajs/react";

export default function Create({ transactions, users, wages, currentUser, usedDetailIds = [] }) {
  const [selectedTransaction, setSelectedTransaction] = React.useState("");
  const [selectedDetail, setSelectedDetail] = React.useState("");
  const [selectedJenis, setSelectedJenis] = React.useState("setrika");

  const { data, setData, post, processing, errors } = useForm({
    transaction_id: "",
    detail_id: "",
    user_id: "",
    jenis: "setrika",
    jumlah_kilo: "",
    tarif_per_kilo: wages.find(w => w.jenis === "setrika")?.tarif_per_kilo || 0,
    total_upah: 0,
     tanggal: new Date().toISOString().slice(0, 10),
  });

  // Dapatkan transaksi terpilih
  const transaksi = transactions.find(t => t.id == selectedTransaction);
  // Dapatkan detail terpilih
  const detail = transaksi?.details?.find(d => d.id == selectedDetail);

  React.useEffect(() => {
    setData("transaction_id", selectedTransaction);
    setSelectedDetail(""); // reset detail jika ganti nota
  }, [selectedTransaction]);

  React.useEffect(() => {
    setData("detail_id", selectedDetail);
    if (detail) {
      setData("jumlah_kilo", detail.quantity);
      setSelectedJenis(detail.service?.jenis || "setrika");
    }
  }, [selectedDetail]);

  React.useEffect(() => {
    const wage = wages.find(w => w.jenis === selectedJenis);
    setData("tarif_per_kilo", wage ? wage.tarif_per_kilo : 0);
    setData("jenis", selectedJenis);
  }, [selectedJenis, wages]);

  React.useEffect(() => {
    setData(
      "total_upah",
      parseFloat(data.jumlah_kilo || 0) * parseInt(data.tarif_per_kilo || 0)
    );
  }, [data.jumlah_kilo, data.tarif_per_kilo]);

  const isAdmin = currentUser.role === "admin";
  React.useEffect(() => {
    if (!isAdmin) setData("user_id", currentUser.id);
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    post(route("jobs.store"));
  }

  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Input Pekerjaan Pegawai</h2>}>
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-8">
        <form onSubmit={handleSubmit}>
          {/* Dropdown Nota */}
          <label className="block mb-2 font-semibold">Nota/Transaksi</label>
          <select
            value={selectedTransaction}
            onChange={e => setSelectedTransaction(e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
          >
            <option value="">Pilih Nota</option>
            {transactions.map(t => (
              <option key={t.id} value={t.id}>
                {t.invoice_number} - {t.customer ? t.customer.name : "-"} - {t.created_at?.slice(0, 10)}
              </option>
            ))}
          </select>
          {errors.transaction_id && <div className="text-red-500 mb-2">{errors.transaction_id}</div>}

          {/* Dropdown Detail Service */}
    {transaksi && transaksi.details && (
  <>
    <label className="block mb-2 font-semibold">Layanan pada Nota</label>
   <select
  value={selectedDetail}
  onChange={e => setSelectedDetail(e.target.value)}
  className="border rounded px-2 py-1 w-full mb-2"
>
  <option value="">Pilih Layanan</option>
  {transaksi.details.map(d => (
    <option
      key={d.id}
      value={d.id}
      disabled={usedDetailIds.includes(d.id)}
    >
      {d.service?.name || "-"} ({d.service?.jenis || "-"}) - {d.quantity} kg
      {usedDetailIds.includes(d.id) ? " (sudah dipilih)" : ""}
    </option>
  ))}
</select>
  </>
)}

          {/* Pegawai */}
          <label className="block mb-2 font-semibold">Pegawai</label>
          {isAdmin ? (
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
          ) : (
            <input
              type="text"
              value={`${currentUser.name} (${currentUser.role})`}
              readOnly
              className="border rounded px-2 py-1 w-full mb-2 bg-gray-100"
            />
          )}
          {errors.user_id && <div className="text-red-500 mb-2">{errors.user_id}</div>}

          {/* Jenis Pekerjaan */}
          <label className="block mb-2 font-semibold">Jenis Pekerjaan</label>
          <select
            value={selectedJenis}
            onChange={e => setSelectedJenis(e.target.value)}
            className="border rounded px-2 py-1 w-full mb-2"
          >
            {wages.map(w => (
              <option key={w.jenis} value={w.jenis}>
                {w.jenis.charAt(0).toUpperCase() + w.jenis.slice(1)}
              </option>
            ))}
          </select>
          {errors.jenis && <div className="text-red-500 mb-2">{errors.jenis}</div>}

          {/* Jumlah Kilo */}
         <label className="block mb-2 font-semibold">Jumlah Kilo</label>
<input
  type="number"
  value={detail ? detail.quantity : ""}
  readOnly
  className="border rounded px-2 py-1 w-full mb-2 bg-gray-100"
/>
{errors.jumlah_kilo && <div className="text-red-500 mb-2">{errors.jumlah_kilo}</div>}
          {/* Tarif dan Total */}
          <label className="block mb-2 font-semibold">Tarif per Kilo</label>
          <input
            type="number"
            value={data.tarif_per_kilo}
            readOnly
            className="border rounded px-2 py-1 w-full mb-2 bg-gray-100"
          />

          <label className="block mb-2 font-semibold">Total Upah</label>
          <input
            type="number"
            value={data.total_upah}
            readOnly
            className="border rounded px-2 py-1 w-full mb-4 bg-gray-100"
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
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition"
            >
              Simpan
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
