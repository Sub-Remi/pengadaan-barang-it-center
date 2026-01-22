"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DetailRiwayatPermintaanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [permintaanData, setPermintaanData] = useState(null);
  const [barangData, setBarangData] = useState([]);

  // Fetch detail permintaan riwayat
  const fetchPermintaanDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      console.log(`🔍 Fetching detail riwayat permintaan ID: ${id}`);

      // Gunakan endpoint yang sama dengan detail permintaan biasa
      // Atau endpoint khusus riwayat jika ada
      const response = await fetch(
        `http://localhost:3200/api/admin/permintaan/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("✅ Data riwayat berhasil diambil:", result.data);
        setPermintaanData(result.data);
        setBarangData(result.data.barang || []);
      } else {
        console.error("❌ Error response:", result);
        setError(result.error || "Gagal mengambil data riwayat permintaan");
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "selesai":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
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
      case "diproses":
        return "Diproses";
      case "menunggu":
        return "Menunggu";
      default:
        return status;
    }
  };

  // Hitung statistik barang
  const getBarangStats = () => {
    const total = barangData.length;
    const selesai = barangData.filter((b) => b.status === "selesai").length;
    const ditolak = barangData.filter((b) => b.status === "ditolak").length;
    
    return { total, selesai, ditolak };
  };

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchPermintaanDetail();
    } else {
      router.push("/GA/riwayat_ga");
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="ml-2 text-gray-700">Memuat data riwayat...</p>
      </div>
    );
  }

  if (!permintaanData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Data riwayat permintaan tidak ditemukan</p>
        <button 
          onClick={() => router.push("/GA/riwayat_ga")}
          className="ml-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  const stats = getBarangStats();

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8"></div>
      </header>

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col fixed left-0 top-16 bottom-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                    Riwayat
                  </li>
                </Link>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200 overflow-y-auto ml-60">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Riwayat</h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button 
                onClick={fetchPermintaanDetail}
                className="ml-4 text-sm underline"
              >
                Coba Lagi
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-black border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Detail Riwayat Permintaan
              </h3>
              <Link href="/GA/riwayat_ga">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition">
                  &lt; Kembali ke Riwayat
                </button>
              </Link>
            </div>

            {/* Data Permintaan */}
            <div className="text-black px-6 py-4 border-b">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Data Permintaan
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID Permintaan */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    ID Permintaan
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 font-mono">
                    {permintaanData.nomor_permintaan || `PB-${permintaanData.id}`}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Status Permintaan
                  </label>
                  <div className={`px-3 py-2 rounded font-semibold ${getStatusColor(permintaanData.status)}`}>
                    {getStatusText(permintaanData.status)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stats.selesai} barang selesai, {stats.ditolak} barang ditolak
                  </div>
                </div>

                {/* Nama Pemohon */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Nama Pemohon
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2">
                    {permintaanData.nama_lengkap || "-"}
                  </div>
                </div>

                {/* Divisi */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Divisi
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2">
                    {permintaanData.nama_divisi || "-"}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Email
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2">
                    {permintaanData.email || "-"}
                  </div>
                </div>

                {/* Tanggal Permintaan */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Tanggal Permintaan
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2">
                    {formatDate(permintaanData.created_at)}
                  </div>
                </div>

                {/* Tanggal Kebutuhan */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Tanggal Kebutuhan
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2">
                    {formatDate(permintaanData.tanggal_kebutuhan)}
                  </div>
                </div>

                {/* Jumlah Barang */}
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Jumlah Barang
                  </label>
                  <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2">
                    {barangData.length} jenis barang
                  </div>
                </div>

                {/* Catatan Pemohon */}
                {permintaanData.catatan && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700 block mb-1">
                      Catatan / Keterangan Permintaan
                    </label>
                    <div className="w-full border border-gray-300 bg-gray-50 rounded px-3 py-2 whitespace-pre-wrap">
                      {permintaanData.catatan}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Daftar Barang */}
            <div className="px-6 py-4">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Daftar Barang ({barangData.length} item)
              </h4>
              
              {barangData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada data barang
                </div>
              ) : (
                <div className="space-y-6">
                  {barangData.map((barang, index) => (
                    <div key={barang.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold text-gray-800">
                          Barang #{index + 1}
                        </h5>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(barang.status)}`}>
                          {getStatusText(barang.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Kategori Barang */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1">
                            Kategori Barang
                          </label>
                          <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-black">
                            {barang.kategori_barang || "-"}
                          </div>
                        </div>

                        {/* Nama Barang */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1">
                            Nama Barang
                          </label>
                          <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-black">
                            {barang.nama_barang || "-"}
                          </div>
                        </div>

                        {/* Spesifikasi */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1">
                            Spesifikasi
                          </label>
                          <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-black">
                            {barang.spesifikasi || "-"}
                          </div>
                        </div>

                        {/* Jumlah */}
                        <div>
                          <label className="text-sm font-medium text-gray-600 block mb-1">
                            Jumlah Diminta
                          </label>
                          <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-black">
                            {barang.jumlah || 0} unit
                          </div>
                        </div>

                        {/* Info Stok (jika ada) */}
                        {barang.stok_barang && (
                          <>
                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1">
                                Stok Tersedia
                              </label>
                              <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2">
                                {barang.stok_barang.stok || 0} unit
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-600 block mb-1">
                                Status Stok
                              </label>
                              <div className={`px-3 py-2 rounded ${(barang.stok_barang.stok || 0) >= (barang.jumlah || 0) ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                {(barang.stok_barang.stok || 0) >= (barang.jumlah || 0)
                                  ? "✅ Stok mencukupi"
                                  : "⚠️ Stok kurang"}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Keterangan Pemohon */}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-600 block mb-1">
                            Keterangan Pemohon
                          </label>
                          <div className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-black">
                            {barang.keterangan || "-"}
                          </div>
                        </div>

                        {/* Catatan Admin (jika ada) */}
                        {barang.catatan_admin && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-600 block mb-1">
                              Catatan Admin
                            </label>
                            <div className="w-full border border-red-100 bg-red-50 rounded px-3 py-2 text-red-700">
                              {barang.catatan_admin}
                            </div>
                          </div>
                        )}

                        {/* Catatan Validator (jika ada) */}
                        {barang.catatan_validator && (
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-600 block mb-1">
                              Catatan Validator
                            </label>
                            <div className="w-full border border-blue-100 bg-blue-50 rounded px-3 py-2 text-blue-700">
                              {barang.catatan_validator}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timeline atau Info Tambahan */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex text-sm text-gray-500">
                          <div className="mr-6">
                            <span className="font-medium">Dibuat:</span>{" "}
                            {barang.created_at ? formatDate(barang.created_at) : "-"}
                          </div>
                          <div>
                            <span className="font-medium">Terakhir Update:</span>{" "}
                            {barang.updated_at ? formatDate(barang.updated_at) : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Data diambil pada: {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
                <button
                  onClick={fetchPermintaanDetail}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
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