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
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      {/* Header */}
      <header className="flex bg-white shadow-sm items-center">
        <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-20 flex items-center px-8"></div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (sama seperti sebelumnya) */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1">
          {/* ... Sidebar content sama ... */}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Barang</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Tambah Barang
              </h3>
              <Link href="/GA/data_barang">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
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
                    <label className="font-medium text-gray-700">
                      Kode Barang *
                    </label>
                    <input
                      type="text"
                      name="kode_barang"
                      value={formData.kode_barang}
                      onChange={handleChange}
                      className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      placeholder="Contoh: KB-001"
                    />
                  </div>

                  {/* Nama Barang */}
                  <div>
                    <label className="font-medium text-gray-700">
                      Nama Barang *
                    </label>
                    <input
                      type="text"
                      name="nama_barang"
                      value={formData.nama_barang}
                      onChange={handleChange}
                      className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      placeholder="Contoh: Laptop Dell"
                    />
                  </div>

                  {/* Kategori Barang (Dropdown) */}
                  <div>
                    <label className="font-medium text-gray-700">
                      Kategori Barang *
                    </label>
                    <select
                      name="kategori_barang_id"
                      value={formData.kategori_barang_id}
                      onChange={handleChange}
                      className="w-full border border-gray-400 rounded px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    <label className="font-medium text-gray-700">
                      Satuan *
                    </label>
                    <select
                      name="satuan_barang_id"
                      value={formData.satuan_barang_id}
                      onChange={handleChange}
                      className="w-full border border-gray-400 rounded px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    <label className="font-medium text-gray-700">
                      Spesifikasi
                    </label>
                    <input
                      type="text"
                      name="spesifikasi"
                      value={formData.spesifikasi}
                      onChange={handleChange}
                      className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Contoh: Core i5, 8GB RAM"
                    />
                  </div>

                  {/* Stok Minimum */}
                  <div>
                    <label className="font-medium text-gray-700">
                      Stok Minimum
                    </label>
                    <input
                      type="number"
                      name="stok_minimum"
                      value={formData.stok_minimum}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {/* Tombol Tambah */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2 rounded text-white font-medium ${
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
