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
      <div className="flex justify-center items-center h-screen">
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
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Dashboard</li>
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
          <h2 className="text-3xl font-semibold mb-6">Barang</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">Detail Barang</h3>
              <Link href="/GA/data_barang">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Error message */}
            {error && (
              <div className="px-6 py-4 bg-red-100 text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Isi form */}
            <form onSubmit={handleSubmit}>
              <div className="px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Kode Barang */}
                  <div>
                    <label className="font-medium text-gray-700">Kode Barang</label>
                    <input
                      type="text"
                      name="kode_barang"
                      value={formData.kode_barang}
                      onChange={handleChange}
                      disabled
                      className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-300 text-gray-800"
                    />
                  </div>

                  {/* Nama Barang */}
                  <div>
                    <label className="font-medium text-gray-700">Nama Barang</label>
                    <input
                      type="text"
                      name="nama_barang"
                      value={formData.nama_barang}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 mt-1 transition ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                          : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                      required
                    />
                  </div>

                  {/* Dropdown Kategori */}
                  <div>
                    <label className="font-medium text-gray-700">Kategori Barang</label>
                    <select
                      name="kategori_barang_id"
                      value={formData.kategori_barang_id}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 mt-1 transition ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
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
                    <label className="font-medium text-gray-700">Satuan</label>
                    <select
                      name="satuan_barang_id"
                      value={formData.satuan_barang_id}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 mt-1 transition ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
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
                    <label className="font-medium text-gray-700">Spesifikasi</label>
                    <input
                      type="text"
                      name="spesifikasi"
                      value={formData.spesifikasi}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full border rounded px-3 py-2 mt-1 transition ${
                        isEditMode
                          ? "border-gray-300 bg-white text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                          : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>

                  {/* Stok */}
                  <div>
                    <label className="font-medium text-gray-700">Stok</label>
                    <input
                      type="number"
                      name="stok"
                      value={formData.stok}
                      disabled
                      className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-300 text-gray-800"
                    />
                  </div>
                </div>

                {/* Tombol Hapus, Ubah, Simpan */}
                <div className="flex justify-end mt-8 gap-2">

                  {/* Tombol Hapus */}
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Hapus
                  </button>

                  {/* Tombol Ubah / Batal */}
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className={`${
                      isEditMode
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-5 py-2 rounded transition`}
                    disabled={loading || saving}
                  >
                    {isEditMode ? "Batal" : "Ubah"}
                  </button>

                  {/* Tombol Simpan */}
                  <button
                    type="submit"
                    disabled={!isEditMode || saving}
                    className={`px-5 py-2 font-medium rounded text-white transition ${
                      isEditMode
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
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