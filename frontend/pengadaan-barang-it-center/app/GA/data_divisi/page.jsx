"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSearch, FaEdit, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function DataDivisiSemuaPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(5);

  // Fetch data dengan pagination
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });
      
      const response = await fetch(`http://localhost:3200/api/admin/divisi?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setData(result.data);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalItems(result.pagination?.totalItems || 0);
      } else {
        setError(result.error || "Gagal mengambil data divisi");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete divisi
  const handleDelete = async (id, nama) => {
    if (!confirm(`Apakah yakin ingin menghapus divisi "${nama}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3200/api/admin/divisi/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess(`Divisi "${nama}" berhasil dihapus`);
        // Refresh data
        fetchData();
      } else {
        setError(result.error || "Gagal menghapus divisi");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menghapus");
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset ke halaman 1 saat search
    fetchData();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle edit divisi
  const handleEdit = (id) => {
    router.push(`/GA/edit_divisi?id=${id}`);
  };

  // Initial fetch dan fetch saat page/search berubah
  useEffect(() => {
    fetchData();
  }, [page]);

  // Reset notifikasi setelah beberapa detik
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-semibold">Semua Divisi</h2>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h3 className="text-xl font-semibold text-teal-600">
                  Data Semua Divisi
                </h3>
                
              </div>
              <div className="flex gap-3">
                <Link href="/GA/tambah_divisi">
                  <button className="flex items-center bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                    <FaPlus className="mr-2" /> Tambah Divisi
                  </button>
                </Link>
              </div>
            </div>

            {/* Notifikasi */}
            {(error || success) && (
              <div className={`px-6 py-4 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {error || success}
              </div>
            )}

            {/* Search */}
            <div className="px-6 py-4 border-b bg-white">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <label htmlFor="search" className="text-gray-700 font-medium">
                  <FaSearch className="inline mr-2" /> Cari Divisi
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berdasarkan nama divisi..."
                  className="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Cari
                </button>
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                      fetchData();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
                  >
                    Reset
                  </button>
                )}
              </form>
            </div>

            {/* Tabel */}
            {loading ? (
              <div className="px-6 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Memuat data divisi...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-600">
                  {search ? "Tidak ditemukan divisi dengan kata kunci tersebut." : "Belum ada data divisi."}
                </p>
                <Link href="/GA/tambah_divisi">
                  <button className="mt-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
                    Tambah Divisi
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-x1 min-w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 font-semibold text-gray-700">No</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">ID</th>
                        <th className="px-6 py-3 font-semibold text-gray-700">Nama Divisi</th>
                        <th className="px-6 py-3 font-semibold text-gray-700 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr
                          key={row.id}
                          className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                        >
                          <td className="px-6 py-3">{(page - 1) * limit + index + 1}</td>
                          <td className="px-6 py-3 font-mono text-sm text-gray-600">DIV-{row.id.toString().padStart(3, '0')}</td>
                          <td className="px-6 py-3 font-medium text-gray-800">
                            {row.nama_divisi}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <div className="flex justify-center gap-2">
                          
                              <button
                                onClick={() => handleDelete(row.id, row.nama_divisi)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition"
                                title="Hapus Divisi"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
                  <div className="text-sm text-gray-600">
                    Menampilkan {data.length} dari {totalItems} divisi
                  </div>
                  <div className="inline-flex text-sm border rounded-md overflow-hidden">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`px-3 py-1 border-r ${
                        page === 1 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-white hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 border-r ${
                            page === pageNum
                              ? "bg-teal-600 text-white"
                              : "bg-white hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`px-3 py-1 ${
                        page === totalPages
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