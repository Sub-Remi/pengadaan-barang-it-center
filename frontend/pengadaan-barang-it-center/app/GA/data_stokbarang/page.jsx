"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaPen, FaTrash, FaSync } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200/api";

export default function DataStokBarangPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
    totalItems: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch data stok
  const fetchStok = async (page = 1, limit = 5, search = "") => {
    try {
      setLoading(true);
      let url = `${API_URL}/admin/stok?page=${page}&limit=${limit}`;
      if (search) url += `&search=${search}`;

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

  useEffect(() => {
    fetchStok();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStok(1, pagination.limit, search);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchStok(newPage, pagination.limit, search);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchStok(pagination.page, pagination.limit, search);
  };

  // Handle delete
  const handleDelete = async (id, namaBarang) => {
    if (!confirm(`Yakin ingin menghapus ${namaBarang}?`)) return;

    try {
      const response = await fetch(`${API_URL}/admin/stok/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        alert("Barang berhasil dihapus!");
        fetchStok(pagination.page, pagination.limit, search);
      } else {
        alert(result.error || "Gagal menghapus barang");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus barang");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading data stok...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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

        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Stok Barang</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Data Stok Barang
              </h3>
              <button
                onClick={handleRefresh}
                className="flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                title="Refresh data"
              >
                <FaSync className="mr-2" /> Refresh
              </button>
            </div>

            {/* Search */}
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
                  className="border border-gray-300 rounded px-2 py-1 text-sx1"
                  placeholder="Cari kode atau nama barang..."
                />
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
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {row.nama_barang}
                    </td>
                    <td className="px-6 py-3">{row.nama_satuan}</td>
                    <td className="px-6 py-3">{row.stok}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/GA/kelola_stokbarang?id=${row.id}`}>
                          <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded">
                            <FaPen />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(row.id, row.nama_barang)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
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
