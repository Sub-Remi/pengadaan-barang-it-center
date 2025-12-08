"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaPlus, FaPen, FaTrash, FaSync } from "react-icons/fa";
import permintaanService from "../../../lib/permintaanService";
import authService from "../../../lib/authService";
import ProtectedRoute from "../../../app/components/ProtectedRoute";

export default function DrafPermintaanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    start_date: "",
    end_date: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  useEffect(() => {
    fetchData();
  }, [filters, pagination.currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ Gunakan endpoint khusus draft
      const response = await permintaanService.getDraftPermintaan({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });
      setData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching draft data:", error);
      alert(error.error || "Gagal mengambil data draft permintaan.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset ke halaman 1 saat filter berubah
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleDeleteDraft = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus draft ini?")) {
      return;
    }

    try {
      // Panggil API delete permintaan
      await permintaanService.deletePermintaan(id);
      alert("Draft berhasil dihapus!");
      fetchData(); // Refresh data setelah hapus
    } catch (error) {
      console.error("Error deleting draft:", error);
      alert("Gagal menghapus draft.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["pemohon"]}>
      <div className="flex flex-col h-screen font-poppins bg-gray-100">
        {/* Header - Tetap fixed di atas */}
        <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
          <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
            <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
          </div>
          <div className="flex-1 h-16 flex items-center px-8">
            <button
              onClick={fetchData}
              className="ml-auto flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
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
              
              <nav className="p-2 text-x1">
                <ul className="space-y-1">
                  <Link href="/Divisi/dashboard_divisi">
                    <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                      Dashboard
                    </li>
                  </Link>

                  <hr className="border-t border-white/30 my-2" />

                  <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-x1">
                    PENGADAAN
                  </li>

                  <Link href="/Divisi/draf_permintaan">
                    <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                      Draf Permintaan
                    </li>
                  </Link>

                  <Link href="/Divisi/permintaan_divisi">
                    <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                      Permintaan
                    </li>
                  </Link>

                  <Link href="/Divisi/riwayat_divisi">
                    <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                      Riwayat
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
              <h2 className="text-2xl text-black font-semibold">Draf Permintaan</h2>
            </div>

            {/* Card container */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {/* Header atas card */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-teal-600">
                  Draf Permintaan
                </h3>
                <Link href="/Divisi/form_permintaan">
                  <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded text-x1 transition-colors">
                    <FaPlus />
                    Tambah Permintaan
                  </button>
                </Link>
              </div>

              {/* Filter section */}
              <div className="px-6 py-4 border-b bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                      name="search"
                      type="text"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full text-x1"
                      placeholder="Cari judul atau nomor"
                    />
                  </div>

                  {/* Filter Tanggal Mulai */}
                  <div>
                    <label className="block font-medium text-x1 text-gray-700 mb-1">
                      Dari Tanggal
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={filters.start_date}
                      onChange={handleFilterChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full text-x1"
                    />
                  </div>

                  {/* Filter Tanggal Selesai */}
                  <div>
                    <label className="block font-medium text-x1 text-gray-700 mb-1">
                      Sampai Tanggal
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={filters.end_date}
                      onChange={handleFilterChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full text-x1"
                    />
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
                    {data.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-500">
                        Tidak ada draf permintaan ditemukan
                      </div>
                    ) : (
                      <>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50 text-left text-x1">
                              <th className="px-4 py-3 font-semibold text-x1">No</th>
                              <th className="px-4 py-3 font-semibold ">Nomor Permintaan</th>
                              <th className="px-4 py-3 font-semibold ">Judul</th>
                              <th className="px-4 py-3 font-semibold ">Tanggal Dibuat</th>
                              <th className="px-4 py-3 font-semibold ">Jumlah Jenis Barang</th>
                              <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((row, index) => (
                              <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                              >
                                <td className="px-4 py-3 text-x1">
                                  {(pagination.currentPage - 1) *
                                    pagination.itemsPerPage +
                                    index +
                                    1}
                                </td>
                                <td className="px-4 py-3 text-x1 font-medium">
                                  {row.nomor_permintaan}
                                </td>
                                <td className="px-4 py-3 text-x1">{row.catatan}</td>
                                <td className="px-4 py-3 text-x1">
                                  {new Date(row.created_at).toLocaleDateString(
                                    "id-ID"
                                  )}
                                </td>
                                <td className="px-4 py-3 text-x1">
                                  {row.jumlah_item || 0} jenis
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex justify-center space-x-2">
                                    <Link
                                      href={`/Divisi/form_permintaan?edit=${row.id}`}
                                    >
                                      <button
                                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded text-x1"
                                        title="Edit Draft"
                                      >
                                        <FaPen size={14} />
                                      </button>
                                    </Link>
                                    <button
                                      onClick={() => handleDeleteDraft(row.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded text-x1"
                                      title="Hapus Draft"
                                    >
                                      <FaTrash size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
                          <div className="text-sm text-gray-600">
                            Menampilkan {data.length} dari {pagination.totalItems} data
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

                            {Array.from(
                              { length: Math.min(5, pagination.totalPages) },
                              (_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (pagination.currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (
                                  pagination.currentPage >=
                                  pagination.totalPages - 2
                                ) {
                                  pageNum = pagination.totalPages - 4 + i;
                                } else {
                                  pageNum = pagination.currentPage - 2 + i;
                                }

                                return (
                                  <button
                                    key={i}
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
                            )}

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
                  </>
                )}
              </div>

              {/* Garis bawah hijau */}
              <div className="h-1 bg-teal-600 w-full"></div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}