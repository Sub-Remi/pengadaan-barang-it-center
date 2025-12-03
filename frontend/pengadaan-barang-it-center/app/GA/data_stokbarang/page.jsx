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
    limit: 10,
    totalPages: 1,
    totalItems: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch data stok
  const fetchStok = async (page = 1, limit = 10, search = "") => {
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
      {/* Header dan Sidebar sama seperti sebelumnya */}
      {/* ... */}

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
  );
}
