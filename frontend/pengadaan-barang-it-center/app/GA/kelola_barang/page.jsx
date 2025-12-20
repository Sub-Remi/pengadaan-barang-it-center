"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DetailBarangPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    kode_barang: "",
    nama_barang: "",
    kategori_barang_id: "",
    satuan_barang_id: "",
    spesifikasi: "",
    stok: "",
    stok_minimum: 0,
  });
  const [kategoriList, setKategoriList] = useState([]);
  const [satuanList, setSatuanList] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200/api";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch data barang berdasarkan ID
  const fetchBarangDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/barang/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data barang");

      const result = await response.json();
      console.log("Detail Barang:", result); // Debug log
      
      if (result.success) {
        setFormData({
          kode_barang: result.data.kode_barang || "",
          nama_barang: result.data.nama_barang || "",
          kategori_barang_id: result.data.kategori_barang_id ? result.data.kategori_barang_id.toString() : "",
          satuan_barang_id: result.data.satuan_barang_id ? result.data.satuan_barang_id.toString() : "",
          spesifikasi: result.data.spesifikasi || "",
          stok: result.data.stok || "0",
          stok_minimum: result.data.stok_minimum ? result.data.stok_minimum.toString() : "0",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching detail:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch kategori untuk dropdown
  const fetchKategori = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/kategori/dropdown`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Kategori List:", result); // Debug log
      if (result.success) {
        setKategoriList(result.data);
      }
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  // Fetch satuan untuk dropdown
  const fetchSatuan = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/satuan/dropdown`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("Satuan List:", result); // Debug log
      if (result.success) {
        setSatuanList(result.data);
      }
    } catch (err) {
      console.error("Gagal mengambil satuan:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBarangDetail();
      fetchKategori();
      fetchSatuan();
    }
  }, [id]);

  // Handle perubahan form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    if (!formData.nama_barang.trim()) {
      alert("Nama barang harus diisi");
      return false;
    }
    if (!formData.kategori_barang_id) {
      alert("Kategori harus dipilih");
      return false;
    }
    if (!formData.satuan_barang_id) {
      alert("Satuan harus dipilih");
      return false;
    }
    return true;
  };

  // Handle submit untuk update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Pastikan data dikirim dengan format yang benar
      const updateData = {
        nama_barang: formData.nama_barang.trim(),
        kategori_barang_id: parseInt(formData.kategori_barang_id), // Konversi ke number
        satuan_barang_id: parseInt(formData.satuan_barang_id), // Konversi ke number
        spesifikasi: formData.spesifikasi.trim(),
        stok_minimum: 0,
        // kode_barang dan stok biasanya tidak diupdate, tapi jika diperlukan:
        // kode_barang: formData.kode_barang,
        // stok: parseInt(formData.stok)
      };

      console.log("Data yang akan dikirim:", updateData); // Debug log

      const response = await fetch(`${API_URL}/admin/barang/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      console.log("Response dari server:", result); // Debug log
      
      if (result.success) {
        alert("Data barang berhasil diupdate!");
        setIsEditMode(false);
        fetchBarangDetail(); // Refresh data
      } else {
        // Tampilkan error spesifik dari server
        const errorMessage = result.error || 
                           result.message || 
                           "Gagal mengupdate data";
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message);
      alert("Gagal mengupdate data: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus barang ini?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/barang/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        alert("Data barang berhasil dihapus!");
        router.push("/GA/data_barang");
      } else {
        throw new Error(result.error || "Gagal menghapus data");
      }
    } catch (err) {
      setError(err.message);
      alert("Gagal menghapus data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Jika batal, reload data asli
      fetchBarangDetail();
    }
    setIsEditMode(!isEditMode);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen font-poppins bg-gray-100">
        <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
          <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-gray-200">
            <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
          </div>
          <div className="flex-1 h-16 flex items-center px-8"></div>
        </header>
        <div className="flex flex-1 overflow-hidden pt-16">
          <aside className="w-60 bg-blue-900 text-white flex flex-col fixed left-0 top-16 bottom-0"></aside>
          <main className="flex-1 flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data barang...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content - Scrollable dengan padding yang lebih baik */}
        <main className="flex-1 text-black p-6 bg-gray-200 overflow-y-auto ml-60">
          {/* Fixed header untuk judul halaman */}
          <div className="bg-gray-200 mb-6">
            <h2 className="text-3xl text-black font-semibold">Barang</h2>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header atas card */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Detail Barang
              </h3>
              <Link href="/GA/data_barang">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Error message */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Isi form */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Kode Barang */}
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">
                      Kode Barang
                    </label>
                    <input
                      type="text"
                      name="kode_barang"
                      value={formData.kode_barang}
                      onChange={handleChange}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-800"
                    />
                  </div>

                  {/* Nama Barang */}
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">
                      Nama Barang *
                    </label>
                    <input
                      type="text"
                      name="nama_barang"
                      value={formData.nama_barang}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                      required
                    />
                  </div>

                  {/* Dropdown Kategori */}
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">
                      Kategori Barang *
                    </label>
                    <select
                      name="kategori_barang_id"
                      value={formData.kategori_barang_id}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {kategoriList.map((kategori) => (
                        <option key={kategori.id} value={kategori.id.toString()}>
                          {kategori.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Satuan */}
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">
                      Satuan *
                    </label>
                    <select
                      name="satuan_barang_id"
                      value={formData.satuan_barang_id}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                      required
                    >
                      <option value="">Pilih Satuan</option>
                      {satuanList.map((satuan) => (
                        <option key={satuan.id} value={satuan.id.toString()}>
                          {satuan.nama_satuan}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Spesifikasi */}
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">
                      Spesifikasi
                    </label>
                    <input
                      type="text"
                      name="spesifikasi"
                      value={formData.spesifikasi}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 text-sm ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                      placeholder="Contoh: Ukuran, warna, merk, dll"
                    />
                  </div>

                  {/* Stok */}
                  <div>
                    <label className="block font-medium text-sm text-gray-700 mb-1">
                      Stok
                    </label>
                    <input
                      type="number"
                      name="stok"
                      value={formData.stok}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-800"
                    />
                  </div>
                </div>

                {/* Informasi */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-gray-700 mb-2 text-sm flex items-center">
                    <span className="mr-2">📝</span> Informasi
                  </h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Field dengan tanda * wajib diisi.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Klik tombol <span className="font-medium">Ubah</span> untuk mengedit data.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Klik tombol <span className="font-medium">Simpan</span> setelah selesai mengedit.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Klik tombol <span className="font-medium">Batal</span> untuk membatalkan perubahan.</span>
                    </li>
                  </ul>
                </div>

                {/* Tombol Hapus, Ubah, Simpan */}
                <div className="flex justify-end mt-8 gap-2">
                  {/* Tombol Hapus */}
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDelete}
                    disabled={loading || saving}
                  >
                    Hapus
                  </button>

                  {/* Tombol Ubah / Batal */}
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className={`font-medium px-5 py-2 rounded text-sm transition-colors ${
                      isEditMode
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={loading || saving}
                  >
                    {isEditMode ? "Batal" : "Ubah"}
                  </button>

                  {/* Tombol Simpan */}
                  <button
                    type="submit"
                    disabled={!isEditMode || saving}
                    className={`px-5 py-2 font-medium rounded text-sm transition-colors ${
                      isEditMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>
            </form>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}