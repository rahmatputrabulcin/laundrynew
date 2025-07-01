import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "proses", label: "Proses" },
  { value: "selesai", label: "Selesai" },
  { value: "ambil", label: "Diambil" },
  { value: "antar", label: "Antar" },
];

export default function Show({ transaction, auth ,statusLogs }) {
  const { data, setData, patch, processing } = useForm({
    status: transaction.status,
  });

  const handleStatusChange = (e) => {
    setData("status", e.target.value);
    patch(route("transactions.updateStatus", transaction.id), {
      preserveScroll: true,
      preserveState: false,
    });
  };
  if (!transaction || typeof transaction !== "object") {
    return (
      <div className="text-center mt-10 text-red-600">
        Data transaksi tidak ditemukan.
      </div>
    );
  }

  // Pastikan semua data ada
  const details = Array.isArray(transaction.details) ? transaction.details : [];
  const totalAmount = parseFloat(transaction.total_amount || 0);
  const discountValue = parseFloat(transaction.discount_value || 0);
  const finalTotal = parseFloat(transaction.final_total || totalAmount);
  const paidAmount = parseFloat(transaction.paid_amount || 0);
  const remaining = finalTotal - paidAmount;

  const phone = transaction.customer?.phone_number
    ? transaction.customer.phone_number.replace(/^0/, "62")
    : "";
  const message = encodeURIComponent(
    `Halo ${transaction.customer?.name || ""}, laundry Anda dengan invoice ${
      transaction.invoice_number
    } sudah ${
      data.status === "selesai" ? "SELESAI" : data.status.toUpperCase()
    }. Terima kasih!`
  );
  const waUrl = phone ? `https://wa.me/${phone}?text=${message}` : null;

  return (
    <AuthenticatedLayout
      user={auth?.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Transaction Detail
        </h2>
      }
    >
      <Head title="Transaction Detail" />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-8">
        <div className="flex gap-2 mb-4">
          <Link
            href={route("transactions.index")}
            className="bg-gray-500 hover:bg-gray-700 text-white px-3 py-1 rounded"
          >
            Back to List
          </Link>
          <Link
            href={route("transactions.edit", transaction.id)}
            className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded"
          >
            Edit
          </Link>
          <Link
            href={route("transactions.print", transaction.id)}
            className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded"
            target="_blank"
          >
            Print
          </Link>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Kirim WhatsApp
            </a>
          )}
        </div>
        <div className="mb-4">
          <form>
            <label className="block font-semibold mb-1">Status Laundry</label>
            <select
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
              className="border rounded px-2 py-1"
              disabled={processing}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="inline-block w-6" />
            <button
              type="button"
              onClick={() =>
                patch(route("transactions.updateStatus", transaction.id), {
                  preserveScroll: true,
                  preserveState: false,
                })
              }
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
              disabled={processing}
            >
              Update Status
            </button>
          </form>
        </div>
        <div className="mb-4">
          <strong>Invoice:</strong> {transaction.invoice_number || "-"}
        </div>
        <div className="mb-4">
          <strong>Customer:</strong> {transaction.customer?.name || "-"}
        </div>
        <div className="mb-4">
          <strong>Status:</strong> {transaction.status || "-"}
        </div>
        <div className="mb-4">
          <strong>Total:</strong> Rp {totalAmount.toLocaleString()}
        </div>
        <div className="mb-4">
          <strong>Discount:</strong>{" "}
          {transaction.discount_type === "amount"
            ? `Rp ${discountValue.toLocaleString()}`
            : transaction.discount_type === "percent"
            ? `${discountValue}%`
            : "-"}
        </div>
        <div className="mb-4">
          <strong>Final Total:</strong> Rp {finalTotal.toLocaleString()}
        </div>
        <div className="mb-4">
          <strong>Paid:</strong> Rp {paidAmount.toLocaleString()}
        </div>
        <div className="mb-4">
          <strong>Status Pembayaran:</strong>{" "}
          <span
            className={
              transaction.payment_status === "lunas"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {transaction.payment_status || "-"}
          </span>
        </div>
        <div className="mb-4">
          <strong>Remaining:</strong> Rp {remaining.toLocaleString()}
        </div>
        <div className="mb-4">
          <strong>Estimated Completion:</strong>{" "}
          {transaction.estimated_completion
            ? new Date(transaction.estimated_completion).toLocaleDateString(
                "en-CA"
              )
            : "-"}
        </div>
        <div className="mb-4">
          <strong>Notes:</strong> {transaction.notes || "-"}
        </div>
        <div className="mb-4">
          <strong>Details:</strong>
          <table className="min-w-full mt-2 border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Service</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Subtotal</th>
                <th className="border px-2 py-1">Express</th>
                <th className="border px-2 py-1">Notes</th>
              </tr>
            </thead>
            <tbody>
              {details.length > 0 ? (
                details.map((detail) => (
                  <tr key={detail.id}>
                    <td className="border px-2 py-1">
                      {detail.service?.name || "-"}
                    </td>
                    <td className="border px-2 py-1">{detail.quantity}</td>
                    <td className="border px-2 py-1">
                      Rp {parseFloat(detail.price || 0).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      Rp {parseFloat(detail.subtotal || 0).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      {detail.is_express ? "Yes" : "No"}
                    </td>
                    <td className="border px-2 py-1">{detail.notes || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-2">
                    No details.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {statusLogs && statusLogs.length > 0 && (
          <div className="mb-4">
            <strong>Riwayat Status:</strong>
            <ul className="mt-2 text-sm">
              {statusLogs.map((log) => (
                <li key={log.id}>
                  {log.created_at} — <b>{log.old_status}</b> →{" "}
                  <b>{log.new_status}</b>
                  {log.user && (
                    <>
                      {" "}
                      oleh{" "}
                      <span className="text-blue-600">{log.user.name}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
