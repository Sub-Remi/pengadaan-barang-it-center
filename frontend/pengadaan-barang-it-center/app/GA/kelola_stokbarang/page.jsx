"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3200/api";

export default function KelolaStokBarangPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [stok, setStok] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch detail barang
  useEffect(() => {
    if (id) {
      fetchBarang(id);
    } else {
      setError("ID barang tidak ditemukan");
      setLoading(false);
    }
  }, [id]);

  const fetchBarang = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/stok/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data barang");

      const result = await response.json();
      if (result.success) {
        setBarang(result.data);
        setStok(result.data.stok);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTambahStok = async () => {
    if (!isEditMode) return;

    setSaving(true);
    try {
      const jumlahDitambahkan = stok - barang.stok;
      if (jumlahDitambahkan <= 0) {
        alert("Jumlah stok yang ditambahkan harus lebih dari 0!");
        setSaving(false);
        return;
      }

      const response = await fetch(`${API_URL}/admin/stok/${id}/tambah`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tambah_stok: jumlahDitambahkan }),
      });

      const result = await response.json();
      if (result.success) {
        alert(
          `Stok berhasil ditambahkan ${jumlahDitambahkan} unit! Stok baru: ${result.data.new_stok}`
        );
        setIsEditMode(false);
        fetchBarang(id); // Refresh data
      } else {
        alert(result.error || "Gagal menambah stok");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menambah stok");
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit, reset to original stok
      setStok(barang.stok);
    }
    setIsEditMode(!isEditMode);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading data barang...</div>
      </div>
    );
  }

  if (error || !barang) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">
          {error || "Data barang tidak ditemukan"}
        </div>
        <Link href="/GA/data_stokbarang">
          <button className="ml-4 bg-teal-600 text-white px-4 py-2 rounded">
            Kembali
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      {/* Header dan Sidebar sama seperti sebelumnya */}
      {/* ... */}

      <main className="flex-1 p-8 bg-gray-200">
        <h2 className="text-3xl font-semibold mb-6">Stok Barang</h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header atas */}
          <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
            <h3 className="text-xl font-semibold text-teal-600">
              Kelola Stok Barang
            </h3>
            <Link href="/GA/data_stokbarang">
              <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                &lt; Kembali
              </button>
            </Link>
          </div>

          {/* Isi form */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kategori Barang */}
              <div>
                <label className="font-medium text-gray-700">
                  Kategori Barang
                </label>
                <input
                  type="text"
                  value={barang.nama_kategori || "N/A"}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-100 text-gray-800"
                />
              </div>

              {/* Kode Barang */}
              <div>
                <label className="font-medium text-gray-700">Kode Barang</label>
                <input
                  type="text"
                  value={barang.kode_barang}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-100 text-gray-800"
                />
              </div>

              {/* Nama Barang */}
              <div>
                <label className="font-medium text-gray-700">Nama Barang</label>
                <input
                  type="text"
                  value={barang.nama_barang}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-100 text-gray-800"
                />
              </div>

              {/* Spesifikasi */}
              <div>
                <label className="font-medium text-gray-700">Spesifikasi</label>
                <input
                  type="text"
                  value={barang.spesifikasi || "Tidak ada spesifikasi"}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-100 text-gray-800"
                />
              </div>

              {/* Satuan */}
              <div>
                <label className="font-medium text-gray-700">Satuan</label>
                <input
                  type="text"
                  value={barang.nama_satuan}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-100 text-gray-800"
                />
              </div>

              {/* Stok Sekarang */}
              <div>
                <label className="font-medium text-gray-700">
                  Stok Saat Ini
                </label>
                <input
                  type="number"
                  value={barang.stok}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-gray-100 text-gray-800"
                />
              </div>

              {/* Tambah Stok (hanya bisa diisi saat edit mode) */}
              <div>
                <label className="font-medium text-gray-700">Tambah Stok</label>
                <input
                  type="number"
                  min="1"
                  value={isEditMode ? stok - barang.stok : 0}
                  onChange={(e) => {
                    const tambah = parseInt(e.target.value) || 0;
                    setStok(barang.stok + tambah);
                  }}
                  disabled={!isEditMode}
                  className={`w-full border rounded px-3 py-2 mt-1 transition ${
                    isEditMode
                      ? "border-gray-300 bg-white text-gray-800"
                      : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Stok Baru (hanya tampil saat edit mode) */}
              {isEditMode && (
                <div>
                  <label className="font-medium text-gray-700">
                    Stok Baru Akan Menjadi
                  </label>
                  <input
                    type="number"
                    value={stok}
                    disabled
                    className="w-full border rounded px-3 py-2 mt-1 transition border-gray-300 bg-blue-100 text-blue-800 font-bold"
                  />
                </div>
              )}
            </div>

            {/* Tombol Simpan dan Ubah */}
            <div className="flex justify-end mt-8 gap-2">
              <button
                onClick={handleEditToggle}
                className={`${
                  isEditMode
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-5 py-2 rounded`}
                disabled={saving}
              >
                {isEditMode ? "Batal" : "Tambah Stok"}
              </button>
              {isEditMode && (
                <button
                  onClick={handleTambahStok}
                  disabled={saving || stok <= barang.stok}
                  className={`px-5 py-2 font-medium rounded text-white transition ${
                    saving || stok <= barang.stok
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              )}
            </div>

            {/* Info */}
            {isEditMode && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded">
                <p>
                  <strong>Info:</strong> Stok akan ditambahkan sejumlah yang
                  Anda input. Stok saat ini: <strong>{barang.stok}</strong>,
                  Stok baru: <strong>{stok}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Garis bawah hijau */}
          <div className="h-1 bg-teal-600 w-full"></div>
        </div>
      </main>
    </div>
  );
}
