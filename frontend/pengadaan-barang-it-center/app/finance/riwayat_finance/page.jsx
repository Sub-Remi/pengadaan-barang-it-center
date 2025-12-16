"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye, FaDownload } from "react-icons/fa";

export default function ListPemesananPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const handleFilterSubmit = () => {
    fetchRiwayatPemesanan(1, filters);
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
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2"
              >
                <FaDownload />
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
                    placeholder="Cari..."
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
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
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
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
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  />
                </div>

                {/* Tombol Filter */}
                <div className="flex items-end">
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handleFilterSubmit}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded w-full text-x1"
                    >
                      Terapkan Filter
                    </button>
                    <button
                      onClick={handleResetFilter}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded w-full text-x1"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
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
                      <tr className="bg-gray-50 text-left text-black">
                        <th className="px-6 py-3 font-semibold text-x1">No</th>
                        <th className="px-6 py-3 font-semibold text-x1">ID Permintaan</th>
                        <th className="px-6 py-3 font-semibold text-x1">Tanggal Pemesanan</th>
                        <th className="px-6 py-3 font-semibold text-x1">Nama Barang</th>
                        <th className="px-6 py-3 font-semibold text-x1">Status</th>
                        <th className="px-6 py-3 font-semibold text-x1 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr
                          key={row.id || index}
                          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="px-6 py-3 text-x1 text-black">
                            {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-3 text-x1 text-black font-medium">
                            {row.nomor_permintaan || `REQ-${row.id || index}`}
                          </td>
                          <td className="px-6 py-3 text-x1 text-black">
                            {formatDate(row.tanggal_pemesanan || row.tanggal || row.created_at)}
                          </td>
                          <td className="px-6 py-3 text-x1 text-black font-medium">
                            {row.nama_barang || row.barang || "-"}
                          </td>
                          <td className="px-6 py-3 text-x1 text-black">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                row.status
                              )}`}
                            >
                              {formatStatus(row.status)}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <Link
                                href={`/finance/detail_pemesanan?id=${row.id}`}
                              >
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
                            colSpan="6"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            Tidak ada data riwayat pemesanan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
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
                  )}
                </>
              )}
            </div>

            {/* Garis bawah */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}