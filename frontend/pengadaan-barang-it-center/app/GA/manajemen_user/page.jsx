"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaPlus, FaTrash, FaSync } from "react-icons/fa";
import userService from "../../../lib/userService";
import divisiService from "../../../lib/divisiService";

export default function ManajemenUserPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState([]);
  const [divisiList, setDivisiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // State untuk filter
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("semua");
  const [divisiFilter, setDivisiFilter] = useState("semua");

  // Load divisi
  useEffect(() => {
    const loadDivisi = async () => {
      try {
        const data = await divisiService.getDivisiDropdown();
        setDivisiList(data);
      } catch (error) {
        console.error("Gagal memuat divisi:", error);
      }
    };
    loadDivisi();
  }, []);

  // Load users
  const loadUsers = useCallback(
    async (page = 1) => {
      console.log("🔄 Memuat data users... Page:", page);
      setLoading(true);
      try {
        const filters = {
          search,
          role: roleFilter,
          divisi_id: divisiFilter,
        };

        console.log("🔍 Filter yang digunakan:", filters);

        const response = await userService.getAllUsers(
          page,
          itemsPerPage,
          filters
        );

        console.log("📊 Response dari userService:", response);
        console.log("👥 Data users:", response.data);
        console.log("📄 Pagination info:", response.pagination);

        // Gunakan data langsung dari response
        setUsers(response.data || []);

        if (response.pagination) {
          setCurrentPage(response.pagination.currentPage || 1);
          setTotalPages(response.pagination.totalPages || 1);
          setTotalItems(response.pagination.totalItems || 0);
          setItemsPerPage(response.pagination.itemsPerPage || 10);
        }
      } catch (error) {
        console.error("❌ Error loading users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [search, roleFilter, divisiFilter, itemsPerPage]
  );

  // Load users on mount and when dependencies change
  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage, loadUsers]);

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 Window/tab aktif kembali, refresh data");
        setRefreshKey(Date.now());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Handle delete
  const handleDelete = async (id, username) => {
    if (window.confirm(`Hapus user "${username}"?`)) {
      try {
        await userService.deleteUser(id);
        alert("User berhasil dihapus");
        setRefreshKey(Date.now()); // Force refresh
      } catch (error) {
        console.error("Gagal menghapus user:", error);
        alert("Gagal menghapus user");
      }
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    setRefreshKey(Date.now());
    setCurrentPage(1);
  };

  // Handle search and filter changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDivisiChange = (e) => {
    setDivisiFilter(e.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Format role untuk tampilan
  const formatRole = (role) => {
    if (role === "pemohon") return "Pemohon";
    if (role === "admin") return "Admin";
    if (role === "validator") return "Validator";
    return role;
  };

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-gray-200">
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
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
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

                <hr className="border-t border-white/30 my-2" />

                {/* PEMESANAN */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
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
                </Link>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content - Scrollable dengan padding yang lebih baik */}
        <main className="flex-1 text-black p-6 bg-gray-200 overflow-y-auto ml-60">
          {/* Fixed header untuk judul halaman */}
          <div className="bg-gray-200 mb-6">
            <h2 className="text-3xl text-black font-semibold">Manajemen User</h2>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header atas card */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Data User
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleRefresh}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded text-sm transition-colors"
                >
                  <FaSync className="mr-2" /> Refresh Data
                </button>
                <Link href="/GA/tambah_user">
                  <button className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors">
                    <FaPlus className="mr-2" /> Tambah User
                  </button>
                </Link>
              </div>
            </div>

            {/* Filter section */}
            <div className="px-6 py-4 border-b bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Search */}
                <div>
                  <label
                    htmlFor="search"
                    className="block font-medium text-x1 mb-1"
                  >
                    Search
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Cari nama, username, email..."
                    className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
                  />
                </div>

                {/* Filter Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block font-medium text-x1 text-gray-700 mb-1"
                  >
                    Peran
                  </label>
                  <select
                    id="role"
                    value={roleFilter}
                    onChange={handleRoleChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-x1"
                  >
                    <option value="semua">Semua</option>
                    <option value="pemohon">Pemohon</option>
                    <option value="admin">Admin</option>
                    <option value="validator">Validator</option>
                  </select>
                </div>

                {/* Filter Divisi */}
                <div>
                  <label
                    htmlFor="divisi"
                    className="block font-medium text-x1 text-gray-700 mb-1"
                  >
                    Divisi
                  </label>
                  <select
                    id="divisi"
                    value={divisiFilter}
                    onChange={handleDivisiChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full text-x1"
                  >
                    <option value="semua">Semua</option>
                    {divisiList.map((divisi) => (
                      <option key={divisi.id} value={divisi.id}>
                        {divisi.nama_divisi}
                      </option>
                    ))}
                  </select>
                </div>
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
                  {/* Tampilkan jumlah data */}
                  <div className="px-6 py-3 text-sm text-gray-600 bg-gray-50">
                    {users.length > 0 
                      ? `Menampilkan ${users.length} dari ${totalItems} user` 
                      : 'Tidak ada data user ditemukan'}
                  </div>

                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 font-semibold text-x1">No</th>
                        <th className="px-4 py-3 font-semibold text-x1">Nama</th>
                        <th className="px-4 py-3 font-semibold text-x1">Username</th>
                        <th className="px-4 py-3 font-semibold text-x1">Email</th>
                        <th className="px-4 py-3 font-semibold text-x1">Divisi</th>
                        <th className="px-4 py-3 font-semibold text-x1">Peran</th>
                        <th className="px-4 py-3 font-semibold text-x1 text-center">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((row, index) => (
                        <tr
                          key={row.id}
                          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="px-4 py-3 text-x1">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3 text-x1 font-medium">
                            {row.nama_lengkap}
                          </td>
                          <td className="px-4 py-3 text-x1">{row.username}</td>
                          <td className="px-4 py-3 text-x1">{row.email || "-"}</td>
                          <td className="px-4 py-3 text-x1">{row.nama_divisi || "-"}</td>
                          <td className="px-4 py-3 text-x1">
                            <span
                              className={`px-2 py-1 rounded text-sm font-medium ${
                                row.role === "admin"
                                  ? "bg-blue-100 text-blue-800"
                                  : row.role === "validator"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {formatRole(row.role)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleDelete(row.id, row.username)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded text-sm transition-colors"
                                title="Hapus User"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            <div className="mb-2 text-2xl">📭</div>
                            <p className="font-medium">
                              Tidak ada data user ditemukan
                            </p>
                            <p className="text-sm mt-1">
                              {search ||
                              roleFilter !== "semua" ||
                              divisiFilter !== "semua"
                                ? "Coba ubah filter atau kata kunci pencarian"
                                : "Silakan tambah user baru"}
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {users.length > 0 && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-white border-t">
                      <div className="mb-3 sm:mb-0 text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages} • {totalItems} total user
                      </div>
                      <div className="inline-flex text-sm border rounded-md overflow-hidden">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 border-r text-sm ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          // Show only current page, first, last, and neighbors
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 &&
                              pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`px-3 py-1 border-r text-sm ${
                                  pageNum === currentPage
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
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 text-sm ${
                            currentPage === totalPages
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

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}