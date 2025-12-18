"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import adminPermintaanService from "../../../lib/adminPermintaanService";

export default function RiwayatGAPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [divisiFilter, setDivisiFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [divisiList, setDivisiList] = useState([]);
  const [sortOrder, setSortOrder] = useState("terbaru");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
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

  // Fetch data riwayat permintaan
  const fetchPermintaanRiwayat = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      
      // Gunakan fungsi baru untuk riwayat
      const result = await adminPermintaanService.getPermintaanRiwayat(
        page,
        pagination.itemsPerPage,
        filters,
        sortOrder
      );

      console.log("📊 Riwayat data fetched:", result.data);
      
      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching riwayat:", error);
      alert(
        error.response?.data?.error || "Terjadi kesalahan saat mengambil data riwayat"
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
      fetchPermintaanRiwayat(1, {
        search: value,
        divisi_id: divisiFilter,
        start_date: startDate,
        end_date: endDate,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle filter
  const handleFilter = () => {
    fetchPermintaanRiwayat(1, {
      search,
      divisi_id: divisiFilter,
      start_date: startDate,
      end_date: endDate,
    });
  };

  // Reset filter
  const handleResetFilter = () => {
    setSearch("");
    setDivisiFilter("");
    setStartDate("");
    setEndDate("");
    setSortOrder("terbaru");
    fetchPermintaanRiwayat(1, {});
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    fetchPermintaanRiwayat(1, {
      search,
      divisi_id: divisiFilter,
      start_date: startDate,
      end_date: endDate,
    });
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPermintaanRiwayat(page, {
      search,
      divisi_id: divisiFilter,
      start_date: startDate,
      end_date: endDate,
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
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
      case "selesai":
        return "Selesai";
      case "ditolak":
        return "Ditolak";
      default:
        return status;
    }
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

  // Initial fetch
  useEffect(() => {
    fetchPermintaanRiwayat();
    fetchDivisi();
  }, []);

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
              <Link href="/GA/dashboard_ga">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Dashboard</li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              {/* DATA MASTER */}
              <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
                DATA MASTER
              </li>

              <Link href="/GA/data_permintaan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Permintaan
                </li>
              </Link>

              <Link href="/GA/data_barang">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Barang
                </li>
              </Link>

              <Link href="/GA/data_kategoribarang">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Kategori Barang
                </li>
              </Link>

              <Link href="/GA/data_satuanbarang">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Satuan Barang
                </li>
              </Link>

              <Link href="/GA/data_stokbarang">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Stok Barang
                </li>
              </Link>

              <Link href="/GA/data_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Divisi
                </li>
              </Link>

              <Link href="/GA/manajemen_user">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Manajemen User
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              {/* MONITORING */}
              <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
                MONITORING
              </li>

              <Link href="/GA/laporan_ga">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Laporan
                </li>
              </Link>

              <Link href="/GA/riwayat_ga">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Riwayat
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              {/* PEMESANAN */}
              <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
                PEMESANAN
              </li>

              <Link href="/GA/list_pemesanan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  List Pemesanan
                </li>
              </Link>

              <Link href="/GA/form_penerimaanbarang">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Form Penerimaan
                </li>
              </Link>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Riwayat</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Riwayat Permintaan (Selesai & Ditolak)
              </h3>
            </div>

            {/* Filter dan tombol Excel/PDF */}
            <div className="flex flex-col gap-4 px-6 py-4 border-b bg-white">
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="search" className="text-gray-700 font-medium">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Cari ID PB atau nama pemohon..."
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                />

                <label className="font-medium text-gray-700">Divisi</label>
                <select
                  value={divisiFilter}
                  onChange={(e) => setDivisiFilter(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="">Semua Divisi</option>
                  {divisiList.map((divisi) => (
                    <option key={divisi.id} value={divisi.id}>
                      {divisi.nama_divisi}
                    </option>
                  ))}
                </select>

                <label className="font-medium text-gray-700">Urutkan</label>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                </select>

                <label className="font-medium text-gray-700">Dari Tanggal</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm" 
                />

                <label className="font-medium text-gray-700">Sampai Tanggal</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm" 
                />

                <button
                  onClick={handleFilter}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-1 rounded text-sm"
                >
                  Filter
                </button>
                <button
                  onClick={handleResetFilter}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-1 rounded text-sm"
                >
                  Reset
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded text-sm">
                  Excel
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded text-sm">
                  PDF
                </button>
              </div>
            </div>

            {/* Tabel */}
            {loading ? (
              <div className="px-6 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Memuat data riwayat...</p>
              </div>
            ) : (
              <>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-white text-left border-b">
                      <th className="px-6 py-3 font-semibold">No</th>
                      <th className="px-6 py-3 font-semibold">ID PB</th>
                      <th className="px-6 py-3 font-semibold">Divisi</th>
                      <th className="px-6 py-3 font-semibold">Nama Pemohon</th>
                      <th className="px-6 py-3 font-semibold">Tanggal</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-3">
                          {(pagination.currentPage - 1) * pagination.itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-3 font-medium">
                          {row.nomor_permintaan || `PB-${row.id}`}
                        </td>
                        <td className="px-6 py-3">
                          {row.nama_divisi || "-"}
                        </td>
                        <td className="px-6 py-3">
                          {row.nama_lengkap || "-"}
                        </td>
                        <td className="px-6 py-3">
                          {formatDate(row.created_at)}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              row.status
                            )}`}
                          >
                            {getStatusText(row.status)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <Link href={`/GA/detail_riwayatga?id=${row.id}`}>
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
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          Tidak ada data riwayat permintaan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {data.length > 0 && (
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
                    <div className="text-sm text-gray-600">
                      Menampilkan {data.length} dari {pagination.totalItems} data
                    </div>
                    <div className="inline-flex text-sm border rounded-md overflow-hidden">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`px-3 py-1 ${
                          pagination.currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100"
                        } border-r`}
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
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
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

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}