import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ transactions, auth, filters, stats, topCustomers, popularServices }) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  const { data, setData, get, processing } = useForm({
    search: filters.search || "",
    customer_name: filters.customer_name || "",
    status: filters.status || "",
    payment_status: filters.payment_status || "",
    date_start: filters.date_start || "",
    date_end: filters.date_end || "",
    estimation_start: filters.estimation_start || "",
    estimation_end: filters.estimation_end || "",
    min_amount: filters.min_amount || "",
    max_amount: filters.max_amount || "",
    is_overdue: filters.is_overdue || false,
    today: filters.today || false,
    is_express: filters.is_express || false,
    sort_by: filters.sort_by || "created_at",
    sort_order: filters.sort_order || "desc"
  });

  const handleFilter = (e) => {
    e.preventDefault();

    // Clean up empty values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        if (typeof value === 'boolean') return value;
        return value !== '' && value !== null && value !== undefined;
      })
    );

    get(route("transactions.index", cleanData), {
      preserveState: true,
      preserveScroll: true
    });
  };

  const handleQuickFilter = (filterData) => {
    const cleanedFilterData = Object.fromEntries(
      Object.entries(filterData).filter(([key, value]) => {
        if (typeof value === 'boolean') return value;
        return value !== '' && value !== null && value !== undefined;
      })
    );

    setData(cleanedFilterData);
    get(route("transactions.index", cleanedFilterData), {
      preserveState: true,
      preserveScroll: true
    });
  };

  const clearFilters = () => {
    const clearedData = {
      search: "",
      customer_name: "",
      status: "",
      payment_status: "",
      date_start: "",
      date_end: "",
      estimation_start: "",
      estimation_end: "",
      min_amount: "",
      max_amount: "",
      is_overdue: false,
      today: false,
      is_express: false,
      sort_by: "created_at",
      sort_order: "desc"
    };
    setData(clearedData);
    get(route("transactions.index"), { preserveState: true });
  };

  const handleSort = (column) => {
    const newOrder = data.sort_by === column && data.sort_order === 'asc' ? 'desc' : 'asc';
    setData({
      ...data,
      sort_by: column,
      sort_order: newOrder
    });
    get(route("transactions.index", {
      ...data,
      sort_by: column,
      sort_order: newOrder
    }), { preserveState: true });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `Rp ${parseFloat(amount || 0).toLocaleString('id-ID')}`;
  };

  const formatQuantity = (quantity) => {
    const num = parseFloat(quantity || 0);
    // Jika bilangan bulat, tampilkan tanpa desimal
    if (num % 1 === 0) {
      return num.toString();
    }
    // Jika ada desimal, tampilkan dengan maksimal 3 digit
    return num.toFixed(3).replace(/\.?0+$/, '');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'lunas': return 'text-green-600 font-medium';
      case 'belum lunas': return 'text-red-600 font-medium';
      case 'dp': return 'text-yellow-600 font-medium';
      default: return 'text-gray-600';
    }
  };

  const getSortIcon = (column) => {
    if (data.sort_by !== column) return '↕️';
    return data.sort_order === 'asc' ? '↑' : '↓';
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            📋 Daftar Transaksi
          </h2>
          <button
            onClick={() => setShowDetailedStats(!showDetailedStats)}
            className="bg-indigo-500 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
          >
            {showDetailedStats ? '📊 Hide Details' : '📈 Show Details'}
          </button>
        </div>
      }
    >
      <Head title="Transactions" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

          {/* Main Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="text-xs text-gray-600">Total Transaksi</div>
                <div className="text-xl font-bold text-blue-600">{stats.total_transactions}</div>
                <div className="text-xs text-blue-500">Semua transaksi</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div className="text-xs text-gray-600">Total Revenue</div>
                <div className="text-lg font-bold text-green-600">{formatCurrency(stats.total_revenue)}</div>
                <div className="text-xs text-green-500">Lunas: {stats.lunas_count}</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                <div className="text-xs text-gray-600">Total Gross</div>
                <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.total_gross)}</div>
                <div className="text-xs text-purple-500">Semua tagihan</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                <div className="text-xs text-gray-600">Sisa Tagihan</div>
                <div className="text-lg font-bold text-red-600">{formatCurrency(stats.total_amount_due)}</div>
                <div className="text-xs text-red-500">Belum lunas: {stats.unpaid_count}</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="text-xs text-gray-600">Hari Ini</div>
                <div className="text-lg font-bold text-yellow-600">{stats.today_transactions}</div>
                <div className="text-xs text-yellow-500">{formatCurrency(stats.today_total)}</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                <div className="text-xs text-gray-600">Bulan Ini</div>
                <div className="text-lg font-bold text-indigo-600">{stats.month_transactions}</div>
                <div className="text-xs text-indigo-500">{formatCurrency(stats.month_total)}</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                <div className="text-xs text-gray-600">Express</div>
                <div className="text-lg font-bold text-orange-600">{stats.express_count}</div>
                <div className="text-xs text-orange-500">⚡ Layanan cepat</div>
              </div>
            </div>
          )}

          {/* Detailed Statistics */}
          {showDetailedStats && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Period Stats */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-3 text-gray-800">📅 Statistik Periode</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Hari ini:</span>
                    <span className="font-medium">{stats.today_transactions} ({formatCurrency(stats.today_revenue)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu ini:</span>
                    <span className="font-medium">{stats.week_transactions} ({formatCurrency(stats.week_revenue)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bulan ini:</span>
                    <span className="font-medium">{stats.month_transactions} ({formatCurrency(stats.month_revenue)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tahun ini:</span>
                    <span className="font-medium">{stats.year_transactions} ({formatCurrency(stats.year_revenue)})</span>
                  </div>
                </div>
              </div>

              {/* Status Stats */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-3 text-gray-800">📊 Status Transaksi</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-600">⏳ Pending:</span>
                    <span className="font-medium">{stats.pending_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">🔄 Processing:</span>
                    <span className="font-medium">{stats.processing_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">✅ Completed:</span>
                    <span className="font-medium">{stats.completed_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600">🚚 Delivered:</span>
                    <span className="font-medium">{stats.delivered_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">❌ Cancelled:</span>
                    <span className="font-medium">{stats.cancelled_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">⚠️ Terlambat:</span>
                    <span className="font-medium">{stats.overdue_count}</span>
                  </div>
                </div>
              </div>

              {/* Payment Stats */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-3 text-gray-800">💰 Status Pembayaran</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">✅ Lunas:</span>
                    <span className="font-medium">{stats.lunas_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">💳 DP:</span>
                    <span className="font-medium">{stats.dp_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">❌ Belum Lunas:</span>
                    <span className="font-medium">{stats.unpaid_count}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Total Terbayar:</span>
                      <span className="font-bold text-green-600">{formatCurrency(stats.total_paid)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-3 text-gray-800">📈 Ringkasan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Gross:</span>
                    <span className="font-bold text-purple-600">{formatCurrency(stats.total_gross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-bold text-green-600">{formatCurrency(stats.total_revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sisa Tagihan:</span>
                    <span className="font-bold text-red-600">{formatCurrency(stats.total_amount_due)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Count:</span>
                    <span className="font-bold text-orange-600">{stats.express_count}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-bold text-blue-600">
                        {stats.total_transactions > 0 ?
                          Math.round((stats.completed_count + stats.delivered_count) / stats.total_transactions * 100) : 0
                        }%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Customers & Popular Services - Perbaiki field names */}
          {showDetailedStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Top Customers */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-3 text-gray-800">👑 Top Customers</h3>
                <div className="space-y-2">
                  {topCustomers?.length > 0 ? (
                    topCustomers.map((customer, index) => (
                      <div key={customer.id} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">#{index + 1} {customer.name}</span>
                          <div className="text-xs text-gray-500">{customer.total_transactions} transaksi</div>
                        </div>
                        <span className="font-bold text-green-600">
                          {formatCurrency(customer.total_amount)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">Belum ada data customer</div>
                  )}
                </div>
              </div>

              {/* Popular Services */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-3 text-gray-800">🔥 Layanan Populer</h3>
                <div className="space-y-2">
                  {popularServices?.length > 0 ? (
                    popularServices.map((service, index) => (
                      <div key={service.id} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">#{index + 1} {service.name}</span>
                          <div className="text-xs text-gray-500">{service.usage_count} kali digunakan</div>
                        </div>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(service.total_revenue)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">Belum ada data layanan</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filtered Results Summary */}
          {(data.search || data.status || data.payment_status || data.date_start || data.date_end) && stats && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2 text-blue-800">🔍 Hasil Filter Saat Ini</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Jumlah:</span>
                  <div className="font-bold">{stats.filtered_count} transaksi</div>
                </div>
                <div>
                  <span className="text-blue-600">Total:</span>
                  <div className="font-bold">{formatCurrency(stats.filtered_total)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Terbayar:</span>
                  <div className="font-bold text-green-600">{formatCurrency(stats.filtered_paid)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Revenue:</span>
                  <div className="font-bold text-green-600">{formatCurrency(stats.filtered_revenue)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Sisa:</span>
                  <div className="font-bold text-red-600">{formatCurrency(stats.filtered_pending_amount)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Filter Buttons */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-sm font-medium mb-3">🚀 Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickFilter({ ...data, today: !data.today })}
                className={`px-3 py-1 rounded text-sm ${data.today ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                📅 Hari Ini
              </button>
              <button
                onClick={() => handleQuickFilter({ ...data, is_overdue: !data.is_overdue })}
                className={`px-3 py-1 rounded text-sm ${data.is_overdue ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                ⚠️ Terlambat
              </button>
              <button
                onClick={() => handleQuickFilter({ ...data, is_express: !data.is_express })}
                className={`px-3 py-1 rounded text-sm ${data.is_express ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                ⚡ Express
              </button>
              <button
                onClick={() => handleQuickFilter({ ...data, payment_status: data.payment_status === 'belum lunas' ? '' : 'belum lunas' })}
                className={`px-3 py-1 rounded text-sm ${data.payment_status === 'belum lunas' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                💰 Belum Lunas
              </button>
              <button
                onClick={() => handleQuickFilter({ ...data, status: data.status === 'pending' ? '' : 'pending' })}
                className={`px-3 py-1 rounded text-sm ${data.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                ⏳ Pending
              </button>
              <button
                onClick={() => handleQuickFilter({ ...data, payment_status: data.payment_status === 'lunas' ? '' : 'lunas' })}
                className={`px-3 py-1 rounded text-sm ${data.payment_status === 'lunas' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                ✅ Lunas
              </button>
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
              >
                🔄 Reset Filter
              </button>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <a
                href={route("transactions.export", data)}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                📊 Export Excel
              </a>
              <a
                href={route("transactions.exportPdf", data)}
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 Export PDF
              </a>
            </div>
            <Link
              href={route("transactions.create")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              ➕ Tambah Transaksi
            </Link>
          </div>

          <div className="bg-white shadow-sm sm:rounded-lg">

            {/* Filter Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">🔍 Filter & Search</h3>
                <button
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showAdvancedFilter ? '➖ Simple' : '➕ Advanced'}
                </button>
              </div>

              <form onSubmit={handleFilter} className="space-y-4">
                {/* Basic Filter */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">🔍 Search</label>
                    <input
                      type="text"
                      placeholder="Cari invoice, nama, atau nomor HP..."
                      value={data.search}
                      onChange={(e) => setData("search", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status Transaksi</label>
                    <select
                      value={data.status}
                      onChange={(e) => setData("status", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Semua Status</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status Pembayaran</label>
                    <select
                      value={data.payment_status}
                      onChange={(e) => setData("payment_status", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Semua</option>
                      <option value="lunas">Lunas</option>
                      <option value="belum lunas">Belum Lunas</option>
                      <option value="dp">DP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Dari Tanggal</label>
                    <input
                      type="date"
                      value={data.date_start}
                      onChange={e => setData("date_start", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sampai Tanggal</label>
                    <input
                      type="date"
                      value={data.date_end}
                      onChange={e => setData("date_end", e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Advanced Filter */}
                {showAdvancedFilter && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Estimasi Mulai</label>
                        <input
                          type="date"
                          value={data.estimation_start}
                          onChange={e => setData("estimation_start", e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Estimasi Akhir</label>
                        <input
                          type="date"
                          value={data.estimation_end}
                          onChange={e => setData("estimation_end", e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Min. Amount</label>
                        <input
                          type="number"
                          value={data.min_amount}
                          onChange={e => setData("min_amount", e.target.value)}
                          placeholder="0"
                          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Max. Amount</label>
                        <input
                          type="number"
                          value={data.max_amount}
                          onChange={e => setData("max_amount", e.target.value)}
                          placeholder="999999999"
                          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Sort By</label>
                        <select
                          value={data.sort_by}
                          onChange={(e) => setData("sort_by", e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="created_at">Tanggal Dibuat</option>
                          <option value="transaction_date">Tanggal Transaksi</option>
                          <option value="estimated_completion">Estimasi Selesai</option>
                          <option value="final_total">Total Amount</option>
                          <option value="invoice_number">No. Invoice</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Order</label>
                        <select
                          value={data.sort_order}
                          onChange={(e) => setData("sort_order", e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="desc">Terbaru</option>
                          <option value="asc">Terlama</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Nama Pelanggan</label>
                        <input
                          type="text"
                          placeholder="Cari nama pelanggan..."
                          value={data.customer_name}
                          onChange={(e) => setData("customer_name", e.target.value)}
                          className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                  >
                    {processing ? '🔄 Filtering...' : '🔍 Filter'}
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    🗑️ Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('invoice_number')}
                    >
                      Invoice {getSortIcon('invoice_number')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('transaction_date')}
                    >
                      Tanggal Transaksi {getSortIcon('transaction_date')}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('estimated_completion')}
                    >
                      Estimasi Selesai {getSortIcon('estimated_completion')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Layanan
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('final_total')}
                    >
                      Total {getSortIcon('final_total')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibayar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions && transactions.data && transactions.data.length > 0 ? (
                    transactions.data.map((trx) => (
                      <tr key={trx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">
                          {trx.invoice_number}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{trx.customer?.name || '-'}</div>
                            <div className="text-gray-500 text-xs">{trx.customer?.phone_number || '-'}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(trx.transaction_date)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div>{formatDate(trx.estimated_completion)}</div>
                            {new Date(trx.estimated_completion) < new Date() && !['completed', 'delivered', 'cancelled'].includes(trx.status) && (
                              <span className="text-red-500 text-xs">⚠️ Terlambat</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="space-y-1">
                            {trx.details?.slice(0, 2).map((detail, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium">
                                  {detail.service?.name || detail.product?.name}
                                </span>
                                <span className="text-gray-500">
                                  {' '}({formatQuantity(detail.quantity)}
                                  {detail.service
                                    ? (detail.service.price_type === 'per_kg' ? 'kg' :
                                       detail.service.price_type === 'per_item' ? ' item' :
                                       ' unit')
                                    : 'pcs'})
                                </span>
                                {detail.is_express && (
                                  <span className="text-red-600 ml-1">⚡</span>
                                )}
                              </div>
                            ))}
                            {trx.details?.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{trx.details.length - 2} lainnya
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-bold">{formatCurrency(trx.final_total)}</div>
                            {trx.discount_value > 0 && (
                              <div className="text-xs text-gray-500">
                                Diskon: {trx.discount_type === "amount"
                                  ? formatCurrency(trx.discount_value)
                                  : `${trx.discount_value}%`
                                }
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div>
                            <div className="font-medium">{formatCurrency(trx.paid_amount)}</div>
                            {trx.paid_amount < trx.final_total && (
                              <div className="text-xs text-red-500">
                                Sisa: {formatCurrency(trx.final_total - trx.paid_amount)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trx.status)}`}>
                            {trx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={getPaymentStatusColor(trx.payment_status)}>
                            {trx.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Link
                              href={route("transactions.show", trx.id)}
                              className="text-blue-600 hover:text-blue-800 text-xs bg-blue-100 px-2 py-1 rounded"
                            >
                              👁️ Detail
                            </Link>
                            <Link
                              href={route("transactions.edit", trx.id)}
                              className="text-green-600 hover:text-green-800 text-xs bg-green-100 px-2 py-1 rounded"
                            >
                              ✏️ Edit
                            </Link>
                            <a
                              href={route("transactions.print", trx.id)}
                              className="text-purple-600 hover:text-purple-800 text-xs bg-purple-100 px-2 py-1 rounded"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              🖨️ Print
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="text-6xl mb-4">📭</div>
                          <p className="text-lg font-medium">Tidak ada transaksi ditemukan</p>
                          <p className="text-sm">Coba ubah filter atau buat transaksi baru</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {transactions.links && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    {transactions.prev_page_url && (
                      <Link
                        href={transactions.prev_page_url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    )}
                    {transactions.next_page_url && (
                      <Link
                        href={transactions.next_page_url}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{transactions.from}</span> to{' '}
                        <span className="font-medium">{transactions.to}</span> of{' '}
                        <span className="font-medium">{transactions.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {transactions.links.map((link, index) => (
                          <Link
                            key={index}
                            href={link.url || '#'}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              link.active
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
