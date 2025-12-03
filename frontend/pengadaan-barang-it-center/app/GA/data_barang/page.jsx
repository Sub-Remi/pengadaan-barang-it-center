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
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch data barang
  const fetchBarang = async (
    page = 1,
    limit = 10,
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading data barang...</div>
      </div>
    );
  }

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
              <Link href="/GA/dashboard_ga">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Dashboard
                </li>
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">Barang</li>
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
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
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
          <h2 className="text-3xl font-semibold mb-6">Barang</h2>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
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
            <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <label htmlFor="search" className="text-gray-700 font-medium">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-x1"
                  placeholder="Cari nama barang..."
                />
                <select
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-x1"
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
                  className="bg-teal-600 text-white px-4 py-1 rounded"
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
            <table className="w-full border-collapse text-x1">
              <thead>
                <tr className="bg-white text-left">
                  <th className="px-6 py-3 font-semibold">No</th>
                  <th className="px-6 py-3 font-semibold">Kode Barang</th>
                  <th className="px-6 py-3 font-semibold">Kategori</th>
                  <th className="px-6 py-3 font-semibold">Nama Barang</th>
                  <th className="px-6 py-3 font-semibold">Satuan</th>
                  <th className="px-6 py-3 font-semibold">Stok</th>
                  <th className="px-6 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="px-6 py-3">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-6 py-3">{row.kode_barang}</td>
                    <td className="px-6 py-3">{row.nama_kategori}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {row.nama_barang}
                    </td>
                    <td className="px-6 py-3">{row.nama_satuan}</td>
                    <td className="px-6 py-3">{row.stok}</td>
                    <td className="px-6 py-3 text-center">
                      <Link href={`/GA/kelola_barang?id=${row.id}`}>
                        <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded">
                          <FaPen />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end px-6 py-4 bg-white border-t">
              <div className="inline-flex text-sm border rounded-md overflow-hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 bg-white hover:bg-gray-100 border-r disabled:bg-gray-200"
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 ${
                      pagination.page === i + 1
                        ? "bg-teal-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    } border-r`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-200"
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
