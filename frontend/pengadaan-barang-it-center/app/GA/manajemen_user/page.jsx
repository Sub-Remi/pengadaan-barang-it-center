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
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  // manajemen_user.jsx - Perbaiki fungsi loadUsers
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
    <div className="flex min-h-screen font-poppins bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-full">
        <div className="h-20 border-b border-white flex items-center justify-center bg-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 pb-6">
            <Link href="/GA/dashboard_ga">
              <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                Dashboard
              </li>
            </Link>

            <hr className="border-t border-white/30 my-2" />

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
              <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                Manajemen User
              </li>
            </Link>

            <hr className="border-t border-white/30 my-2" />

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
      <div className="flex flex-col flex-1 ml-60">
        <header className="flex bg-white shadow-sm items-center h-20">
          <div className="flex-1 h-full flex items-center px-8"></div>
        </header>

        <main className="flex-1 p-8 bg-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Manajemen User</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              >
                <FaSync className="mr-2" /> Refresh Data
              </button>
              <Link href="/GA/tambah_user">
                <button className="flex items-center bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                  <FaPlus className="mr-2" /> Tambah User
                </button>
              </Link>
            </div>
          </div>

          {/* Filter dan Search */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="flex flex-wrap items-center gap-4 px-6 py-4">
              <div className="flex items-center">
                <label
                  htmlFor="search"
                  className="text-gray-700 font-medium mr-2"
                >
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm"
                  placeholder="Cari nama, username, email"
                />
              </div>

              <div className="flex items-center">
                <label className="font-medium text-gray-700 mr-2">Peran</label>
                <select
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm"
                  value={roleFilter}
                  onChange={handleRoleChange}
                >
                  <option value="semua">Semua</option>
                  <option value="pemohon">Pemohon</option>
                  <option value="admin">Admin</option>
                  <option value="validator">Validator</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="font-medium text-gray-700 mr-2">Divisi</label>
                <select
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[150px]"
                  value={divisiFilter}
                  onChange={handleDivisiChange}
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

          {/* Tampilkan jumlah data */}
          <div className="mb-4 text-sm text-gray-600">
            {loading
              ? "Memuat data..."
              : `Menampilkan ${users.length} dari ${totalItems} user`}
          </div>

          {/* Tabel User */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mb-2"></div>
                <p className="text-gray-500">Memuat data user...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-6 py-3 font-semibold text-gray-700 border-b">
                          No
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700 border-b">
                          Nama
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700 border-b">
                          Username
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700 border-b">
                          Email
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700 border-b">
                          Divisi
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700 border-b">
                          Peran
                        </th>
                        <th className="px-6 py-3 font-semibold text-gray-700 border-b text-center">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((row, index) => (
                          <tr
                            key={row.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-3 text-gray-700 border-b">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-3 font-medium text-gray-800 border-b">
                              {row.nama_lengkap}
                            </td>
                            <td className="px-6 py-3 text-gray-700 border-b">
                              {row.username}
                            </td>
                            <td className="px-6 py-3 text-gray-700 border-b">
                              {row.email || "-"}
                            </td>
                            <td className="px-6 py-3 text-gray-700 border-b">
                              {row.nama_divisi || "-"}
                            </td>
                            <td className="px-6 py-3 border-b">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                            <td className="px-6 py-3 border-b text-center">
                              <button
                                onClick={() =>
                                  handleDelete(row.id, row.username)
                                }
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                                title="Hapus User"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            <div className="mb-2">📭</div>
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
                </div>

                {/* Pagination */}
                {users.length > 0 && totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-white border-t">
                    <div className="mb-3 sm:mb-0 text-sm text-gray-700">
                      Halaman {currentPage} dari {totalPages} • {totalItems}{" "}
                      total user
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Previous
                      </button>

                      {/* Pagination numbers */}
                      <div className="flex space-x-1">
                        {(() => {
                          const pages = [];
                          const maxVisiblePages = 5;

                          // Tentukan halaman awal dan akhir
                          let startPage = Math.max(
                            1,
                            currentPage - Math.floor(maxVisiblePages / 2)
                          );
                          let endPage = Math.min(
                            totalPages,
                            startPage + maxVisiblePages - 1
                          );

                          // Adjust jika tidak cukup halaman
                          if (endPage - startPage + 1 < maxVisiblePages) {
                            startPage = Math.max(
                              1,
                              endPage - maxVisiblePages + 1
                            );
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <button
                                key={i}
                                onClick={() => goToPage(i)}
                                className={`px-3 py-1.5 text-sm border rounded-md min-w-[40px] ${
                                  currentPage === i
                                    ? "bg-teal-600 text-white border-teal-600"
                                    : "bg-white hover:bg-gray-50"
                                } transition-colors`}
                              >
                                {i}
                              </button>
                            );
                          }
                          return pages;
                        })()}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
