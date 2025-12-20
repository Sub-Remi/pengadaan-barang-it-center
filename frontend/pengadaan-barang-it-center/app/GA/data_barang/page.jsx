"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaPlus, FaPen, FaSync } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200/api";

export default function DataBarangPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [kategoriList, setKategoriList] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
    totalItems: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch data barang
  const fetchBarang = async (
    page = 1,
    limit = 5,
    search = "",
    kategori_id = ""
  ) => {
    try {
      setLoading(true);
      let url = `${API_URL}/admin/barang?page=${page}&limit=${limit}`;
      if (search) url += `&search=${search}`;
      if (kategori_id) url += `&kategori_id=${kategori_id}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data");

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setPagination({
          page: result.pagination.currentPage,
          limit: result.pagination.itemsPerPage,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.totalItems,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch kategori untuk filter
  const fetchKategori = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/kategori/dropdown`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setKategoriList(result.data);
      }
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  useEffect(() => {
    fetchBarang();
    fetchKategori();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBarang(1, pagination.limit, search, kategoriFilter);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchBarang(newPage, pagination.limit, search, kategoriFilter);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchBarang(pagination.page, pagination.limit, search, kategoriFilter);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading data barang...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8"></div>
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
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
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

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200 overflow-y-auto ml-60">
          <h2 className="text-3xl text-black font-semibold mb-6">Barang</h2>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-4 border-black border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Data Barang
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  title="Refresh data"
                >
                  <FaSync className="mr-2" /> Refresh
                </button>
                <Link href="/GA/tambah_barang">
                  <button className="flex items-center bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                    <FaPlus className="mr-2" /> Tambah Barang
                  </button>
                </Link>
              </div>
            </div>

            {/* Filter */}
            <div className="px-6 text-black py-4 border-b text-x1 bg-white">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <label htmlFor="search" className="text-gray-800 font-medium">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
                  placeholder="Cari nama barang..."
                />
                <select
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-48"
                >
                  <option value="">Semua Kategori</option>
                  {kategoriList.map((kategori) => (
                    <option key={kategori.id} value={kategori.id}>
                      {kategori.nama_kategori}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                >
                  Cari
                </button>
              </form>
            </div>

            {/* Error message */}
            {error && (
              <div className="px-6 py-4 bg-red-100 text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Tabel */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-black text-left">
                    <th className="px-6 py-3 font-semibold text-x1">No</th>
                    <th className="px-6 py-3 font-semibold text-x1">Kode Barang</th>
                    <th className="px-6 py-3 font-semibold text-x1">Kategori</th>
                    <th className="px-6 py-3 font-semibold text-x1">Nama Barang</th>
                    <th className="px-6 py-3 font-semibold text-x1">Satuan</th>
                    <th className="px-6 py-3 font-semibold text-x1">Stok</th>
                    <th className="px-6 py-3 font-semibold text-x1 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? "bg-gray-50 text-black" : "bg-white text-black"}
                    >
                      <td className=" text-black px-6 py-3 text-x1">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="px-6 py-3 text-x1">{row.kode_barang}</td>
                      <td className="px-6 py-3 text-x1">{row.nama_kategori}</td>
                      <td className="px-6 py-3 text-x1 font-medium">
                        {row.nama_barang}
                      </td>
                      <td className="px-6 py-3 text-x1">{row.nama_satuan}</td>
                      <td className="px-6 py-3 text-x1">{row.stok}</td>
                      <td className="px-6 py-3 text-center">
                        <Link href={`/GA/kelola_barang?id=${row.id}`}>
                          <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded">
                            <FaPen />
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
                        Tidak ada data barang
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="text-black flex justify-between items-center px-6 py-4 bg-white border-t">
              <div className="text-sm text-gray-600">
                Menampilkan {data.length} dari {pagination.totalItems} data
              </div>
              <div className="inline-flex text-sm border rounded-md overflow-hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 border-r ${
                    pagination.page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 border-r ${
                      pagination.page === i + 1
                        ? "bg-teal-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 ${
                    pagination.page === pagination.totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}