"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

export default function DataPemesananPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    jenis_dokumen: "",
    start_date: "",
    end_date: "",
    search: "",
    status: "",
  });

  // Fetch data pemesanan untuk validator
  const fetchPemesananForValidator = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", pagination.itemsPerPage);

      if (filters.jenis_dokumen)
        params.append("jenis_dokumen", filters.jenis_dokumen);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);
      if (filters.status) params.append("status", filters.status); // Tambahkan status

      const response = await fetch(
        `http://localhost:3200/api/validator/pemesanan?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404 || response.status === 500) {
        console.log(
          "⚠️ API endpoint validator belum tersedia, menggunakan data dummy"
        );
        // Fallback ke data dummy jika API belum ready
        const dummyData = [
          {
            id: 1,
            nomor_permintaan: "PB-10111",
            tanggal: "2025-01-01",
            nama_barang: "Laptop",
            status: "Menunggu Validasi",
            dokumen_jenis: "PO",
          },
          {
            id: 2,
            nomor_permintaan: "PB-10777",
            tanggal: "2025-06-02",
            nama_barang: "Printer",
            status: "Pending",
            dokumen_jenis: "Invoice",
          },
          {
            id: 3,
            nomor_permintaan: "PB-10112",
            tanggal: "2025-01-03",
            nama_barang: "Monitor",
            status: "Validated",
            dokumen_jenis: "PO",
          },
          {
            id: 4,
            nomor_permintaan: "PB-10778",
            tanggal: "2025-01-05",
            nama_barang: "Keyboard",
            status: "Menunggu Validasi",
            dokumen_jenis: "Quotation",
          },
        ];
        setData(dummyData);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: dummyData.length,
          itemsPerPage: 10,
        });
        return;
      }

      const result = await response.json();

      if (response.ok) {
        setData(result.data || []);
        setPagination(
          result.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: result.data?.length || 0,
            itemsPerPage: 10,
          }
        );
      } else {
        console.error("Error:", result.error);
        setData([]);
      }
    } catch (error) {
      console.error("Network error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Inisialisasi
  useEffect(() => {
    fetchPemesananForValidator(1, {});
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle filter submit
  const handleFilterSubmit = () => {
    fetchPemesananForValidator(1, filters);
  };

  // Handle reset filter
  const handleResetFilter = () => {
    const resetFilters = {
      jenis_dokumen: "",
      start_date: "",
      end_date: "",
      search: "",
    };
    setFilters(resetFilters);
    fetchPemesananForValidator(1, resetFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPemesananForValidator(page, filters);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    const statusLower = status.toLowerCase();

    if (statusLower.includes("menunggu") || statusLower.includes("pending")) {
      return "bg-yellow-100 text-yellow-800";
    } else if (statusLower.includes("diproses")) {
      return "bg-blue-100 text-blue-800";
    } else if (
      statusLower.includes("selesai") ||
      statusLower.includes("valid")
    ) {
      return "bg-green-100 text-green-800";
    } else if (
      statusLower.includes("tolak") ||
      statusLower.includes("reject")
    ) {
      return "bg-red-100 text-red-800";
    } else if (statusLower.includes("dalam pemesanan")) {
      return "bg-purple-100 text-purple-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      {/* Header */}
      <header className="flex bg-white shadow-sm items-center">
        <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-20 flex items-center px-8"></div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1">
          <nav className="flex-1 mt-6">
            <ul className="space-y-1">
              <Link href="/finance/dashboard_finance">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-gray-200">
                PEMESANAN
              </li>

              <Link href="/finance/data_pemesanan">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Data Pemesanan
                </li>
              </Link>

              <Link href="/finance/riwayat_finance">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Riwayat
                </li>
              </Link>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="text-black flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Data Pemesanan
              </h3>
            </div>

            {/* FILTER - DIUBAH SESUAI GAYA */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {/* Filter Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    <option value="">Semua Status</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
                {/* Search */}
                <div>
                  <label
                    htmlFor="search"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Search
                  </label>
                  <input
                    id="search"
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Cari ID PB atau nama..."
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>

                {/* Filter Jenis Dokumen */}
                <div>
                  <label
                    htmlFor="jenis_dokumen"
                    className="block font-medium text-gray-700 mb-1"
                  >
                    Jenis Dokumen
                  </label>
                  <select
                    id="jenis_dokumen"
                    name="jenis_dokumen"
                    value={filters.jenis_dokumen}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  >
                    <option value="">Semua</option>
                    <option value="PO">Purchase Order (PO)</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Quotation">Quotation</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Filter Start Date */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>

                {/* Filter End Date */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>

                {/* Empty column for alignment */}
                <div></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-start-3">
                  <div className="flex gap-2 items-end">
                    <button
                      onClick={handleFilterSubmit}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded w-full"
                    >
                      Terapkan Filter
                    </button>
                    <button
                      onClick={handleResetFilter}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded w-full"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="px-6 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 font-semibold">No</th>
                      <th className="px-6 py-3 font-semibold">ID PB</th>
                      <th className="px-6 py-3 font-semibold">Tanggal</th>
                      <th className="px-6 py-3 font-semibold">Nama Barang</th>
                      <th className="px-6 py-3 font-semibold">Jenis Dokumen</th>
                      <th className="px-6 py-3 font-semibold">
                        Status Pemesanan
                      </th>
                      <th className="px-6 py-3 font-semibold text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-3">
                          {(pagination.currentPage - 1) *
                            pagination.itemsPerPage +
                            index +
                            1}
                        </td>
                        <td className="px-6 py-3 font-medium">
                          {row.nomor_permintaan || `PB-${row.id || index}`}
                        </td>
                        <td className="px-6 py-3">
                          {formatDate(
                            row.tanggal ||
                              row.created_at ||
                              row.dokumen_created_at
                          )}
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {row.nama_barang || row.barang || "-"}
                        </td>
                        <td className="px-6 py-3">
                          {row.jenis_dokumen || row.dokumen_jenis || "-"}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                              row.status || row.is_valid
                            )}`}
                          >
                            {row.status ||
                              (row.is_valid === true
                                ? "Validated"
                                : row.is_valid === false
                                ? "Ditolak"
                                : "Menunggu Validasi")}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <Link
                            href={`/finance/dokumen_pemesanan?id=${
                              row.id || row.dokumen_id || index
                            }`}
                          >
                            <button
                              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded"
                              title="Lihat Detail"
                            >
                              <FaEye />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {data.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          Tidak ada data pemesanan untuk divalidasi
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
                    <div className="text-sm text-gray-600">
                      Menampilkan {data.length} dari {pagination.totalItems}{" "}
                      data
                    </div>
                    <div className="inline-flex text-sm border rounded-md overflow-hidden">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1}
                        className={`px-3 py-1 border-r ${
                          pagination.currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        Previous
                      </button>

                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === pagination.totalPages ||
                          (pageNum >= pagination.currentPage - 1 &&
                            pageNum <= pagination.currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 border-r ${
                                pageNum === pagination.currentPage
                                  ? "bg-teal-600 text-white"
                                  : "bg-white hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}

                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                        className={`px-3 py-1 ${
                          pagination.currentPage === pagination.totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Garis bawah */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
