"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaFileAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import adminPermintaanService from "../../../lib/adminPermintaanService";

export default function DataPermintaanPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [divisiFilter, setDivisiFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("terbaru"); // State baru untuk urutan
  const [divisiList, setDivisiList] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  // Fetch data divisi untuk filter
  const fetchDivisi = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3200/api/admin/divisi/dropdown",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setDivisiList(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching divisi:", error);
    }
  };

  // Tambahkan fungsi untuk mengubah status
  const handleUpdateStatus = async (id) => {
    const newStatus = prompt(
      "Masukkan status baru (menunggu/diproses/selesai/ditolak):"
    );
    if (
      !newStatus ||
      !["menunggu", "diproses", "selesai", "ditolak"].includes(newStatus)
    ) {
      alert("Status tidak valid!");
      return;
    }

    try {
      await adminPermintaanService.updatePermintaanStatus(id, newStatus);
      alert("Status berhasil diubah!");
      fetchPermintaan(pagination.currentPage, {
        search,
        status: statusFilter,
        divisi_id: divisiFilter,
        start_date: startDate,
        end_date: endDate,
      });
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.error || "Terjadi kesalahan saat mengubah status"
      );
    }
  };

  // Fetch data permintaan
  const fetchPermintaan = async (page = 1, filters = {}) => {
    try {
      setLoading(true);

      const result = await adminPermintaanService.getAllPermintaan(
        page,
        pagination.itemsPerPage,
        filters,
        sortOrder // Kirim parameter sortOrder ke service
      );

      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.error || "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchPermintaan(1, {
        search: value,
        status: statusFilter,
        divisi_id: divisiFilter,
        start_date: startDate,
        end_date: endDate,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle filter
  const handleFilter = () => {
    fetchPermintaan(1, {
      search,
      status: statusFilter,
      divisi_id: divisiFilter,
      start_date: startDate,
      end_date: endDate,
    });
  };

  // Reset filter
  const handleResetFilter = () => {
    setSearch("");
    setDivisiFilter("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setSortOrder("terbaru"); // Reset ke default
    fetchPermintaan(1, {});
  };

  // Handle sort order change
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    // Fetch ulang dengan sortOrder baru
    fetchPermintaan(1, {
      search,
      status: statusFilter,
      divisi_id: divisiFilter,
      start_date: startDate,
      end_date: endDate,
    });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPermintaan(page, {
      search,
      status: statusFilter,
      divisi_id: divisiFilter,
      start_date: startDate,
      end_date: endDate,
    });
  };

  // Handle export Excel
  const handleExportExcel = () => {
    alert("Fitur export Excel belum tersedia");
  };

  // Handle export PDF
  const handleExportPDF = () => {
    alert("Fitur export PDF belum tersedia");
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "menunggu":
        return "Menunggu";
      case "diproses":
        return "Diproses";
      case "selesai":
        return "Selesai";
      case "ditolak":
        return "Ditolak";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchPermintaan();
    fetchDivisi();
  }, []);

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-gray-200">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8">
          {/* Kosong untuk saat ini, bisa diisi dengan user profile dll */}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar - Fixed dengan tinggi yang tepat dan scrollable */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col fixed left-0 top-16 bottom-0">
          {/* Container scrollable untuk menu */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <style jsx>{`
              /* Custom scrollbar untuk semua browser */
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #3b82f6 #1e3a8a;
              }

              /* Untuk WebKit browsers (Chrome, Safari, Edge) */
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }

              .custom-scrollbar::-webkit-scrollbar-track {
                background: #1e3a8a; /* blue-900 */
                border-radius: 4px;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #3b82f6; /* blue-500 */
                border-radius: 4px;
                border: 2px solid #1e3a8a;
              }

              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #60a5fa; /* blue-400 */
              }
            `}</style>

            <nav className="p-2">
              <ul className="space-y-1">
                <Link href="/GA/dashboard_ga">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Dashboard
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                {/* DATA MASTER */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
                  DATA MASTER
                </li>

                <Link href="/GA/data_permintaan">
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                    Permintaan
                  </li>
                </Link>

                <Link href="/GA/data_barang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Barang
                  </li>
                </Link>

                <Link href="/GA/data_kategoribarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Kategori Barang
                  </li>
                </Link>

                <Link href="/GA/data_satuanbarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Satuan Barang
                  </li>
                </Link>

                <Link href="/GA/data_stokbarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Stok Barang
                  </li>
                </Link>

                <Link href="/GA/data_divisi">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Divisi
                  </li>
                </Link>

                <Link href="/GA/manajemen_user">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Manajemen User
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                {/* MONITORING */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
                  MONITORING
                </li>

                <Link href="/GA/laporan_ga">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Laporan
                  </li>
                </Link>

                <Link href="/GA/riwayat_ga">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Riwayat
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                {/* PEMESANAN */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
                  PEMESANAN
                </li>

                <Link href="/GA/list_pemesanan">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    List Pemesanan
                  </li>
                </Link>

                <Link href="/GA/form_penerimaanbarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Form Penerimaan
                  </li>
                </Link>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content - Scrollable dengan padding yang lebih baik */}
        <main className="flex-1 text-black p-6 bg-gray-200 overflow-y-auto ml-60">
          {/* Fixed header untuk judul halaman */}
          <div className="bg-gray-200 mb-6">
            <h2 className="text-3xl text-black font-semibold">Permintaan</h2>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header atas card */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Data Permintaan
              </h3>
            </div>

            {/* Filter section */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {/* Search */}
                <div>
                  <label
                    htmlFor="search"
                    className="block font-medium text-x1 mb-1"
                  >
                    Search
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Cari ID PB atau nama..."
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  />
                </div>

                {/* Filter Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block font-medium text-x1 text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  >
                    <option value="">Semua Status</option>
                    <option value="menunggu">Menunggu</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>

                {/* Filter Divisi */}
                <div>
                  <label
                    htmlFor="divisi"
                    className="block font-medium text-x1 text-gray-700 mb-1"
                  >
                    Divisi
                  </label>
                  <select
                    id="divisi"
                    value={divisiFilter}
                    onChange={(e) => setDivisiFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  >
                    <option value="">Semua Divisi</option>
                    {divisiList.map((divisi) => (
                      <option key={divisi.id} value={divisi.id}>
                        {divisi.nama_divisi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sort"
                    className="block font-medium text-x1 text-gray-700 mb-1"
                  >
                    Urutkan
                  </label>
                  <select
                    id="sort"
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  >
                    <option value="terbaru">Terlama</option>
                    <option value="terlama">Terbaru</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block font-medium text-x1 text-gray-700 mb-1">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-x1 text-gray-700 mb-1">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-start-3">
                  <div className="flex gap-2 items-end">
                    <button
                      onClick={handleFilter}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded w-full text-sm"
                    >
                      Terapkan Filter
                    </button>
                    <button
                      onClick={handleResetFilter}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded w-full text-sm"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel - Container dengan overflow untuk tabel panjang */}
            <div className="overflow-x-auto">
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
                        <th className="px-4 py-3 font-semibold text-x1">No</th>
                        <th className="px-4 py-3 font-semibold text-x1">
                          ID PB
                        </th>
                        <th className="px-4 py-3 font-semibold text-x1">
                          Divisi
                        </th>
                        <th className="px-4 py-3 font-semibold text-x1">
                          Nama Pemohon
                        </th>
                        <th className="px-4 py-3 font-semibold text-x1">
                          Jumlah Barang
                        </th>
                        <th className="px-4 py-3 font-semibold text-x1">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 font-semibold text-x1">
                          Status
                        </th>
                        <th className="px-4 py-3 font-semibold text-x1 text-center">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr
                          key={row.id}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="px-4 py-3 text-x1">
                            {(pagination.currentPage - 1) *
                              pagination.itemsPerPage +
                              index +
                              1}
                          </td>
                          <td className="px-4 py-3 text-x1 font-medium">
                            {row.nomor_permintaan || `PB-${row.id}`}
                          </td>
                          <td className="px-4 py-3 text-x1">
                            {row.nama_divisi || "-"}
                          </td>
                          <td className="px-4 py-3 text-x1">
                            {row.nama_lengkap || "-"}
                          </td>
                          <td className="px-4 py-3 text-x1">
                            {row.jumlah_barang > 0
                              ? `${row.jumlah_barang} jenis barang`
                              : "0"}
                          </td>
                          <td className="px-4 py-3 text-x1">
                            {formatDate(row.created_at)}
                          </td>
                          <td className="px-4 py-3 text-x1">
                            <span
                              className={`px-2 py-1 rounded text-x1 font-medium ${getStatusColor(
                                row.status
                              )}`}
                            >
                              {getStatusText(row.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <Link href={`/GA/detail_permintaan?id=${row.id}`}>
                                <button
                                  className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded text-sm"
                                  title="Lihat Detail"
                                >
                                  <FaEye size={14} />
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {data.length === 0 && (
                        <tr>
                          <td
                            colSpan="8"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            Tidak ada data permintaan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
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
                        className={`px-3 py-1 border-r text-sm ${
                          pagination.currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        Previous
                      </button>

                      {[...Array(pagination.totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show only current page, first, last, and neighbors
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
                              className={`px-3 py-1 border-r text-sm ${
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
                        className={`px-3 py-1 text-sm ${
                          pagination.currentPage === pagination.totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
