"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaPlus, FaEye, FaSync } from "react-icons/fa";
import permintaanService from "../../../lib/permintaanService";
import authService from "../../../lib/authService";
import ProtectedRoute from "../../../app/components/ProtectedRoute";

export default function PermintaanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    start_date: "",
    end_date: "",
    status: "",
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
      const response = await permintaanService.getPermintaan({
        ...filters,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });
      setData(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(error.error || "Gagal mengambil data permintaan.");
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
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ProtectedRoute allowedRoles={["pemohon"]}>
      <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
        {/* Header */}
        <header className="flex bg-white shadow-sm items-center">
          <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
            <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
          </div>
          <div className="flex-1 h-20 flex items-center px-8">
            <button
              onClick={fetchData}
              className="ml-auto flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1">
            <nav className="flex-1 mt-6">
              <ul className="space-y-1">
                <Link href="/Divisi/dashboard_divisi">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                    Dashboard
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                <li className="px-5 py-2 font-semibold text-x1 text-gray-200 mt-2 cursor-default">
                  PENGADAAN
                </li>

                <Link href="/Divisi/draf_permintaan">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                    Draf Permintaan
                  </li>
                </Link>

                <Link href="/Divisi/permintaan_divisi">
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                    Permintaan
                  </li>
                </Link>

                <Link href="/Divisi/riwayat_divisi">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                    Riwayat
                  </li>
                </Link>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 bg-gray-200">
            <h2 className="text-black text-3xl font-semibold mb-6">
              Permintaan
            </h2>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header atas */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-teal-600">
                  Data Permintaan
                </h3>
                <Link href="/Divisi/form_permintaan">
                  <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                    <FaPlus />
                    Tambah Permintaan
                  </button>
                </Link>
              </div>

              {/* Filter */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b bg-white gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="search"
                      className="text-gray-700 font-medium"
                    >
                      Search
                    </label>
                    <input
                      id="search"
                      name="search"
                      type="text"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="text-gray-700 border border-gray-300 rounded px-3 py-1 text-x1 w-40"
                      placeholder="Cari..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-medium text-gray-700">
                      Dari Tanggal
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={filters.start_date}
                      onChange={handleFilterChange}
                      className="text-gray-700 border border-gray-300 rounded px-3 py-1 text-x1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-medium text-gray-700">
                      Sampai Tanggal
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={filters.end_date}
                      onChange={handleFilterChange}
                      className="text-gray-700 border border-gray-300 rounded px-3 py-1 text-x1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="text-gray-700 border border-gray-300 rounded px-3 py-1 text-x1"
                    >
                      <option value="">Semua Status</option>
                      <option value="menunggu">Menunggu</option>
                      <option value="diproses">Diproses</option>
                      <option value="selesai">Selesai</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded text-x1">
                    Excel
                  </button>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded text-x1">
                    PDF
                  </button>
                </div>
              </div>

{/* Tabel */}
{loading ? (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
    <p className="mt-2 text-gray-600">Memuat data...</p>
  </div>
) : data.length === 0 ? (
  <div className="text-center py-8 text-gray-800">
    Tidak ada data permintaan ditemukan
  </div>
) : (
  <>
    <table className="text-black w-full border-collapse text-x1">
      <thead>
        <tr className="bg-white text-left border-b">
          <th className="px-6 py-3 font-semibold">No</th>
          <th className="px-6 py-3 font-semibold">
            Nomor Permintaan
          </th>
          <th className="px-6 py-3 font-semibold">Judul</th>
          <th className="px-6 py-3 font-semibold">
            Tanggal Dibuat
          </th>
          <th className="px-6 py-3 font-semibold text-center">
            Jumlah Barang
          </th>
          <th className="px-6 py-3 font-semibold">Status</th>
          <th className="px-6 py-3 font-semibold text-center">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className={`${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-gray-100`}
          >
            <td className="px-6 py-3">
              {(pagination.currentPage - 1) *
                pagination.itemsPerPage +
                index + 1}
            </td>
            <td className="px-6 py-3 font-medium text-gray-800">
              {row.nomor_permintaan}
            </td>
            <td className="px-6 py-3">
              {row.catatan}
            </td>
            <td className="px-6 py-3">
              {new Date(row.created_at).toLocaleDateString(
                "id-ID"
              )}
            </td>
            <td className="px-6 py-3 text-center">
              {row.jumlah_item > 0 ? (
                <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-lg border border-blue-200">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                  {row.jumlah_item} item
                </span>
              ) : (
                <span className="text-gray-400 text-sm">0 item</span>
              )}
            </td>
            <td className="px-6 py-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  row.status
                )}`}
              >
                {row.status}
              </span>
            </td>
            <td className="px-6 py-3 text-center">
              <Link
                href={`/Divisi/detail_permintaan?id=${row.id}`}
              >
                <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded">
                  <FaEye />
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination - tetap sama */}
    <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
      <div className="text-sm text-black">
        Menampilkan {data.length} dari {pagination.totalItems} data
      </div>
      <div className="flex items-center">
        <button
          onClick={() =>
            handlePageChange(pagination.currentPage - 1)
          }
          disabled={pagination.currentPage === 1}
          className="px-3 py-1 text-black bg-white hover:bg-gray-600 border rounded disabled:opacity-50"
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
                className={`px-3 py-1 rounded ${
                  pageNum === pagination.currentPage
                    ? "bg-teal-600 text-white"
                    : "text-black bg-white hover:bg-gray-600 border"
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
          className="px-3 py-1 bg-white hover:bg-gray-900 border rounded disabled:opacity-50"
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
    </ProtectedRoute>
  );
}
