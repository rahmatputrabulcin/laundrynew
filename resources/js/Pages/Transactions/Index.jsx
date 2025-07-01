import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Index({ transactions, auth, filters }) {
  const { data, setData, get } = useForm({
    status: filters.status || "",
   customer_name: filters.customer_name || "",
  date_start: filters.date_start || "",
  date_end: filters.date_end || "",
  });

  const handleFilter = (e) => {
    e.preventDefault();
    get(route("transactions.index"), { preserveState: true });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Transactions
        </h2>
      }
    >
      <Head title="Transactions" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-end mb-4">
            <Link
              href={route("transactions.create")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Transaction
            </Link>
          </div>
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleFilter} className="flex gap-2 mb-4">
              <select
                value={data.status}
                onChange={(e) => setData("status", e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="proses">Proses</option>
                <option value="selesai">Selesai</option>
                <option value="ambil">Diambil</option>
                <option value="antar">Antar</option>
              </select>
              <input
                type="text"
                placeholder="Nama Pelanggan"
                value={data.customer_name}
                onChange={(e) => setData("customer_name", e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
    type="date"
    value={data.date_start}
    onChange={e => setData("date_start", e.target.value)}
    className="border rounded px-2 py-1"
  />
  <input
    type="date"
    value={data.date_end}
    onChange={e => setData("date_end", e.target.value)}
    className="border rounded px-2 py-1"
  />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Filter
              </button>
            </form>
<a
  href={route("transactions.export", data)}
  className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
  target="_blank"
  rel="noopener noreferrer"
>
  Export Excel
</a>

<a
  href={route("transactions.exportPdf", data)}
  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
  target="_blank"
  rel="noopener noreferrer"
>
  Export PDF
</a>

            <table className="min-w-full">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Diskon</th>
                  <th>Final Total</th>
                  <th>Status Pembayaran</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
             <tbody>
  {transactions && transactions.data && transactions.data.length > 0 ? (
    transactions.data.map((trx) => (
      <tr key={trx.id}>
        <td>{trx.invoice_number}</td>
        <td>{trx.customer?.name}</td>
        <td>Rp {parseFloat(trx.total_amount).toLocaleString()}</td>
        <td>
          {trx.discount_type === "amount"
            ? `Rp ${parseFloat(trx.discount_value).toLocaleString()}`
            : trx.discount_type === "percent"
            ? `${trx.discount_value}%`
            : "-"}
        </td>
        <td>Rp {parseFloat(trx.final_total).toLocaleString()}</td>
        <td>
          <span
            className={
              trx.payment_status === "lunas"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {trx.payment_status}
          </span>
        </td>
        <td>{trx.status}</td>
        <td>
          {new Date(trx.created_at).toLocaleDateString("en-CA")}
        </td>
        <td>
          <Link
            href={route("transactions.show", trx.id)}
            className="text-blue-600 hover:underline"
          >
            View
          </Link>
          <a
        href={route("transactions.printPdf", trx.id)}
        className="ml-2 bg-indigo-500 hover:bg-indigo-700 text-white px-2 py-1 rounded"
        target="_blank"
        rel="noopener noreferrer"
      >
        Cetak Struk PDF
      </a>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="9" className="text-center py-4">
        No transactions found.
      </td>
    </tr>
  )}
</tbody>
            </table>
             {transactions.links && (
              <div className="mt-4 flex gap-2">
                {transactions.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url || "#"}
                    className={`px-3 py-1 rounded ${link.active ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
