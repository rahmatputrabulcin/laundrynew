import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";

export default function SingleReport({ job, total_upah }) {
  return (
    <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Laporan Pekerjaan</h2>}>
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-8">
        <div className="mb-2"><strong>Nota:</strong> {job.transaction?.invoice_number || "-"}</div>
        <div className="mb-2"><strong>Layanan:</strong> {job.detail?.service?.name || "-"} ({job.detail?.service?.jenis || "-"})</div>
        <div className="mb-2"><strong>Pegawai:</strong> {job.user?.name || "-"}</div>
        <div className="mb-2"><strong>Jenis Pekerjaan:</strong> {job.jenis || "-"}</div>
        <div className="mb-2"><strong>Jumlah Kilo:</strong> {job.jumlah_kilo || "-"}</div>
        <div className="mb-2"><strong>Tarif per Kilo:</strong> {job.tarif_per_kilo ? `Rp ${job.tarif_per_kilo.toLocaleString()}` : "-"}</div>
        <div className="mb-2"><strong>Total Upah:</strong> Rp {total_upah.toLocaleString()}</div>
        <div className="mb-2"><strong>Tanggal:</strong> {job.tanggal || "-"}</div>
        <Link href={route("jobs.index")} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded shadow transition">
          Kembali
        </Link>
      </div>
    </AuthenticatedLayout>
  );
}
