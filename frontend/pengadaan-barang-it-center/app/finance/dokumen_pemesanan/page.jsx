"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaFilePdf,
  FaFileImage,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function DokumenPenerimaanPage() {
  const searchParams = useSearchParams();
  const pemesananId = searchParams.get("id");

  const [pemesanan, setPemesanan] = useState(null);
  const [dokumenList, setDokumenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [showRejectNote, setShowRejectNote] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [validating, setValidating] = useState(false);

  // Fetch data pemesanan
  const fetchPemesananDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3200/api/validator/pemesanan/${pemesananId}`,
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

  const openPreview = (dokumen) => {
    if (dokumen && dokumen.file_path) {
      setPreviewSrc(`http://localhost:3200${dokumen.file_path}`);
    }
  };

  const closePreview = () => setPreviewSrc(null);

  // Render thumbnail
  const renderThumb = (dokumen) => {
    if (!dokumen) return null;

    const isPdf = /\.pdf$/i.test(dokumen.nama_file);
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(dokumen.nama_file);

    if (isPdf) {
      return (
        <div
          onClick={() => openPreview(dokumen)}
          className="w-32 h-32 flex items-center justify-center border border-gray-300 rounded cursor-pointer bg-white shadow-sm hover:shadow-md"
        >
          <div className="flex flex-col items-center text-gray-700">
            <FaFilePdf size={28} className="text-red-600" />
            <span className="text-xs mt-1 truncate max-w-[6rem]">
              {dokumen.original_name || "PDF File"}
            </span>
          </div>
        </div>
      );
    } else if (isImage) {
      return (
        <img
          src={`http://localhost:3200${dokumen.file_path}`}
          alt={dokumen.jenis_dokumen}
          onClick={() => openPreview(dokumen)}
          className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm cursor-pointer hover:opacity-90"
        />
      );
    } else {
      return (
        <div
          onClick={() => openPreview(dokumen)}
          className="w-32 h-32 flex items-center justify-center border border-gray-300 rounded cursor-pointer bg-white shadow-sm"
        >
          <div className="text-center">
            <div className="text-blue-600 font-bold">FILE</div>
            <div className="text-xs text-gray-600 mt-1">Klik untuk buka</div>
          </div>
        </div>
      );
    }
  };

  // Get dokumen by jenis
  const getDokumenByJenis = (jenis) => {
    return dokumenList.find((d) => d.jenis_dokumen === jenis);
  };

  // Handle validation yang diperbaiki
  const handleValidation = async (isValid) => {
    if (!isValid && !rejectNote.trim()) {
      alert("Harap isi catatan penolakan!");
      return;
    }

    setValidating(true);

    try {
      const token = localStorage.getItem("token");
      let successCount = 0;
      let errorMessages = [];

      // Validate all documents one by one
      for (const dokumen of dokumenList) {
        try {
          const response = await fetch(
            `http://localhost:3200/api/validator/dokumen/${dokumen.id}/validate`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                is_valid: isValid, // boolean langsung
                catatan_validator: isValid
                  ? "Dokumen telah divalidasi"
                  : rejectNote,
              }),
            }
          );

          const result = await response.json();

          if (response.ok) {
            successCount++;
            console.log(
              `✅ Dokumen ${dokumen.jenis_dokumen} berhasil ${
                isValid ? "divalidasi" : "ditolak"
              }`
            );
          } else {
            errorMessages.push(`${dokumen.jenis_dokumen}: ${result.error}`);
          }
        } catch (error) {
          errorMessages.push(`${dokumen.jenis_dokumen}: ${error.message}`);
        }
      }

      // Tampilkan hasil
      if (errorMessages.length === 0) {
        alert(`Semua dokumen berhasil ${isValid ? "divalidasi" : "ditolak"}!`);
      } else if (successCount > 0) {
        alert(
          `Sebagian dokumen berhasil diproses. Error: ${errorMessages.join(
            ", "
          )}`
        );
      } else {
        alert(`Gagal memvalidasi dokumen: ${errorMessages.join(", ")}`);
      }

      // Refresh data setelah 2 detik untuk memberi waktu update database
      setTimeout(() => {
        fetchPemesananDetail();
        setShowRejectNote(false);
        setRejectNote("");
        setValidating(false);
      }, 2000);
    } catch (error) {
      console.error("Validation error:", error);
      alert("Terjadi kesalahan saat memvalidasi dokumen.");
      setValidating(false);
    }
  };

  // Tambahkan fungsi untuk menampilkan status pemesanan
  const getPemesananStatus = () => {
    if (!pemesanan) return "Memuat...";

    // Coba ambil dari beberapa sumber
    return pemesanan.status || pemesanan.pemesanan_status || "Diproses";
  };

  // Tambahkan fungsi warna status
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "diproses":
        return "bg-yellow-100 text-yellow-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      case "dalam pemesanan":
        return "bg-blue-100 text-blue-800";
      case "divalidasi": // STATUS BARU
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          <Link href="/finance/data_pemesanan">
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Kembali ke Data Pemesanan
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-poppins bg-gray-100">
      {/* Sidebar tetap sama */}
      {/* ... */}

      {/* Main wrapper */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10"></header>

        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">
            Validasi Dokumen Pemesanan
          </h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Cek Dokumen Pemesanan -{" "}
                {pemesanan.permintaan?.nomor_permintaan || "N/A"}
              </h3>
              <Link href="/finance/data_pemesanan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Data Barang */}
            <div className="px-6 pt-6 pb-4 border-b border-b-gray-300">
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

              {/* Dokumen-dokumen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <h4 className="text-base font-medium mb-3 text-gray-700 flex items-center">
                    <FaFileImage className="mr-2 text-blue-600" />
                    Nota
                    {getDokumenByJenis("nota")?.is_valid === 1 && (
                      <FaCheckCircle className="ml-2 text-green-600" />
                    )}
                    {getDokumenByJenis("nota")?.is_valid === 0 && (
                      <FaTimesCircle className="ml-2 text-red-600" />
                    )}
                  </h4>
                  <div className="p-4 bg-white border border-gray-200 rounded">
                    {getDokumenByJenis("nota") ? (
                      <>
                        {renderThumb(getDokumenByJenis("nota"))}
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Diupload oleh:{" "}
                            {getDokumenByJenis("nota")?.uploader_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tanggal:{" "}
                            {new Date(
                              getDokumenByJenis("nota")?.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        Belum ada dokumen
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium mb-3 text-gray-700 flex items-center">
                    <FaFilePdf className="mr-2 text-red-600" />
                    PO (Purchase Order)
                    {getDokumenByJenis("po")?.is_valid === 1 && (
                      <FaCheckCircle className="ml-2 text-green-600" />
                    )}
                    {getDokumenByJenis("po")?.is_valid === 0 && (
                      <FaTimesCircle className="ml-2 text-red-600" />
                    )}
                  </h4>
                  <div className="p-4 bg-white border border-gray-200 rounded">
                    {getDokumenByJenis("po") ? (
                      <>
                        {renderThumb(getDokumenByJenis("po"))}
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Diupload oleh:{" "}
                            {getDokumenByJenis("po")?.uploader_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Tanggal:{" "}
                            {new Date(
                              getDokumenByJenis("po")?.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        Belum ada dokumen
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium mb-3 text-gray-700 flex items-center">
                    <FaFilePdf className="mr-2 text-green-600" />
                    Form Penerimaan
                    {getDokumenByJenis("form_penerimaan")?.is_valid === 1 && (
                      <FaCheckCircle className="ml-2 text-green-600" />
                    )}
                    {getDokumenByJenis("form_penerimaan")?.is_valid === 0 && (
                      <FaTimesCircle className="ml-2 text-red-600" />
                    )}
                  </h4>
                  <div className="p-4 bg-white border border-gray-200 rounded">
                    {getDokumenByJenis("form_penerimaan") ? (
                      <>
                        {renderThumb(getDokumenByJenis("form_penerimaan"))}
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Diupload oleh:{" "}
                            {
                              getDokumenByJenis("form_penerimaan")
                                ?.uploader_name
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            Tanggal:{" "}
                            {new Date(
                              getDokumenByJenis("form_penerimaan")?.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        Belum ada dokumen
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Catatan penolakan */}
              {showRejectNote && (
                <div className="mt-6 px-2 py-4 bg-yellow-50 rounded">
                  <label className="font-medium text-gray-700 block mb-2">
                    Catatan Alasan Ditolak
                  </label>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows="3"
                    placeholder="Masukkan alasan penolakan..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Catatan ini akan dikirim ke admin dan pemohon.
                  </p>
                </div>
              )}

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-3 px-2 py-5 mt-4">
                {!showRejectNote ? (
                  <>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded disabled:opacity-50"
                      onClick={() => setShowRejectNote(true)}
                      disabled={validating || dokumenList.length === 0}
                    >
                      Tolak
                    </button>

                    <button
                      className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded disabled:opacity-50"
                      onClick={() => handleValidation(true)}
                      disabled={validating || dokumenList.length === 0}
                    >
                      {validating ? "Memproses..." : "Validasi"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded disabled:opacity-50"
                      onClick={() => handleValidation(false)}
                      disabled={validating || !rejectNote.trim()}
                    >
                      {validating ? "Memproses..." : "Tolak"}
                    </button>

                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded"
                      onClick={() => {
                        setShowRejectNote(false);
                        setRejectNote("");
                      }}
                      disabled={validating}
                    >
                      Batal
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Status Pemesanan */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Status Pemesanan:
                  </h4>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        getPemesananStatus()
                      )}`}
                    >
                      {getPemesananStatus()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {dokumenList.length > 0
                        ? `${
                            dokumenList.filter((d) => d.is_valid === 1).length
                          }/${dokumenList.length} dokumen tervalidasi`
                        : "Belum ada dokumen"}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    ID Pemesanan: {pemesananId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Nomor Permintaan:{" "}
                    {pemesanan?.permintaan?.nomor_permintaan || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Validasi */}
            <div className="px-6 py-4 bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-2">
                Status Validasi:
              </h4>
              <div className="flex items-center space-x-4">
                {dokumenList.map((dokumen) => (
                  <div
                    key={`${dokumen.id}-${dokumen.jenis_dokumen}`}
                    className="flex items-center"
                  >
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        dokumen.is_valid === 1
                          ? "bg-green-500"
                          : dokumen.is_valid === 0
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    <span className="text-sm">
                      {dokumen.jenis_dokumen}:{" "}
                      {dokumen.is_valid === 1
                        ? "Valid"
                        : dokumen.is_valid === 0
                        ? "Ditolak"
                        : "Menunggu"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>

      {/* Modal Preview */}
      {previewSrc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg">
            <button
              onClick={closePreview}
              className="absolute right-0 top-0 -translate-y-2 translate-x-2 bg-white rounded-full p-2 shadow z-10"
            >
              ✕
            </button>

            {previewSrc.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={previewSrc}
                title="PDF preview"
                className="w-[80vw] h-[80vh] bg-white rounded"
              />
            ) : (
              <img
                src={previewSrc}
                alt="preview"
                className="max-w-[80vw] max-h-[80vh] rounded"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
