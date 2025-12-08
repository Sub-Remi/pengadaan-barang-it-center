"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function DokumenPemesananPage() {
  const searchParams = useSearchParams();
  const pemesananId = searchParams.get("id");

  const [pemesanan, setPemesanan] = useState(null);
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({
    nota: false,
    po: false,
    form_penerimaan: false,
  });

  const [deleting, setDeleting] = useState(false);

  // Refs untuk input file
  const notaInputRef = useRef(null);
  const poInputRef = useRef(null);
  const formPenerimaanInputRef = useRef(null);

  // Fetch data pemesanan
  const fetchPemesananDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3200/api/admin/pemesanan/${pemesananId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setPemesanan(result.data);
        setDokumenList(result.data.dokumen || []);
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pemesananId) {
      fetchPemesananDetail();
    }
  }, [pemesananId]);

  // Cek apakah dokumen sudah ada
  const checkExistingDokumen = async (jenis) => {
    if (!pemesanan) return null;

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        barang_permintaan_id: pemesanan.barang_permintaan_id,
        jenis_dokumen: jenis,
      });

      const response = await fetch(
        `http://localhost:3200/api/admin/dokumen/check-existing?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Check existing error:", error);
      return { exists: false, dokumen: null };
    }
  };

  // Handle file upload (dengan konfirmasi replace)
  const handleFileUpload = async (file, jenis) => {
    if (!file || !pemesanan) return;

    // Cek apakah dokumen sudah ada
    const existingCheck = await checkExistingDokumen(jenis);

    if (existingCheck.exists) {
      // Konfirmasi replace
      const confirmReplace = window.confirm(
        `Dokumen ${jenis} sudah ada. Apakah Anda ingin mengganti dengan file baru?`
      );

      if (!confirmReplace) {
        return;
      }

      // Jika ya, hapus dulu yang lama
      await handleDeleteDokumen(existingCheck.dokumen.id, jenis);
    }

    setUploading((prev) => ({ ...prev, [jenis]: true }));

    const formData = new FormData();
    formData.append("file_dokumen", file);
    formData.append("jenis_dokumen", jenis);
    formData.append("barang_permintaan_id", pemesanan.barang_permintaan_id);

    try {
      const token = localStorage.getItem("token");
      const endpoint = existingCheck.exists
        ? `http://localhost:3200/api/admin/dokumen-pembelian/${existingCheck.dokumen.id}/replace`
        : "http://localhost:3200/api/admin/dokumen-pembelian";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `Dokumen ${jenis} berhasil ${
            existingCheck.exists ? "diganti" : "diupload"
          }!`
        );
        fetchPemesananDetail(); // Refresh data
      } else {
        alert(`Gagal upload dokumen: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan saat upload dokumen.");
    } finally {
      setUploading((prev) => ({ ...prev, [jenis]: false }));
    }
  };

  // Handle delete dokumen
  const handleDeleteDokumen = async (dokumenId, jenis) => {
    if (
      !window.confirm(`Apakah Anda yakin ingin menghapus dokumen ${jenis}?`)
    ) {
      return;
    }

    setDeleting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3200/api/admin/dokumen/${dokumenId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(`Dokumen ${jenis} berhasil dihapus!`);
        fetchPemesananDetail(); // Refresh data
      } else {
        alert(`Gagal menghapus dokumen: ${result.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan saat menghapus dokumen.");
    } finally {
      setDeleting(false);
    }
  };

  // Handle file change
  const handleFileChange = (e, jenis) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, jenis);
    }
    // Reset input value agar bisa upload file dengan nama yang sama
    e.target.value = null;
  };

  // Trigger file input
  const triggerFileInput = (jenis) => {
    switch (jenis) {
      case "nota":
        notaInputRef.current?.click();
        break;
      case "po":
        poInputRef.current?.click();
        break;
      case "form_penerimaan":
        formPenerimaanInputRef.current?.click();
        break;
    }
  };

  // Helper functions untuk status dokumen
  const getDokumenStatusText = (jenis) => {
    const dokumen = getDokumenByJenis(jenis);
    if (!dokumen) return "⏳ Belum diupload";
    if (dokumen.is_valid === 1) return "✅ Divalidasi";
    if (dokumen.is_valid === 0) return "❌ Ditolak";
    return "⏳ Menunggu validasi";
  };

  const getStatusColor = (jenis) => {
    const dokumen = getDokumenByJenis(jenis);
    if (!dokumen) return "status-pending";
    if (dokumen.is_valid === 1) return "status-valid";
    if (dokumen.is_valid === 0) return "status-ditolak";
    return "status-pending";
  };

  // Get dokumen by jenis
  const getDokumenByJenis = (jenis) => {
    return dokumenList.find((d) => d.jenis_dokumen === jenis);
  };

  // Di file detail_pemesanan.jsx admin - Perbaiki URL preview
  const renderPreviewWithActions = (dokumen, jenis) => {
    if (!dokumen) return null;

    const fileUrl = `http://localhost:3200/api/files/dokumen_pembelian/${dokumen.nama_file}`;
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(dokumen.nama_file);
    const isPDF = /\.pdf$/i.test(dokumen.nama_file);

    // Tentukan status dokumen
    let statusColor = "bg-gray-100 text-gray-800";
    let statusText = "Belum Divalidasi";

    if (dokumen.is_valid === 1) {
      statusColor = "bg-green-100 text-green-800";
      statusText = "Divalidasi";
    } else if (dokumen.is_valid === 0) {
      statusColor = "bg-red-100 text-red-800";
      statusText = "Ditolak";
    }

    return (
      <div className="mt-2">
        {/* Status Dokumen */}
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
            {statusText}
          </span>
          <span className="text-xs text-gray-500">
            {dokumen.validator_name
              ? `Validasi oleh: ${dokumen.validator_name}`
              : "Menunggu validasi"}
          </span>
        </div>

        {/* Tampilkan Catatan Penolakan jika ada */}
        {dokumen.is_valid === 0 && dokumen.catatan_validator && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start">
              <span className="text-red-600 mr-2">⚠️</span>
              <div>
                <div className="text-sm font-medium text-red-700">
                  Alasan Penolakan:
                </div>
                <div className="text-sm text-red-600 mt-1">
                  {dokumen.catatan_validator}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview File */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            {isImage ? (
              <div className="relative group">
                <img
                  src={fileUrl}
                  alt={dokumen.jenis_dokumen}
                  className="w-40 h-40 object-cover rounded border border-gray-300 shadow-sm cursor-pointer hover:opacity-80"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-sm font-medium">
                    Klik untuk preview
                  </span>
                </div>
              </div>
            ) : isPDF ? (
              <div
                className="w-40 h-40 border border-gray-300 rounded shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-100"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                <div className="text-center">
                  <div className="text-red-600 font-bold">PDF</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Klik untuk buka
                  </div>
                </div>
              </div>
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded"
              >
                📎 Lihat File
              </a>
            )}

            <p className="text-sm text-gray-500 mt-1 truncate">
              {dokumen.original_name}
            </p>
            <p className="text-xs text-gray-400">
              {(dokumen.file_size / 1024).toFixed(2)} KB
            </p>
          </div>

          {/* Tombol Aksi - Nonaktifkan jika dokumen sudah divalidasi */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => triggerFileInput(jenis)}
              disabled={uploading[jenis] || deleting || dokumen.is_valid === 1}
              className={`px-3 py-1 rounded text-sm ${
                dokumen.is_valid === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {uploading[jenis]
                ? "Mengganti..."
                : dokumen.is_valid === 1
                ? "Tidak Bisa Diganti"
                : "Ganti File"}
            </button>

            <button
              onClick={() => handleDeleteDokumen(dokumen.id, jenis)}
              disabled={uploading[jenis] || deleting || dokumen.is_valid === 1}
              className={`px-3 py-1 rounded text-sm ${
                dokumen.is_valid === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render upload form
  const renderUploadForm = (jenis) => {
    return (
      <div>
        <input
          ref={
            jenis === "nota"
              ? notaInputRef
              : jenis === "po"
              ? poInputRef
              : formPenerimaanInputRef
          }
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={(e) => handleFileChange(e, jenis)}
          className="hidden"
        />

        <button
          onClick={() => triggerFileInput(jenis)}
          disabled={uploading[jenis]}
          className="border border-gray-400 rounded-md px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          {uploading[jenis] ? "Mengupload..." : `Upload ${jenis.toUpperCase()}`}
        </button>

        <p className="text-xs text-gray-500 mt-1">
          Format: JPG, PNG, PDF (max 10MB)
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!pemesanan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Data tidak ditemukan
          </h2>
          <Link href="/GA/list_pemesanan">
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Kembali ke List Pemesanan
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-poppins bg-gray-100 overflow-hidden">
      <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1 fixed top-0 left-0 h-full">
        <div className="h-20 border-b border-white flex items-center justify-center bg-white">
          <img
            src="/logo/ItCenter.png"
            alt="IT Center"
            className="w-32 border-white"
          />
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 pb-6">
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

      {/* Konten Utama */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10"></header>

        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Dokumen Pemesanan -{" "}
                {pemesanan.permintaan?.nomor_permintaan || "N/A"}
              </h3>
              <Link href="/GA/list_pemesanan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Catatan Penolakan dari Validator */}
            {pemesanan?.catatan_penolakan &&
              pemesanan.catatan_penolakan.length > 0 && (
                <div className="px-6 py-4 border-b-4 border-b-yellow-400 bg-yellow-50">
                  <div className="flex items-start mb-3">
                    <div className="mr-3">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-800">
                        Catatan Penolakan dari Validator
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Ada dokumen yang ditolak oleh validator. Silakan
                        perbaiki dan upload ulang dokumen.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-yellow-300 p-4">
                    {pemesanan.catatan_penolakan.map((catatan, index) => (
                      <div
                        key={index}
                        className={`mb-3 ${
                          index > 0 ? "pt-3 border-t border-gray-200" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-800">
                            Dokumen:{" "}
                            <span className="text-teal-600">
                              {catatan.jenis_dokumen.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {catatan.validator} •{" "}
                            {new Date(catatan.tanggal).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                        </div>
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                          <div className="text-sm font-medium text-red-700 mb-1">
                            Catatan Penolakan:
                          </div>
                          <div className="text-red-600 whitespace-pre-wrap">
                            {catatan.catatan}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <div className="mr-2">📝</div>
                    <div>
                      <span className="font-medium">Perhatian:</span> Mohon
                      perbaiki dokumen sesuai catatan di atas, lalu upload ulang
                      dokumen yang sudah diperbaiki.
                    </div>
                  </div>
                </div>
              )}

            {/* Data Barang */}
            <div className="px-6 py-4 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Data Barang
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">
                    Kategori Barang
                  </label>
                  <input
                    type="text"
                    value={
                      pemesanan.barang?.nama_kategori ||
                      pemesanan.barang?.kategori_barang ||
                      "-"
                    }
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    value={pemesanan.barang?.nama_barang || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Satuan</label>
                  <input
                    type="text"
                    value={pemesanan.barang?.nama_satuan || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Jumlah</label>
                  <input
                    type="text"
                    value={pemesanan.barang?.jumlah || "-"}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="font-medium text-gray-700">Keterangan</label>
                <textarea
                  disabled
                  value={pemesanan.barang?.keterangan || "-"}
                  className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  rows="3"
                />
              </div>
            </div>

            {/* Upload Dokumen */}
            <div className="px-6 py-6">
              <h4 className="text-lg font-semibold mb-6 text-gray-800">
                Dokumen Pembelian
              </h4>

              {/* NOTA */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">Nota Pembelian</h5>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      getDokumenByJenis("nota")
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getDokumenByJenis("nota")
                      ? "Sudah diupload"
                      : "Belum diupload"}
                  </span>
                </div>

                {getDokumenByJenis("nota")
                  ? renderPreviewWithActions(getDokumenByJenis("nota"), "nota")
                  : renderUploadForm("nota")}
              </div>

              {/* PO */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">
                    Purchase Order (PO)
                  </h5>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      getDokumenByJenis("po")
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getDokumenByJenis("po")
                      ? "Sudah diupload"
                      : "Belum diupload"}
                  </span>
                </div>

                {getDokumenByJenis("po")
                  ? renderPreviewWithActions(getDokumenByJenis("po"), "po")
                  : renderUploadForm("po")}
              </div>

              {/* FORM PENERIMAAN */}
              <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">
                    Form Penerimaan Barang
                  </h5>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      getDokumenByJenis("form_penerimaan")
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getDokumenByJenis("form_penerimaan")
                      ? "Sudah diupload"
                      : "Belum diupload"}
                  </span>
                </div>

                {getDokumenByJenis("form_penerimaan")
                  ? renderPreviewWithActions(
                      getDokumenByJenis("form_penerimaan"),
                      "form_penerimaan"
                    )
                  : renderUploadForm("form_penerimaan")}
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    📝 <strong>Catatan:</strong> Anda bisa mengganti dokumen
                    kapan saja sebelum divalidasi oleh Finance.
                  </p>
                  <p className="mt-1">
                    ⚠️ <strong>Perhatian:</strong> Dokumen yang sudah divalidasi
                    tidak bisa diganti. Jika ada catatan penolakan, mohon
                    perbaiki dan upload ulang.
                  </p>
                  {pemesanan?.catatan_penolakan &&
                    pemesanan.catatan_penolakan.length > 0 && (
                      <p className="mt-1 text-red-600">
                        🚨{" "}
                        <strong>
                          Ada {pemesanan.catatan_penolakan.length} dokumen yang
                          ditolak.
                        </strong>
                        Silakan cek catatan penolakan di atas.
                      </p>
                    )}
                </div>
              </div>

              {/* Ringkasan Status */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-3">
                  Ringkasan Status Dokumen
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Nota */}
                  <div className="text-center p-3 bg-white rounded shadow">
                    <div className="text-sm font-medium text-gray-600">
                      Nota
                    </div>
                    <div
                      className={`text-lg font-bold mt-1 ${getStatusColor(
                        "nota"
                      )}`}
                    >
                      {getDokumenStatusText("nota")}
                    </div>
                    {getDokumenByJenis("nota")?.catatan_validator && (
                      <div className="text-xs text-red-500 mt-1">
                        Catatan:{" "}
                        {getDokumenByJenis("nota").catatan_validator.substring(
                          0,
                          20
                        )}
                        ...
                      </div>
                    )}
                  </div>

                  {/* Status PO */}
                  <div className="text-center p-3 bg-white rounded shadow">
                    <div className="text-sm font-medium text-gray-600">PO</div>
                    <div
                      className={`text-lg font-bold mt-1 ${getStatusColor(
                        "po"
                      )}`}
                    >
                      {getDokumenStatusText("po")}
                    </div>
                    {getDokumenByJenis("po")?.catatan_validator && (
                      <div className="text-xs text-red-500 mt-1">
                        Catatan:{" "}
                        {getDokumenByJenis("po").catatan_validator.substring(
                          0,
                          20
                        )}
                        ...
                      </div>
                    )}
                  </div>

                  {/* Status Form Penerimaan */}
                  <div className="text-center p-3 bg-white rounded shadow">
                    <div className="text-sm font-medium text-gray-600">
                      Form Penerimaan
                    </div>
                    <div
                      className={`text-lg font-bold mt-1 ${getStatusColor(
                        "form_penerimaan"
                      )}`}
                    >
                      {getDokumenStatusText("form_penerimaan")}
                    </div>
                    {getDokumenByJenis("form_penerimaan")
                      ?.catatan_validator && (
                      <div className="text-xs text-red-500 mt-1">
                        Catatan:{" "}
                        {getDokumenByJenis(
                          "form_penerimaan"
                        ).catatan_validator.substring(0, 20)}
                        ...
                      </div>
                    )}
                  </div>
                </div>

                {/* Tambahkan helper functions */}
                <style jsx>{`
                  .status-ditolak {
                    color: #dc2626;
                  }
                  .status-valid {
                    color: #16a34a;
                  }
                  .status-pending {
                    color: #d97706;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
