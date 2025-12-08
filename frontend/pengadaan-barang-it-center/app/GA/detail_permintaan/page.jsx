"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Komponen Form Penolakan untuk Modal
const FormPenolakanModal = ({
  isOpen,
  onClose,
  onConfirm,
  catatan,
  onCatatanChange,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          Konfirmasi Penolakan
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alasan Penolakan
          </label>
          <textarea
            value={catatan}
            onChange={onCatatanChange}
            placeholder="Masukkan alasan penolakan barang..."
            className="w-full border border-red-300 rounded px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows="3"
          />
          <p className="text-red-500 text-sm mt-1">
            * Catatan wajib diisi untuk penolakan
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !catatan.trim()}
            className={`px-4 py-2 rounded text-white transition ${
              !catatan.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Memproses..." : "Konfirmasi Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DetailPermintaanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [permintaanData, setPermintaanData] = useState(null);
  const [barangData, setBarangData] = useState([]);
  const [catatanTolakMap, setCatatanTolakMap] = useState({}); // Untuk menyimpan catatan per barang

  // State untuk modal penolakan
  const [modalTolak, setModalTolak] = useState({
    isOpen: false,
    barangId: null,
    barangNama: "",
    catatan: "",
  });

  // Fetch detail permintaan
  const fetchPermintaanDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

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

  // Buka modal penolakan
  const openModalTolak = (barangId, barangNama) => {
    setModalTolak({
      isOpen: true,
      barangId,
      barangNama,
      catatan: "",
    });
  };

  // Tutup modal penolakan
  const closeModalTolak = () => {
    setModalTolak({
      isOpen: false,
      barangId: null,
      barangNama: "",
      catatan: "",
    });
  };

  // Perbaiki fungsi handleUpdateBarangStatus
  const handleUpdateBarangStatus = async (
    barangId,
    status,
    catatanAdmin = ""
  ) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      console.log(`🔄 Mengupdate barang ${barangId} ke status ${status}`);

      const response = await fetch(
        `http://localhost:3200/api/admin/barang/${barangId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            catatan_admin: status === "ditolak" ? catatanAdmin : null,
          }),
        }
      );

      // Cek jika response tidak OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response not OK:", response.status, errorText);

        try {
          const errorData = JSON.parse(errorText);
          setError(
            errorData.error ||
              `Error ${response.status}: ${response.statusText}`
          );
        } catch (e) {
          setError(`Error ${response.status}: ${response.statusText}`);
        }

        return;
      }

      const result = await response.json();

      console.log("✅ API Response:", result);

      if (result.message) {
        setSuccess(result.message);
      } else {
        setSuccess(`Status barang berhasil diubah menjadi ${status}`);
      }

      // Jika ini penolakan, tutup modal
      if (status === "ditolak") {
        closeModalTolak();
      }

      // Refresh data dengan delay kecil
      setTimeout(() => {
        fetchPermintaanDetail();
      }, 500);
    } catch (error) {
      console.error("💥 Network error:", error);
      setError("Terjadi kesalahan koneksi. Periksa console untuk detail.");
    } finally {
      setSaving(false);
    }
  };

  // Handle validasi barang (tanpa catatan)
  const handleValidasiBarang = async (barangId) => {
    if (
      !confirm(
        "Apakah yakin ingin memvalidasi barang ini?\n\nStatus akan berubah menjadi 'Selesai' dan stok akan dikurangi."
      )
    )
      return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3200/api/admin/barang/${barangId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "selesai",
            catatan_admin: null,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccess("Barang berhasil divalidasi. Stok telah dikurangi.");
        fetchPermintaanDetail();
      } else {
        setError(result.error || "Gagal memvalidasi barang");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat memvalidasi");
    } finally {
      setSaving(false);
    }

    await handleUpdateBarangStatus(barangId, "selesai", "");
  };

  // Handle konfirmasi penolakan dari modal
  const handleKonfirmasiPenolakan = () => {
    if (!modalTolak.catatan.trim()) {
      setError("Harap berikan alasan penolakan");
      return;
    }

    handleUpdateBarangStatus(
      modalTolak.barangId,
      "ditolak",
      modalTolak.catatan
    );
  };

  // Fungsi untuk mengajukan pembelian
  const handleAjukanPembelian = async (barangId, barangData) => {
    if (
      !confirm(
        `Apakah yakin ingin mengajukan pembelian untuk:\n${barangData.nama_barang} (${barangData.jumlah} unit)?`
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      // 1. Ubah status barang menjadi "dalam pemesanan"
      const statusResponse = await fetch(
        `http://localhost:3200/api/admin/barang/${barangId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "dalam pemesanan",
            catatan_admin: null,
          }),
        }
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        throw new Error(`Gagal mengubah status: ${errorText}`);
      }

      // 2. Buat record pemesanan
      const pemesananResponse = await fetch(
        `http://localhost:3200/api/admin/pemesanan`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barang_permintaan_id: barangId,
            tanggal_pemesanan: new Date().toISOString().split("T")[0],
            estimasi_selesai: "", // Optional
            catatan: `Pemesanan untuk ${barangData.nama_barang}`,
          }),
        }
      );

      if (!pemesananResponse.ok) {
        const errorText = await pemesananResponse.text();
        throw new Error(`Gagal membuat pemesanan: ${errorText}`);
      }

      setSuccess("Barang berhasil diajukan untuk pembelian!");

      // Redirect ke halaman list pemesanan setelah 2 detik
      setTimeout(() => {
        router.push("/GA/list_pemesanan");
      }, 2000);
    } catch (error) {
      console.error("💥 Error ajukan pembelian:", error);
      setError(error.message || "Terjadi kesalahan saat mengajukan pembelian.");
    } finally {
      setSaving(false);
    }
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
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "menunggu validasi":
        return "bg-yellow-100 text-yellow-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "dalam pemesanan":
        return "bg-purple-100 text-purple-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "menunggu":
        return "Menunggu";
      case "menunggu validasi":
        return "Menunggu Validasi";
      case "diproses":
        return "Diproses";
      case "dalam pemesanan":
        return "Dalam Pemesanan";
      case "selesai":
        return "Selesai";
      case "ditolak":
        return "Ditolak";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  // Hitung statistik barang untuk info
  const getBarangStats = () => {
    const total = barangData.length;
    const selesai = barangData.filter((b) => b.status === "selesai").length;
    const ditolak = barangData.filter((b) => b.status === "ditolak").length;
    const menunggu = barangData.filter(
      (b) => b.status === "menunggu validasi"
    ).length;
    const diproses = barangData.filter(
      (b) => b.status === "diproses" || b.status === "dalam pemesanan"
    ).length;

    return { total, selesai, ditolak, menunggu, diproses };
  };

  // Handle catatan perubahan
  const handleCatatanChange = (barangId, value) => {
    setCatatanTolakMap((prev) => ({
      ...prev,
      [barangId]: value,
    }));
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="ml-2">Memuat data...</p>
      </div>
    );
  }

  if (!permintaanData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Data permintaan tidak ditemukan</p>
      </div>
    );
  }

  const stats = getBarangStats();

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
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
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

        {/* Modal untuk penolakan */}
        <FormPenolakanModal
          isOpen={modalTolak.isOpen}
          onClose={closeModalTolak}
          onConfirm={handleKonfirmasiPenolakan}
          catatan={modalTolak.catatan}
          onCatatanChange={(e) =>
            setModalTolak((prev) => ({ ...prev, catatan: e.target.value }))
          }
          loading={saving}
        />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200 overflow-y-auto ml-60">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Permintaan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Detail Permintaan
              </h3>
              <Link href="/GA/data_permintaan">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded transition">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Notifikasi */}
            {(error || success) && (
              <div
                className={`px-6 py-4 ${
                  error
                    ? "bg-red-100 text-red-700 border-l-4 border-red-500"
                    : "bg-green-100 text-green-700 border-l-4 border-green-500"
                }`}
              >
                {error || success}
              </div>
            )}

            {/* Data Permintaan */}
            <div className="px-6 py-4 border-b">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Data Permintaan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    ID Permintaan
                  </label>
                  <input
                    type="text"
                    value={
                      permintaanData.nomor_permintaan ||
                      `PB-${permintaanData.id}`
                    }
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Status Permintaan
                  </label>
                  <div
                    className={`px-3 py-2 rounded font-semibold ${getStatusColor(
                      permintaanData.status
                    )}`}
                  >
                    {getStatusText(permintaanData.status)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stats.selesai} selesai, {stats.ditolak} ditolak,{" "}
                    {stats.menunggu + stats.diproses} dalam proses
                  </div>
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Nama Pemohon
                  </label>
                  <input
                    type="text"
                    value={permintaanData.nama_lengkap || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">Divisi</label>
                  <input
                    type="text"
                    value={permintaanData.nama_divisi || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">Email</label>
                  <input
                    type="text"
                    value={permintaanData.email || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Tanggal Permintaan
                  </label>
                  <input
                    type="text"
                    value={formatDate(permintaanData.created_at)}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Tanggal Kebutuhan
                  </label>
                  <input
                    type="text"
                    value={formatDate(permintaanData.tanggal_kebutuhan)}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Jumlah Barang
                  </label>
                  <input
                    type="text"
                    value={`${barangData.length} jenis barang`}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                  />
                </div>

                {permintaanData.catatan && (
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700 block mb-1">
                      Judul Permintaan
                    </label>
                    <textarea
                      value={permintaanData.catatan}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                      rows="2"
                    />
                  </div>
                )}
              </div>

              {/* INFO STATUS PERMINTAAN OTOMATIS */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h5 className="font-semibold text-blue-800 mb-2">
                  📊 Status Permintaan Otomatis
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-green-600">✅ Selesai</div>
                    <div className="text-gray-600 mt-1">
                      Jika semua barang{" "}
                      <span className="font-semibold">Selesai</span>, atau ada
                      yang Selesai dan ada yang Ditolak
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-red-600">❌ Ditolak</div>
                    <div className="text-gray-600 mt-1">
                      Jika semua barang{" "}
                      <span className="font-semibold">Ditolak</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-600">🔄 Diproses</div>
                    <div className="text-gray-600 mt-1">
                      Jika masih ada barang yang{" "}
                      <span className="font-semibold">
                        Menunggu Validasi, Diproses, atau Dalam Pemesanan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daftar Barang */}
            {barangData.map((barang, index) => (
              <div
                key={barang.id}
                className="px-6 py-4 border-b"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Data Barang {index + 1}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1">
                      ID Barang: {barang.id}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                      barang.status
                    )}`}
                  >
                    {getStatusText(barang.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Kategori Barang
                    </label>
                    <input
                      type="text"
                      value={barang.kategori_barang || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Nama Barang
                    </label>
                    <input
                      type="text"
                      value={barang.nama_barang || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Spesifikasi
                    </label>
                    <input
                      type="text"
                      value={barang.spesifikasi || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 block mb-1">
                      Jumlah Diminta
                    </label>
                    <input
                      type="text"
                      value={barang.jumlah || 0}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                    />
                  </div>

                  {barang.stok_barang && (
                    <>
                      <div>
                        <label className="font-medium text-gray-700 block mb-1">
                          Stok Tersedia
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={barang.stok_barang.stok || 0}
                            disabled
                            className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                          />
                          <span className="ml-2 text-gray-600">
                            {barang.stok_barang.nama_satuan || "unit"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="font-medium text-gray-700 block mb-1">
                          Status Stok
                        </label>
                        <div
                          className={`px-3 py-2 rounded ${
                            (barang.stok_barang.stok || 0) >=
                            (barang.jumlah || 0)
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {(barang.stok_barang.stok || 0) >=
                          (barang.jumlah || 0)
                            ? "✅ Stok mencukupi"
                            : "⚠️ Stok tidak mencukupi"}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700 block mb-1">
                      Keterangan Pemohon
                    </label>
                    <textarea
                      value={barang.keterangan || "-"}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                      rows="2"
                    />
                  </div>

                  {barang.catatan_admin && (
                    <div className="md:col-span-2">
                      <label className="font-medium text-gray-700 block mb-1">
                        Catatan Admin
                      </label>
                      <textarea
                        value={barang.catatan_admin}
                        disabled
                        className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2"
                        rows="2"
                      />
                    </div>
                  )}
                </div>

                {/* AKSI BARANG */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Aksi Barang
                  </h4>

                  <div className="space-y-3">
                    {/* Status: Menunggu Validasi */}
                    {barang.status === "menunggu validasi" && (
                      <>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              handleAjukanPembelian(barang.id, barang)
                            }
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2 transition"
                          >
                            <span>📋 Ajukan Pembelian</span>
                          </button>

                          <button
                            onClick={() => handleValidasiBarang(barang.id)}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2 transition"
                          >
                            <span>✅ Validasi</span>
                          </button>

                          <button
                            onClick={() =>
                              openModalTolak(barang.id, barang.nama_barang)
                            }
                            disabled={saving}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2 transition"
                          >
                            <span>❌ Tolak</span>
                          </button>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            •{" "}
                            <span className="font-semibold">
                              Ajukan Pembelian
                            </span>
                            : Untuk barang yang perlu dibeli (diteruskan ke
                            Finance)
                          </p>
                          <p>
                            •{" "}
                            <span className="font-semibold text-green-600">
                              Validasi
                            </span>
                            : Barang ada di stok, stok akan langsung dikurangi
                          </p>
                          <p>
                            •{" "}
                            <span className="font-semibold text-red-600">
                              Tolak
                            </span>
                            : Barang ditolak dengan alasan tertentu
                          </p>
                        </div>
                      </>
                    )}

                    {/* Status: Diproses */}
                    {barang.status === "diproses" && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            handleAjukanPembelian(barang.id, barang)
                          }
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
                        >
                          Lihat Proses Pembelian
                        </button>
                      </div>
                    )}

                    {/* Status: Dalam Pemesanan */}
                    {barang.status === "dalam pemesanan" && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            handleAjukanPembelian(barang.id, barang)
                          }
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition"
                        >
                          Pantau Pemesanan
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateBarangStatus(
                              barang.id,
                              "selesai",
                              "Pemesanan selesai"
                            )
                          }
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded transition"
                        >
                          Tandai Selesai
                        </button>
                      </div>
                    )}

                    {/* Status: Selesai */}
                    {barang.status === "selesai" && (
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-green-50 border border-green-200 rounded px-4 py-3">
                          <p className="text-green-700 font-medium">
                            ✅ Barang telah divalidasi
                          </p>
                          <p className="text-green-600 text-sm mt-1">
                            Stok telah dikurangi sebanyak {barang.jumlah} unit
                            {barang.stok_barang &&
                              ` (tersisa ${barang.stok_barang.stok} unit)`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status: Ditolak */}
                    {barang.status === "ditolak" && (
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-red-50 border border-red-200 rounded px-4 py-3">
                          <p className="text-red-700 font-medium">
                            ❌ Barang ditolak
                          </p>
                          {barang.catatan_admin && (
                            <p className="text-red-600 text-sm mt-1">
                              Alasan: {barang.catatan_admin}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleUpdateBarangStatus(
                              barang.id,
                              "menunggu validasi",
                              "Reset status"
                            )
                          }
                          disabled={saving}
                          className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded transition"
                        >
                          Reset ke Menunggu Validasi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Tombol Refresh */}
            <div className="flex justify-end px-6 py-5 gap-3">
              <button
                onClick={() => fetchPermintaanDetail()}
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2 rounded transition"
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