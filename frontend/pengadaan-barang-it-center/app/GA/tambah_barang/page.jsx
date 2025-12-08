"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200/api";

export default function TambahBarangPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    kode_barang: "",
    kategori_barang_id: "",
    nama_barang: "",
    spesifikasi: "",
    satuan_barang_id: "",
    stok_minimum: 0,
  });
  const [kategoriList, setKategoriList] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch kategori dan satuan untuk dropdown
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch kategori
        const kategoriRes = await fetch(`${API_URL}/admin/kategori/dropdown`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const kategoriData = await kategoriRes.json();
        if (kategoriData.success) {
          setKategoriList(kategoriData.data);
        }

        // Fetch satuan
        const satuanRes = await fetch(`${API_URL}/admin/satuan/dropdown`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const satuanData = await satuanRes.json();
        if (satuanData.success) {
          setSatuanList(satuanData.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data dropdown:", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi
      if (
        !formData.kode_barang ||
        !formData.nama_barang ||
        !formData.kategori_barang_id ||
        !formData.satuan_barang_id
      ) {
        setError("Kode, Nama, Kategori, dan Satuan harus diisi!");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/barang`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          stok: 0, // Default stok 0
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Barang berhasil ditambahkan!");
        router.push("/GA/data_barang");
      } else {
        setError(result.error || "Gagal menambahkan barang");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan barang");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-gray-200">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8"></div>
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

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200 overflow-y-auto ml-60">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Barang</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Tambah Barang
              </h3>
              <Link href="/GA/data_barang">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Form Input */}
            <div className="px-8 py-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Kode Barang */}
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Kode Barang *
                    </label>
                    <input
                      type="text"
                      name="kode_barang"
                      value={formData.kode_barang}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                      placeholder="Contoh: KB-001"
                    />
                  </div>

                  {/* Nama Barang */}
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Nama Barang *
                    </label>
                    <input
                      type="text"
                      name="nama_barang"
                      value={formData.nama_barang}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                      placeholder="Contoh: Laptop Dell"
                    />
                  </div>

                  {/* Kategori Barang (Dropdown) */}
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Kategori Barang *
                    </label>
                    <select
                      name="kategori_barang_id"
                      value={formData.kategori_barang_id}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {kategoriList.map((kategori) => (
                        <option key={kategori.id} value={kategori.id}>
                          {kategori.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Satuan */}
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Satuan *
                    </label>
                    <select
                      name="satuan_barang_id"
                      value={formData.satuan_barang_id}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    >
                      <option value="">-- Pilih Satuan --</option>
                      {satuanList.map((satuan) => (
                        <option key={satuan.id} value={satuan.id}>
                          {satuan.nama_satuan}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Spesifikasi */}
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Spesifikasi
                    </label>
                    <input
                      type="text"
                      name="spesifikasi"
                      value={formData.spesifikasi}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Contoh: Core i5, 8GB RAM"
                    />
                  </div>

                  {/* Stok Minimum */}
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Stok Minimum
                    </label>
                    <input
                      type="number"
                      name="stok_minimum"
                      value={formData.stok_minimum}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-6 p-3 bg-red-100 text-red-700 rounded border border-red-300">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {/* Tombol Tambah */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2.5 rounded text-white font-medium transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {loading ? "Menambahkan..." : "Tambah Barang"}
                  </button>
                </div>
              </form>
            </div>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}