"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import adminLaporanService from "../../../lib/adminLaporanService";
import axiosConfig from "../../../lib/axiosConfig";

export default function LaporanGAPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState([]);
  const [statistics, setStatistics] = useState({
    total_permintaan: 0,
    selesai: 0,
    diproses: 0,
    menunggu: 0,
    ditolak: 0,
  });
  const [divisiList, setDivisiList] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    divisi_id: "",
    status: "semua",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Fetch data divisi untuk dropdown
  useEffect(() => {
    fetchDivisi();
  }, []);

  // Fetch data laporan ketika filter berubah
  useEffect(() => {
    fetchLaporan();
    fetchStatistik();
  }, [filters, pagination.currentPage]);

  const fetchDivisi = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosConfig.get("/admin/divisi/dropdown", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDivisiList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching divisi:", error);
    }
  };

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const result = await adminLaporanService.getLaporan(
        pagination.currentPage,
        pagination.itemsPerPage,
        filters
      );
      setData(result.data || []);
      setPagination(result.pagination || pagination);
    } catch (error) {
      console.error("Error fetching laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistik = async () => {
    try {
      const result = await adminLaporanService.getStatistik(filters);
      setStatistics(result.data || statistics);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset ke halaman 1 ketika filter berubah
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      divisi_id: "",
      status: "semua",
      search: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleExportExcel = async () => {
    try {
      setExporting("excel");
      const blob = await adminLaporanService.exportExcel(filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const filename = `laporan_permintaan_${new Date().toISOString().split("T")[0]}.xlsx`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Gagal mengexport ke Excel");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting("pdf");
      const blob = await adminLaporanService.exportPDF(filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const filename = `laporan_permintaan_${new Date().toISOString().split("T")[0]}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Gagal mengexport ke PDF");
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-800";
      case "diproses":
        return "bg-yellow-100 text-yellow-800";
      case "menunggu":
        return "bg-blue-100 text-blue-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen font-poppins bg-gray-100 overflow-hidden">
      {/* Sidebar - sama seperti sebelumnya */}
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
                <Link href="/GA/dashboard_ga">
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                    Dashboard
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                {/* DATA MASTER */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
                  DATA MASTER
                </li>

                <Link href="/GA/data_permintaan">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
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

      {/* Main Wrapper */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10">
          <div className="flex-1 h-full flex items-center px-8"></div>
        </header>

        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">Laporan</h2>

          {/* Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 mb-5">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Total Permintaan</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.total_permintaan}
              </h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Permintaan Selesai</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.selesai}
              </h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Permintaan Diproses</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.diproses}
              </h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Permintaan Ditolak</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.ditolak}
              </h3>
            </div>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header Atas */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Laporan Pengadaan
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded text-sm"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="font-medium text-gray-700">Dari Tanggal:</label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange("start_date", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />

                <label className="font-medium text-gray-700">Sampai Tanggal:</label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange("end_date", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />

                <label className="font-medium text-gray-700">Divisi:</label>
                <select
                  value={filters.divisi_id}
                  onChange={(e) => handleFilterChange("divisi_id", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="">Semua Divisi</option>
                  {divisiList.map((divisi) => (
                    <option key={divisi.id} value={divisi.id}>
                      {divisi.nama_divisi}
                    </option>
                  ))}
                </select>

                <label className="font-medium text-gray-700">Status:</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="semua">Semua Status</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                <button
                  onClick={handleExportExcel}
                  disabled={exporting}
                  className={`${
                    exporting === "excel"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white font-semibold px-4 py-2 rounded flex items-center gap-2`}
                >
                  {exporting === "excel" ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Excel
                    </>
                  )}
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className={`${
                    exporting === "pdf"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white font-semibold px-4 py-2 rounded flex items-center gap-2`}
                >
                  {exporting === "pdf" ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      PDF
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tabel */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 font-semibold text-gray-700">No</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Nomor Permintaan</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Divisi</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Pemohon</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Tanggal</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Jumlah Barang</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                            Tidak ada data ditemukan
                          </td>
                        </tr>
                      ) : (
                        data.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100 transition-colors`}
                          >
                            <td className="px-6 py-3">
                              {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-3 font-medium">{item.nomor_permintaan}</td>
                            <td className="px-6 py-3">{item.nama_divisi}</td>
                            <td className="px-6 py-3">{item.nama_lengkap}</td>
                            <td className="px-6 py-3">{formatDate(item.created_at)}</td>
                            <td className="px-6 py-3 text-center">{item.jumlah_barang || 0}</td>
                            <td className="px-6 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-3 max-w-xs truncate" title={item.catatan}>
                              {item.catatan || "-"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
                  <div className="text-sm text-gray-700">
                    Menampilkan{" "}
                    {data.length > 0
                      ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1
                      : 0}{" "}
                    -{" "}
                    {Math.min(
                      pagination.currentPage * pagination.itemsPerPage,
                      pagination.totalItems
                    )}{" "}
                    dari {pagination.totalItems} data
                  </div>
                  <div className="inline-flex text-sm border rounded-md overflow-hidden">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={`px-3 py-1 ${
                        pagination.currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-100 text-gray-700"
                      } border-r`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage === 1) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage === pagination.totalPages) {
                        pageNum = pagination.totalPages - 2 + i;
                      } else {
                        pageNum = pagination.currentPage - 1 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 border-r ${
                            pagination.currentPage === pageNum
                              ? "bg-teal-600 text-white"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`px-3 py-1 ${
                        pagination.currentPage === pagination.totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}