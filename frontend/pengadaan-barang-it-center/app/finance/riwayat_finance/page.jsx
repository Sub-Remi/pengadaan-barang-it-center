"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye, FaDownload, FaFilter, FaRedo } from "react-icons/fa";

export default function ListPemesananPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    search: "",
  });

  // Format date untuk display
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
    const statusLower = status.toLowerCase();
    
    if (statusLower === "selesai") {
      return "bg-green-100 text-green-800";
    } else if (statusLower === "ditolak") {
      return "bg-red-100 text-red-800";
    } else if (statusLower === "diproses") {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  // Format status untuk display
  const formatStatus = (status) => {
    if (!status) return "-";
    
    const statusLower = status.toLowerCase();
    if (statusLower === "selesai") {
      return "Selesai";
    } else if (statusLower === "ditolak") {
      return "Ditolak";
    } else if (statusLower === "diproses") {
      return "Diproses";
    }
    return status;
  };

  // Fetch riwayat pemesanan
  const fetchRiwayatPemesanan = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", pagination.itemsPerPage);
      params.append("status", "selesai,ditolak"); // Hanya ambil yang selesai atau ditolak

      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(
        `http://localhost:3200/api/validator/pemesanan?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404 || response.status === 500) {
        console.log("⚠️ API endpoint belum tersedia, menggunakan data dummy");
        
        // Data dummy untuk pengembangan
        const dummyData = [
          { 
            id: 1, 
            nomor_permintaan: "REQ-10111", 
            tanggal_pemesanan: "2025-01-01", 
            nama_barang: "Laptop", 
            status: "selesai" 
          },
          { 
            id: 2, 
            nomor_permintaan: "REQ-10777", 
            tanggal_pemesanan: "2025-06-02", 
            nama_barang: "Printer", 
            status: "ditolak" 
          },
          { 
            id: 3, 
            nomor_permintaan: "REQ-10112", 
            tanggal_pemesanan: "2025-01-03", 
            nama_barang: "Monitor", 
            status: "selesai" 
          },
          { 
            id: 4, 
            nomor_permintaan: "REQ-10778", 
            tanggal_pemesanan: "2025-01-05", 
            nama_barang: "Keyboard", 
            status: "selesai" 
          },
        ];

        // Filter data dummy berdasarkan tanggal jika ada
        let filteredData = dummyData;
        if (filters.start_date || filters.end_date) {
          filteredData = dummyData.filter(item => {
            const itemDate = new Date(item.tanggal_pemesanan);
            const startDate = filters.start_date ? new Date(filters.start_date) : null;
            const endDate = filters.end_date ? new Date(filters.end_date) : null;
            
            if (startDate && itemDate < startDate) return false;
            if (endDate && itemDate > endDate) return false;
            return true;
          });
        }

        // Filter berdasarkan search
        if (filters.search) {
          filteredData = filteredData.filter(item => 
            item.nomor_permintaan.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.nama_barang.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setData(filteredData);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: filteredData.length,
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
      setIsFiltering(false);
    }
  };

  // Inisialisasi
  useEffect(() => {
    fetchRiwayatPemesanan(1, {});
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle filter submit
  const handleFilterSubmit = async () => {
    setIsFiltering(true);
    await fetchRiwayatPemesanan(1, filters);
  };

  // Handle reset filter
  const handleResetFilter = () => {
    const resetFilters = {
      start_date: "",
      end_date: "",
      search: "",
    };
    setFilters(resetFilters);
    fetchRiwayatPemesanan(1, resetFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchRiwayatPemesanan(page, filters);
  };

  // Generate laporan PDF (placeholder)
  const handleGenerateReport = () => {
    alert("Fitur generate laporan PDF akan segera tersedia!");
    // Implementasi generate PDF bisa ditambahkan di sini
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      {/* Header */}
      <header className="flex bg-white shadow-sm items-center">
        <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
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

              <li className="px-5 py-2 font-semibold text-gray-200">PEMESANAN</li>

              <Link href="/finance/data_pemesanan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Data Pemesanan</li>
              </Link>

              <Link href="/finance/riwayat_finance">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Riwayat
                </li>
              </Link>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl text-black font-semibold mb-6">Riwayat Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header dengan tombol generate laporan */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Riwayat Pemesanan (Selesai/Ditolak)
              </h3>
              <button
                onClick={handleGenerateReport}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2.5 rounded-md text-sm transition duration-200 shadow-sm hover:shadow-md"
              >
                <FaDownload className="text-sm" />
                Generate Laporan
              </button>
            </div>

            {/* FILTER */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Search */}
                <div>
                  <label className="block font-medium text-sm text-gray-700 mb-1">
                    Cari (ID/Nama Barang)
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Cari nomor permintaan atau nama barang..."
                    className="border border-gray-300 rounded-md px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>

                {/* Filter Start Date */}
                <div>
                  <label className="block font-medium text-sm text-gray-700 mb-1">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>

                {/* Filter End Date */}
                <div>
                  <label className="block font-medium text-sm text-gray-700 mb-1">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-md px-3 py-2.5 w-full text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>

                {/* Tombol Filter */}
                <div className="flex items-end">
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handleFilterSubmit}
                      disabled={isFiltering}
                      className={`flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium px-3 py-2 rounded-md w-full text-xs transition duration-150 ${
                        isFiltering ? 'opacity-80 cursor-not-allowed' : ''
                      }`}
                    >
                      {isFiltering ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <FaFilter className="text-xs" />
                          Terapkan Filter
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleResetFilter}
                      className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-2 rounded-md w-full text-xs transition duration-150"
                    >
                      <FaRedo className="text-xs" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-6 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
                  <p className="mt-3 text-gray-600 text-sm">Memuat data...</p>
                </div>
              ) : (
                <>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 font-semibold text-sm text-gray-700">No</th>
                        <th className="px-6 py-3 font-semibold text-sm text-gray-700">ID Permintaan</th>
                        <th className="px-6 py-3 font-semibold text-sm text-gray-700">Tanggal Pemesanan</th>
                        <th className="px-6 py-3 font-semibold text-sm text-gray-700">Nama Barang</th>
                        <th className="px-6 py-3 font-semibold text-sm text-gray-700">Status</th>
                        <th className="px-6 py-3 font-semibold text-sm text-gray-700 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr
                          key={row.id || index}
                          className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "bg-white hover:bg-gray-50"}
                        >
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                            {row.nomor_permintaan || `REQ-${row.id || index}`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {formatDate(row.tanggal_pemesanan || row.tanggal || row.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                            {row.nama_barang || row.barang || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                row.status
                              )}`}
                            >
                              {formatStatus(row.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Link
                                href={`/finance/detail_pemesanan?id=${row.id}`}
                              >
                                <button
                                  className="flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium px-3 py-1.5 rounded-md text-xs transition duration-200 border border-teal-200"
                                  title="Lihat Detail"
                                >
                                  <FaEye size={12} />
                                  <span>Detail</span>
                                </button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {data.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-6 py-12 text-center text-gray-500 text-sm"
                          >
                            <div className="flex flex-col items-center">
                              <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              <p className="text-gray-400">Tidak ada data riwayat pemesanan</p>
                              <p className="text-gray-300 text-xs mt-1">Coba ubah filter atau cari dengan kata kunci lain</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-white border-t space-y-3 sm:space-y-0">
                      <div className="text-sm text-gray-600">
                        Menampilkan <span className="font-medium">{data.length}</span> dari <span className="font-medium">{pagination.totalItems}</span> data
                      </div>
                      <div className="inline-flex rounded-md shadow-sm">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className={`px-3 py-1.5 text-sm border border-gray-300 rounded-l-md ${
                            pagination.currentPage === 1
                              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Sebelumnya
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
                                className={`px-3 py-1.5 text-sm border border-l-0 border-gray-300 ${
                                  pageNum === pagination.currentPage
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                } ${
                                  pageNum === pagination.totalPages ? 'rounded-r-md' : ''
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className={`px-3 py-1.5 text-sm border border-l-0 border-gray-300 rounded-r-md ${
                            pagination.currentPage === pagination.totalPages
                              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Selanjutnya
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Garis bawah */}
            <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}