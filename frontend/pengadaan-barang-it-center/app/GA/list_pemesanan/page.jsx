"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

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
    status: "",
    start_date: "",
    end_date: "",
    search: "",
  });

  // Fetch data pemesanan
  const fetchPemesanan = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", pagination.itemsPerPage);

      if (filters.status) params.append("status", filters.status);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(
        `http://localhost:3200/api/admin/pemesanan?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404 || response.status === 500) {
        console.log("⚠️ API endpoint belum tersedia, menggunakan data dummy");
        // Fallback ke data dummy jika API belum ready
        const dummyData = [
          {
            id: 1,
            nomor_permintaan: "PB-10111",
            tanggal_pemesanan: "2025-01-01",
            nama_barang: "Laptop",
            status: "selesai",
            pemohon_nama: "John Doe",
          },
          {
            id: 2,
            nomor_permintaan: "PB-10777",
            tanggal_pemesanan: "2025-06-02",
            nama_barang: "Printer",
            status: "diproses",
            pemohon_nama: "Jane Smith",
          },
          {
            id: 3,
            nomor_permintaan: "PB-10112",
            tanggal_pemesanan: "2025-01-03",
            nama_barang: "Monitor",
            status: "selesai",
            pemohon_nama: "Bob Wilson",
          },
          {
            id: 4,
            nomor_permintaan: "PB-10778",
            tanggal_pemesanan: "2025-01-05",
            nama_barang: "Keyboard",
            status: "diproses",
            pemohon_nama: "Alice Brown",
          },
        ];
        setData(dummyData);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: dummyData.length,
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
    fetchPemesanan(1, {});
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle filter submit
  const handleFilterSubmit = () => {
    fetchPemesanan(1, filters);
  };

  // Handle reset filter
  const handleResetFilter = () => {
    const resetFilters = {
      status: "",
      start_date: "",
      end_date: "",
      search: "",
    };
    setFilters(resetFilters);
    fetchPemesanan(1, resetFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPemesanan(page, filters);
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

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "diproses":
      case "proses":
        return "bg-yellow-100 text-yellow-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      case "dalam pemesanan":
        return "bg-blue-100 text-blue-800";
      case "divalidasi": // TAMBAH INI
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
          <h2 className="text-3xl font-semibold mb-6">Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                List Pemesanan
              </h3>
            </div>

            {/* FILTER TANGGAL */}
            <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">
                  Dari Tanggal:
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={filters.start_date}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">
                  Sampai Tanggal:
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={filters.end_date}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700">Status:</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Semua Status</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                  <option value="divalidasi">Divalidasi</option>
                  <option value="dalam pemesanan">Dalam Pemesanan</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFilterSubmit}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded"
                >
                  Terapkan Filter
                </button>
                <button
                  onClick={handleResetFilter}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="px-6 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 font-semibold">No</th>
                      <th className="px-6 py-3 font-semibold">ID PB</th>
                      <th className="px-6 py-3 font-semibold">Tanggal</th>
                      <th className="px-6 py-3 font-semibold">Nama Barang</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-6 py-3">
                          {(pagination.currentPage - 1) *
                            pagination.itemsPerPage +
                            index +
                            1}
                        </td>
                        <td className="px-6 py-3 font-medium">
                          {row.nomor_permintaan || `PB-${row.id || index}`}
                        </td>
                        <td className="px-6 py-3">
                          {formatDate(row.tanggal_pemesanan || row.tanggal)}
                        </td>
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {row.nama_barang || row.barang || "-"}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                              row.status
                            )}`}
                          >
                            {row.status || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <Link
                            href={`/GA/detail_pemesanan?id=${row.id || index}`}
                          >
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
                        <td
                          colSpan="6"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          Tidak ada data pemesanan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-t">
                    <div className="text-sm text-gray-600">
                      Menampilkan {data.length} dari {pagination.totalItems}{" "}
                      data
                    </div>
                    <div className="inline-flex text-sm border rounded-md overflow-hidden">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1}
                        className={`px-3 py-1 border-r ${
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
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
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

            {/* Garis bawah */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
