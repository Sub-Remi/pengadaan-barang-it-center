"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import permintaanService from "../../../lib/permintaanService";
import authService from "../../../lib/authService";
import ProtectedRoute from "../../../app/components/ProtectedRoute";
import divisiPemohonService from "../../../lib/divisiPemohonService";

export default function DetailPermintaanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permintaan, setPermintaan] = useState(null);
  const [userData, setUserData] = useState(null);
  const [divisiList, setDivisiList] = useState([]);
  const [catatanData, setCatatanData] = useState({});

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format status
  const formatStatus = (status) => {
    const statusMap = {
      draft: { text: "Draft", color: "bg-gray-500" },
      menunggu: { text: "Menunggu Validasi", color: "bg-yellow-500" },
      diproses: { text: "Diproses", color: "bg-blue-500" },
      selesai: { text: "Selesai", color: "bg-green-600" },
      ditolak: { text: "Ditolak", color: "bg-red-500" },
    };
    return statusMap[status] || { text: status, color: "bg-gray-500" };
  };

  // Format status barang
  const formatStatusBarang = (status) => {
    const statusMap = {
      "menunggu validasi": {
        text: "Menunggu Validasi",
        color: "bg-yellow-500",
      },
      validasi: { text: "Divalidasi", color: "bg-green-100 text-green-800" },
      diproses: { text: "Diproses", color: "bg-blue-100 text-blue-800" },
      "dalam pemesanan": {
        text: "Dalam Pemesanan",
        color: "bg-purple-100 text-purple-800",
      },
      selesai: { text: "Selesai", color: "bg-green-600 text-white" },
      ditolak: { text: "Ditolak", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[status] || { text: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  // Fungsi untuk mendapatkan catatan penolakan dari berbagai field yang mungkin
  const getCatatanPenolakan = (barang) => {
    return (
      barang.catatan_admin ||
      barang.alasan_penolakan ||
      barang.catatan ||
      barang.keterangan_penolakan ||
      ""
    );
  };

  // Load divisi data
  useEffect(() => {
    const loadDivisi = async () => {
      try {
        const data = await divisiPemohonService.getDivisiDropdown();
        setDivisiList(data);
      } catch (error) {
        console.error("Gagal memuat divisi:", error);
        setDivisiList([]);
      }
    };
    loadDivisi();
  }, []);

  // Load permintaan detail dan catatan
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("ID permintaan tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Load user data
        const user = authService.getCurrentUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUserData(user);

        // Load permintaan detail
        const response = await permintaanService.getDetailPermintaan(id);

        // Cek apakah user memiliki akses ke permintaan ini
        if (user.role === "pemohon" && response.data.user_id !== user.id) {
          setError("Anda tidak memiliki akses ke permintaan ini");
          setLoading(false);
          return;
        }

        setPermintaan(response.data);

        // Ambil data barang dan simpan catatan
        const barangList = response.data.barang?.data || response.data.barang || [];
        const catatanMap = {};
        barangList.forEach(barang => {
          if (barang.status === 'ditolak' || barang.catatan_admin) {
            catatanMap[barang.id] = getCatatanPenolakan(barang);
          }
        });
        setCatatanData(catatanMap);

      } catch (error) {
        console.error("❌ Error loading permintaan:", error);
        setError(
          error.response?.data?.error ||
            error.error ||
            "Gagal memuat detail permintaan"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, router]);

  // Get divisi name by ID
  const getDivisiName = (divisiId) => {
    if (!divisiId) return "-";
    const divisi = divisiList.find((d) => d.id === divisiId);
    return divisi ? divisi.nama_divisi : "Divisi tidak ditemukan";
  };

  if (loading) {
    return (
      <div className="flex h-screen font-poppins bg-gray-100">
        <aside className="w-60 bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-full">
          <div className="h-20 border-b border-white flex items-center justify-center bg-white">
            <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
          </div>
        </aside>
        <div className="flex flex-col flex-1 ml-60">
          <header className="flex bg-white shadow-sm items-center h-20">
            <div className="flex-1 h-full flex items-center px-8"></div>
          </header>
          <main className="flex-1 p-8 bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600">Memuat detail permintaan...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen font-poppins bg-gray-100">
        <aside className="w-60 bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-full">
          <div className="h-20 border-b border-white flex items-center justify-center bg-white">
            <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
          </div>
        </aside>
        <div className="flex flex-col flex-1 ml-60">
          <header className="flex bg-white shadow-sm items-center h-20">
            <div className="flex-1 h-full flex items-center px-8"></div>
          </header>
          <main className="flex-1 p-8 bg-gray-200">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">
                  Terjadi Kesalahan
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link href="/Divisi/permintaan_divisi">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
                    Kembali ke Daftar Permintaan
                  </button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!permintaan) {
    return (
      <div className="flex h-screen font-poppins bg-gray-100">
        <aside className="w-60 bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-full">
          <div className="h-20 border-b border-white flex items-center justify-center bg-white">
            <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
          </div>
        </aside>
        <div className="flex flex-col flex-1 ml-60">
          <header className="flex bg-white shadow-sm items-center h-20">
            <div className="flex-1 h-full flex items-center px-8"></div>
          </header>
          <main className="flex-1 p-8 bg-gray-200">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Permintaan Tidak Ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  Data permintaan yang Anda cari tidak ditemukan.
                </p>
                <Link href="/Divisi/permintaan_divisi">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">
                    Kembali ke Daftar Permintaan
                  </button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Ambil data barang
  const barangList = permintaan.barang?.data || permintaan.barang || [];
  const statusInfo = formatStatus(permintaan.status);

  return (
    <ProtectedRoute allowedRoles={["pemohon", "admin", "validator"]}>
      <div className="flex h-screen font-poppins bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1 fixed top-0 left-0 h-full">
          <div className="h-20 border-b border-white flex items-center justify-center bg-white">
            <img
              src="/logo/ItCenter.png"
              alt="IT Center"
              className="w-32 border-white"
            />
          </div>
          <nav className="flex-1 mt-6 overflow-y-auto text-x1">
            <ul className="space-y-1 pb-6">
              <Link href="/divisi/dashboard_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
                PENGADAAN
              </li>

              <Link href="/Divisi/draf_permintaan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Draf Permintaan
                </li>
              </Link>

              <Link href="/Divisi/permintaan_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Permintaan
                </li>
              </Link>

              <Link href="/Divisi/riwayat_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Riwayat
                </li>
              </Link>
            </ul>
          </nav>
        </aside>

        {/* Main Wrapper */}
        <div className="flex flex-col flex-1 ml-60 h-full">
          {/* Header */}
          <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10">
            <div className="flex-1 h-full flex items-center px-8">
              <div className="ml-auto">
                <span className="text-gray-700">
                  {userData?.nama_lengkap || userData?.username || "User"}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
            <h2 className="text-3xl text-black font-semibold mb-6">Detail Permintaan</h2>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
                <div>
                  <h3 className="text-xl font-semibold text-teal-600">
                    Detail Permintaan
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    No. Permintaan:{" "}
                    <span className="font-semibold">
                      {permintaan.nomor_permintaan}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                  <Link href="/Divisi/permintaan_divisi">
                    <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                      &lt; Kembali
                    </button>
                  </Link>
                </div>
              </div>

              {/* Data Permintaan */}
              <div className="px-6 py-4 border-b-4 border-b-gray-300">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Data Permintaan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-black">
                      ID Permintaan
                    </label>
                    <input
                      type="text"
                      value={permintaan.nomor_permintaan || "N/A"}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-black">
                      Nama Pemohon
                    </label>
                    <input
                      type="text"
                      value={
                        permintaan.nama_lengkap ||
                        userData?.nama_lengkap ||
                        "N/A"
                      }
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-black">Divisi</label>
                    <input
                      type="text"
                      value={
                        getDivisiName(permintaan.divisi_id) ||
                        permintaan.nama_divisi ||
                        "N/A"
                      }
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-black">Email</label>
                    <input
                      type="text"
                      value={userData?.email || permintaan.email || "N/A"}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-black">
                      Judul Permintaan
                    </label>
                    <input
                      type="text"
                      value={permintaan.catatan || "Tidak ada judul"}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-black">
                      Tanggal Kebutuhan
                    </label>
                    <input
                      type="text"
                      value={formatDate(permintaan.tanggal_kebutuhan)}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-black">
                      Jumlah Barang Diminta
                    </label>
                    <input
                      type="text"
                      value={barangList.length}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-black">
                      Tanggal Dibuat
                    </label>
                    <input
                      type="text"
                      value={formatDate(permintaan.created_at)}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Daftar Barang */}
              {barangList.length > 0 ? (
                barangList.map((barang, index) => {
                  const barangStatus = formatStatusBarang(barang.status);
                  const catatanPenolakan = catatanData[barang.id] || getCatatanPenolakan(barang);
                  
                  return (
                    <div
                      key={barang.id}
                      className="px-6 py-4 border-b-4 border-b-gray-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-black">
                          Data Barang {index + 1}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${barangStatus.color}`}
                        >
                          {barangStatus.text}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="font-medium text-black">
                            Kategori Barang
                          </label>
                          <input
                            type="text"
                            value={barang.kategori_barang || "N/A"}
                            disabled
                            className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-black">
                            Nama Barang
                          </label>
                          <input
                            type="text"
                            value={barang.nama_barang || "N/A"}
                            disabled
                            className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-black">
                            Satuan
                          </label>
                          <input
                            type="text"
                            value={
                              barang.satuan ||
                              barang.stok_barang?.nama_satuan ||
                              "N/A"
                            }
                            disabled
                            className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-black">
                            Jumlah
                          </label>
                          <input
                            type="text"
                            value={barang.jumlah || 0}
                            disabled
                            className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="font-medium text-black">
                            Spesifikasi
                          </label>
                          <input
                            value={
                              barang.spesifikasi ||
                              barang.stok_barang?.spesifikasi ||
                              "Tidak ada spesifikasi"
                            }
                            disabled
                            className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                            rows="2"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="font-medium text-black">
                            Keterangan Pemohon
                          </label>
                          <textarea
                            value={barang.keterangan || "Tidak ada keterangan"}
                            disabled
                            className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                            rows="2"
                          />
                        </div>

                        {/* Tampilkan Alasan Penolakan jika barang ditolak */}
                        {barang.status === 'ditolak' && catatanPenolakan && (
                          <div className="md:col-span-2">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 text-red-500">
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-red-800">
                                    Alasan Penolakan
                                  </h3>
                                  <div className="mt-2 text-sm text-red-700">
                                    <p>{catatanPenolakan}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Tampilkan catatan admin untuk status lain */}
                        {barang.status !== 'ditolak' && catatanPenolakan && (
                          <div className="md:col-span-2">
                            <label className="font-medium  text-blue-600">
                              Catatan Admin
                            </label>
                            <textarea
                              value={catatanPenolakan}
                              disabled
                              className="w-full border border-blue-200 bg-blue-50 rounded px-3 py-2 mt-1 text-blue-700"
                              rows="2"
                            />
                          </div>
                        )}

                        {barang.catatan_validator && (
                          <div className="md:col-span-2">
                            <label className="font-medium  text-green-600">
                              Catatan Validator
                            </label>
                            <textarea
                              value={barang.catatan_validator}
                              disabled
                              className="w-full border border-green-200 bg-green-50 rounded px-3 py-2 mt-1 text-green-700"
                              rows="2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-gray-600">
                    Tidak ada barang dalam permintaan ini
                  </p>
                </div>
              )}

              {/* Garis bawah hijau */}
              <div className="h-1 bg-teal-600 w-full"></div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}