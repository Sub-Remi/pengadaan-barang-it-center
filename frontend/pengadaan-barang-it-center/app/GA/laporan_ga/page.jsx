"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import adminLaporanService from "../../../lib/adminLaporanService";
import adminPermintaanService from "../../../lib/adminPermintaanService";
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
    itemsPerPage: 5,
  });

  // Fetch data divisi untuk dropdown
  useEffect(() => {
    fetchDivisi();
  }, []);

  // Fetch data laporan ketika filter berubah
  useEffect(() => {
    fetchLaporan();
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
      
      // Handle filter status "semua" - kirim string kosong
      const processedFilters = { ...filters };
      if (processedFilters.status === "semua") {
        processedFilters.status = ""; // Kosongkan status untuk mengambil semua
      }
      
      // Gunakan service yang sama dengan halaman data_permintaan
      const result = await adminPermintaanService.getAllPermintaan(
        pagination.currentPage,
        pagination.itemsPerPage,
        processedFilters
      );
      
      setData(result.data || []);
      setPagination(result.pagination || pagination);
      
      // Hitung statistik manual dari data yang didapat
      calculateStatistics(result.data || []);
    } catch (error) {
      console.error("Error fetching laporan:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (data) => {
    const stats = {
      total_permintaan: data.length,
      selesai: 0,
      diproses: 0,
      menunggu: 0,
      ditolak: 0,
    };

    data.forEach(item => {
      switch (item.status) {
        case 'selesai':
          stats.selesai++;
          break;
        case 'diproses':
          stats.diproses++;
          break;
        case 'menunggu':
          stats.menunggu++;
          break;
        case 'ditolak':
          stats.ditolak++;
          break;
      }
    });

    setStatistics(stats);
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
      
      // Handle filter status "semua"
      const processedFilters = { ...filters };
      if (processedFilters.status === "semua") {
        processedFilters.status = "";
      }
      
      const token = localStorage.getItem("token");
      
      // Gunakan endpoint yang benar
      const response = await fetch(
        `http://localhost:3200/api/admin/permintaan/export/excel?${new URLSearchParams(processedFilters)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      
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
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
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
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                    Laporan
                  </li>
                </Link>

                <Link href="/GA/riwayat_ga">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Riwayat
                  </li>
                </Link>

                {/* <hr className="border-t border-white/30 my-2" /> */}

                {/* PEMESANAN */}
                {/* <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
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
                </Link> */}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content - Scrollable dengan padding yang lebih baik */}
        <main className="flex-1 text-black p-6 bg-gray-200 overflow-y-auto ml-60">
          {/* Fixed header untuk judul halaman */}
          <div className="bg-gray-200 mb-6">
            <h2 className="text-3xl text-black font-semibold">Laporan</h2>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Total Permintaan</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.total_permintaan}
              </h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Permintaan Selesai</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.selesai}
              </h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Permintaan Diproses</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.diproses}
              </h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Permintaan Ditolak</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">
                {statistics.ditolak}
              </h3>
            </div>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header atas card */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Laporan Pengadaan
              </h3>
              <button
                onClick={handleResetFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded text-x1 transition-colors"
              >
                Reset Filter
              </button>
            </div>

            {/* Filter section */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                {/* Filter Tanggal Mulai */}
                <div>
                  <label className="block font-medium text-x1 text-gray-700 mb-1">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange("start_date", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
                  />
                </div>

                {/* Filter Tanggal Selesai */}
                <div>
                  <label className="block font-medium text-x1 text-gray-700 mb-1">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange("end_date", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-xs"
                  />
                </div>

                {/* Filter Divisi */}
                <div>
                  <label className="block font-medium text-x1 text-gray-700 mb-1">
                    Divisi
                  </label>
                  <select
                    value={filters.divisi_id}
                    onChange={(e) => handleFilterChange("divisi_id", e.target.value)}
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

                {/* Filter Status */}
                <div>
                  <label className="block font-medium text-x1 text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  >
                    <option value="semua">Semua Status</option>
                    <option value="menunggu">Menunggu</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleExportExcel}
                  disabled={exporting}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    exporting === "excel"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {exporting === "excel" ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
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
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    exporting === "pdf"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {exporting === "pdf" ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
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
                        <th className="px-4 py-3 font-semibold text-x1">Nomor Permintaan</th>
                        <th className="px-4 py-3 font-semibold text-x1">Divisi</th>
                        <th className="px-4 py-3 font-semibold text-x1">Pemohon</th>
                        <th className="px-4 py-3 font-semibold text-x1">Tanggal</th>
                        <th className="px-4 py-3 font-semibold text-x1">Jumlah Barang</th>
                        <th className="px-4 py-3 font-semibold text-x1">Status</th>
                        <th className="px-4 py-3 font-semibold text-x1">Catatan</th>
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
                            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                          >
                            <td className="px-4 py-3 text-sm">
                              {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                            </td>
                            <td className="px-4 py-3 text-x1 font-medium">{item.nomor_permintaan}</td>
                            <td className="px-4 py-3 text-x1">{item.nama_divisi}</td>
                            <td className="px-4 py-3 text-x1">{item.nama_lengkap}</td>
                            <td className="px-4 py-3 text-x1">{formatDate(item.created_at)}</td>
                            <td className="px-4 py-3 text-x1 text-center">{item.jumlah_barang || 0}</td>
                            <td className="px-4 py-3 text-x1">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm max-w-xs truncate" title={item.catatan}>
                              {item.catatan || "-"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
                    <div className="text-sm text-gray-600">
                      Menampilkan {data.length} dari {pagination.totalItems} data
                    </div>
                    <div className="inline-flex text-sm border rounded-md overflow-hidden">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`px-3 py-1 border-r text-sm ${
                          pagination.currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                        }`}
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
                            className={`px-3 py-1 border-r text-sm ${
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