"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DetailPermintaanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [permintaanData, setPermintaanData] = useState(null);
  const [barangData, setBarangData] = useState([]);
  const [catatanTolak, setCatatanTolak] = useState("");

  // Fetch detail permintaan
  const fetchPermintaanDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:3200/api/admin/permintaan/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setPermintaanData(result.data);
        setBarangData(result.data.barang || []);
      } else {
        setError(result.error || "Gagal mengambil data permintaan");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat mengambil data");
    } finally {
      setLoading(false);
    }
  };

  // Update status permintaan
  const handleUpdatePermintaanStatus = async (status, catatan = "") => {
    if (status === "ditolak" && !catatan) {
      setError("Harap berikan catatan penolakan");
      return;
    }
    
    if (!confirm(`Apakah yakin ingin mengubah status permintaan menjadi ${status}?`)) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3200/api/admin/permintaan/${id}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, catatan_admin: catatan || null }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess(`Status permintaan berhasil diubah menjadi ${status}`);
        // Refresh data
        fetchPermintaanDetail();
        setCatatanTolak("");
      } else {
        setError(result.error || "Gagal mengubah status permintaan");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  // Update status barang
  const handleUpdateBarangStatus = async (barangId, status, catatanAdmin = "") => {
    if (status === "ditolak" && !catatanAdmin) {
      setError(`Harap berikan catatan penolakan untuk barang ini`);
      return;
    }
    
    if (!confirm(`Apakah yakin ingin mengubah status barang menjadi ${status}?`)) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3200/api/admin/barang/${barangId}/status`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          status,
          catatan_admin: catatanAdmin || null
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess(`Status barang berhasil diubah menjadi ${status}`);
        // Refresh data
        fetchPermintaanDetail();
      } else {
        setError(result.error || "Gagal mengubah status barang");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  // Handle ajukan pembelian
  const handleAjukanPembelian = (barangId, barangData) => {
    // Navigasi ke halaman form pemesanan
    router.push(`/GA/form_pemesanan?barang_id=${barangId}&nama_barang=${encodeURIComponent(barangData.nama_barang)}&jumlah=${barangData.jumlah}`);
  };

  // Check if all barang are validated
  const isAllBarangValidated = () => {
    if (barangData.length === 0) return false;
    return barangData.every(barang => 
      barang.status !== "menunggu validasi" && 
      barang.status !== "draft"
    );
  };

  // Check if any barang is rejected
  const hasRejectedBarang = () => {
    return barangData.some(barang => barang.status === "ditolak");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "menunggu": return "bg-yellow-500 text-white";
      case "menunggu validasi": return "bg-yellow-500 text-white";
      case "diproses": return "bg-blue-500 text-white";
      case "dalam pemesanan": return "bg-purple-500 text-white";
      case "selesai": return "bg-green-500 text-white";
      case "ditolak": return "bg-red-500 text-white";
      case "draft": return "bg-gray-500 text-white";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "menunggu": return "Menunggu";
      case "menunggu validasi": return "Menunggu Validasi";
      case "diproses": return "Diproses";
      case "dalam pemesanan": return "Dalam Pemesanan";
      case "selesai": return "Selesai";
      case "ditolak": return "Ditolak";
      case "draft": return "Draft";
      default: return status;
    }
  };

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchPermintaanDetail();
    } else {
      router.push("/GA/data_permintaan");
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="ml-2">Memuat data...</p>
      </div>
    );
  }

  if (!permintaanData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Data permintaan tidak ditemukan</p>
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
          <h2 className="text-3xl font-semibold mb-6">Permintaan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Detail Permintaan
              </h3>
              <Link href="/GA/data_permintaan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Notifikasi */}
            {(error || success) && (
              <div className={`px-6 py-4 ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {error || success}
              </div>
            )}

            {/* Data Permintaan */}
            <div className="px-6 py-4 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Data Permintaan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">ID Permintaan</label>
                  <input
                    type="text"
                    value={permintaanData.nomor_permintaan || `PB-${permintaanData.id}`}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Nama Pemohon</label>
                  <input
                    type="text"
                    value={permintaanData.nama_lengkap || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Divisi</label>
                  <input
                    type="text"
                    value={permintaanData.nama_divisi || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Email</label>
                  <input
                    type="text"
                    value={permintaanData.email || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Status Permintaan</label>
                  <input
                    type="text"
                    value={getStatusText(permintaanData.status)}
                    disabled
                    className={`w-full border rounded px-3 py-2 mt-1 font-semibold ${getStatusColor(permintaanData.status)}`}
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Tanggal Permintaan</label>
                  <input
                    type="text"
                    value={formatDate(permintaanData.created_at)}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Tanggal Kebutuhan</label>
                  <input
                    type="text"
                    value={formatDate(permintaanData.tanggal_kebutuhan)}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Jumlah Barang Diminta</label>
                  <input
                    type="text"
                    value={barangData.length}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                {permintaanData.catatan && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">Catatan Pemohon</label>
                    <textarea
                      value={permintaanData.catatan}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                      rows="3"
                    />
                  </div>
                )}
              </div>

              {/* Tombol Aksi untuk Permintaan */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Aksi Permintaan
                </h4>
                
                {permintaanData.status === "menunggu" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdatePermintaanStatus("diproses")}
                      disabled={saving || !isAllBarangValidated()}
                      className={`px-5 py-2 font-medium rounded text-white ${
                        !isAllBarangValidated() 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      title={!isAllBarangValidated() ? "Semua barang harus divalidasi terlebih dahulu" : ""}
                    >
                      Proses Permintaan
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={catatanTolak}
                          onChange={(e) => setCatatanTolak(e.target.value)}
                          placeholder="Catatan penolakan..."
                          className="border border-gray-300 rounded px-3 py-2 flex-1"
                        />
                        <button
                          onClick={() => handleUpdatePermintaanStatus("ditolak", catatanTolak)}
                          disabled={saving || !catatanTolak.trim()}
                          className={`px-5 py-2 font-medium rounded text-white ${
                            !catatanTolak.trim() 
                              ? "bg-gray-400 cursor-not-allowed" 
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Tolak Permintaan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {permintaanData.status === "diproses" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdatePermintaanStatus("selesai")}
                      disabled={saving || !isAllBarangValidated() || hasRejectedBarang()}
                      className={`px-5 py-2 font-medium rounded text-white ${
                        !isAllBarangValidated() || hasRejectedBarang()
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      title={
                        !isAllBarangValidated() 
                          ? "Semua barang harus divalidasi terlebih dahulu" 
                          : hasRejectedBarang() 
                          ? "Tidak bisa selesai karena ada barang yang ditolak"
                          : ""
                      }
                    >
                      Tandai Selesai
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={catatanTolak}
                          onChange={(e) => setCatatanTolak(e.target.value)}
                          placeholder="Catatan penolakan..."
                          className="border border-gray-300 rounded px-3 py-2 flex-1"
                        />
                        <button
                          onClick={() => handleUpdatePermintaanStatus("ditolak", catatanTolak)}
                          disabled={saving || !catatanTolak.trim()}
                          className={`px-5 py-2 font-medium rounded text-white ${
                            !catatanTolak.trim() 
                              ? "bg-gray-400 cursor-not-allowed" 
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Batalkan Permintaan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Daftar Barang */}
            {barangData.map((barang, index) => (
              <div key={barang.id} className="px-6 py-4 border-b-4 border-b-gray-300">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Data Barang {index + 1}
                  </h4>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(barang.status)}`}>
                    {getStatusText(barang.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-700">Kategori Barang</label>
                    <input
                      type="text"
                      value={barang.kategori_barang || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Nama Barang</label>
                    <input
                      type="text"
                      value={barang.nama_barang || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Spesifikasi</label>
                    <input
                      type="text"
                      value={barang.spesifikasi || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Jumlah</label>
                    <input
                      type="text"
                      value={barang.jumlah || 0}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">Keterangan Pemohon</label>
                    <textarea
                      value={barang.keterangan || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                      rows="2"
                    />
                  </div>

                  {barang.catatan_admin && (
                    <div className="md:col-span-2">
                      <label className="font-medium text-gray-700">Keterangan Admin</label>
                      <textarea
                        value={barang.catatan_admin}
                        disabled
                        className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                        rows="2"
                      />
                    </div>
                  )}
                </div>

                {/* Tombol Aksi untuk Barang - SELALU TAMPILKAN */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Aksi Barang
                  </h4>
                  
                  <div className="flex gap-3">
                    {/* Status: Menunggu Validasi */}
                    {barang.status === "menunggu validasi" && (
                      <>
                        <button
                          onClick={() => handleAjukanPembelian(barang.id, barang)}
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
                        >
                          Ajukan Pembelian
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Catatan validasi..."
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              id={`catatan-validasi-${barang.id}`}
                            />
                            <button
                              onClick={() => {
                                const catatan = document.getElementById(`catatan-validasi-${barang.id}`).value;
                                handleUpdateBarangStatus(barang.id, "diproses", catatan);
                              }}
                              disabled={saving}
                              className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded"
                            >
                              Validasi
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Catatan penolakan..."
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              id={`catatan-tolak-${barang.id}`}
                            />
                            <button
                              onClick={() => {
                                const catatan = document.getElementById(`catatan-tolak-${barang.id}`).value;
                                if (!catatan.trim()) {
                                  setError("Harap berikan catatan penolakan");
                                  return;
                                }
                                handleUpdateBarangStatus(barang.id, "ditolak", catatan);
                              }}
                              disabled={saving}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Status: Diproses */}
                    {barang.status === "diproses" && (
                      <>
                        <button
                          onClick={() => handleAjukanPembelian(barang.id, barang)}
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
                        >
                          Ajukan Pembelian
                        </button>
                        
                        <button
                          onClick={() => handleUpdateBarangStatus(barang.id, "dalam pemesanan")}
                          disabled={saving}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2 rounded"
                        >
                          Tandai Sedang Dipesan
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Catatan penolakan..."
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              id={`catatan-batal-${barang.id}`}
                            />
                            <button
                              onClick={() => {
                                const catatan = document.getElementById(`catatan-batal-${barang.id}`).value;
                                if (!catatan.trim()) {
                                  setError("Harap berikan catatan pembatalan");
                                  return;
                                }
                                handleUpdateBarangStatus(barang.id, "ditolak", catatan);
                              }}
                              disabled={saving}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded"
                            >
                              Batalkan
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Status: Dalam Pemesanan */}
                    {barang.status === "dalam pemesanan" && (
                      <>
                        <button
                          onClick={() => handleAjukanPembelian(barang.id, barang)}
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
                        >
                          Lihat Pemesanan
                        </button>
                        
                        <button
                          onClick={() => handleUpdateBarangStatus(barang.id, "selesai")}
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded"
                        >
                          Tandai Selesai
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Catatan pembatalan..."
                              className="border border-gray-300 rounded px-3 py-2 flex-1"
                              id={`catatan-batal-pesan-${barang.id}`}
                            />
                            <button
                              onClick={() => {
                                const catatan = document.getElementById(`catatan-batal-pesan-${barang.id}`).value;
                                if (!catatan.trim()) {
                                  setError("Harap berikan catatan pembatalan");
                                  return;
                                }
                                handleUpdateBarangStatus(barang.id, "ditolak", catatan);
                              }}
                              disabled={saving}
                              className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded"
                            >
                              Batalkan Pemesanan
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Status: Selesai atau Ditolak - Tampilkan tombol reset */}
                    {(barang.status === "selesai" || barang.status === "ditolak") && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateBarangStatus(barang.id, "menunggu validasi", "Reset ke status awal")}
                          disabled={saving}
                          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-5 py-2 rounded"
                        >
                          Reset Status
                        </button>
                        
                        {barang.status === "selesai" && (
                          <button
                            onClick={() => handleAjukanPembelian(barang.id, barang)}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
                          >
                            Lihat Detail
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Tombol Simpan Akhir */}
            <div className="flex justify-end px-8 py-5 gap-3">
              <button
                onClick={() => {
                  setSuccess("Semua perubahan telah disimpan");
                  router.push("/GA/data_permintaan");
                }}
                className="bg-lime-600 hover:bg-lime-700 text-white font-medium px-5 py-2 rounded"
              >
                Simpan & Kembali
              </button>
              
              <button
                onClick={() => fetchPermintaanDetail()}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2 rounded"
              >
                Refresh Data
              </button>
            </div>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}