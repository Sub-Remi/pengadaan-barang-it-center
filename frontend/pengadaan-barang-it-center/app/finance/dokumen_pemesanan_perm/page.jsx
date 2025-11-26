"use client";
import Link from "next/link";
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";

/**
 * DokumenPenerimaanPage (FRONTEND only)
 * - semua field disabled / read-only
 * - klik thumbnail gambar -> buka modal preview
 * - placeholder data (ganti nanti dengan props / fetch)
 */

export default function DokumenPenerimaanPage() {
  const [previewSrc, setPreviewSrc] = useState(null);

  // placeholder data (ganti dengan data nyata nanti)
  const pb = {

  nota: "/uploads/nota_10111.jpg",
  po: "/uploads/po_10111.jpg",
  formPermintaan: "/uploads/form_perm_10111.pdf",
  };

  const openPreview = (src) => setPreviewSrc(src);
  const closePreview = () => setPreviewSrc(null);
  const [showRejectNote, setShowRejectNote] = useState(false);
const [rejectNote, setRejectNote] = useState("");



  // helper: render thumbnail (image or pdf)
  const renderThumb = (url, alt = "") => {
    const isPdf = url.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      return (
        <div
          onClick={() => openPreview(url)}
          className="w-32 h-32 flex items-center justify-center border border-gray-300 rounded cursor-pointer bg-white shadow-sm"
        >
          <div className="flex flex-col items-center text-gray-700">
            <FaFilePdf size={28} className="text-red-600" />
            <span className="text-xs mt-1 truncate max-w-[6rem]">{url.split("/").pop()}</span>
          </div>
        </div>
      );
    }

    return (
      <img
        src={url}
        alt={alt}
        onClick={() => openPreview(url)}
        className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm cursor-pointer hover:opacity-90"
      />
    );
  };

  return (
    <div className="flex h-screen font-poppins bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-full">
        <div className="h-20 border-r border-white flex items-center justify-center bg-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 pb-6">
            <Link href="/finance/dashboard_finance">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                Dashboard
                </li>
            </Link>
            
            <hr className="border-t border-white/30 my-2" />
            
            <li className="px-5 py-2 text-x1 font-semibold text-gray-200">PEMESANAN</li>

            <Link href="/finance/data_pemesanan">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                    Data Pemesanan
                </li>
            </Link>
            <Link href="/finance/riwayat_finance">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                Riwayat
                </li>
            </Link>
            </ul>
        </nav>
      </aside>

      {/* Main wrapper */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        {/* Header fixed */}
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10">
          <div className="flex-1 h-full flex items-center px-8">
            {/* kosong — judul di main content */}
          </div>
        </header>

        {/* Main content area (scrollable) */}
        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* header kartu */}
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">Cek Dokumen Pemesanan</h3>
              <Link href="/finance/data_pemesanan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">&lt; Kembali</button>
              </Link>
            </div>

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
                    value="0000"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Nama</label>
                  <input
                    type="text"
                    value="John Doe"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Divisi</label>
                  <input
                    type="text"
                    value="IT"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Email</label>
                  <input
                    type="text"
                    value="john.doe@itcenter.co.id"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Judul Permintaan</label>
                  <input
                    type="text"
                    value="Permintaan Laptop"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Tanggal Permintaan</label>
                  <input
                    type="text"
                    value="2025-10-01"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Jumlah Barang Diminta</label>
                  <input
                    type="text"
                    value="2"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>
            </div>

            

            {/* Nota / PO preview */}
            <div className="px-6 pt-6 pb-4 border-b border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Data Barang 1
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Kategori Barang</label>
                  <input
                    type="text"
                    value="Elektronik"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Nama Barang</label>
                  <input
                    type="text"
                    value="Laptop Lenovo"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Satuan</label>
                  <input
                    type="text"
                    value="Unit"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Jumlah</label>
                  <input
                    type="text"
                    value="2"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="font-medium text-gray-700">Keterangan</label>
                <textarea
                  disabled
                  value="Pengadaan untuk operasional"
                  className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-base font-medium mb-3 text-gray-700">Nota</h4>
                  <div className="p-4 bg-white border border-gray-200 rounded">
                    <div className="flex gap-6">
                      {renderThumb(pb.nota, "Nota")}
                      {/* small label */}
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">Klik gambar untuk lihat</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-medium mb-3 text-gray-700">PO</h4>
                  <div className="p-4 bg-white border border-gray-200 rounded">
                    <div className="flex gap-6">
                      {renderThumb(pb.po, "PO")}
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">Klik gambar untuk lihat</div>
                      </div>
                    </div>
                  </div>
                </div> 

                <div>
                  <h4 className="text-base font-medium mb-3 text-gray-700">Form Permintaan</h4>
                  <div className="p-4 bg-white border border-gray-200 rounded">
                    <div className="flex gap-6">
                      {renderThumb(pb.formPermintaan, "Form Permintaan")}
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">Klik dokumen untuk lihat</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ✅ Catatan alasan ditolak muncul setelah tombol tolak ditekan */}
                {showRejectNote && (
                  <div className="px-2 py-4">
                    <label className="font-medium text-gray-700 block mb-1">
                      Catatan Alasan Ditolak
                    </label>
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows="3"
                      placeholder="Masukkan alasan penolakan..."
                    />
                  </div>
                )}


                {/* ✅ Tombol Aksi */}
                <div className="flex justify-end gap-3 px-2 py-5">

                  {/* ✅ Kondisi awal: Tolak + Validasi */}
                  {!showRejectNote && (
                    <>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded"
                        onClick={() => setShowRejectNote(true)}
                      >
                        Tolak
                      </button>

                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded"
                        onClick={() => alert("✅ Dokumen divalidasi")}
                      >
                        Validasi
                      </button>
                    </>
                  )}

                  {/* ✅ Setelah klik Tolak: Tolak + Batal */}
                  {showRejectNote && (
                    <>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded"
                        onClick={() => {
                          alert(`❌ Dokumen ditolak.\nCatatan: ${rejectNote}`);
                        }}
                      >
                        Tolak
                      </button>

                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded"
                        onClick={() => {
                          setShowRejectNote(false);
                          setRejectNote("");
                        }}
                      >
                        Batal
                      </button>
                    </>
                  )}

                </div>


            </div>
            {/* ✅ Data Barang FIX */}
            <div className="px-6 py-4 border-t-4 border-t-gray-300 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-400">
                Data Barang 2
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-400">Kategori Barang</label>
                  <input
                    type="text"
                    value="Elektronik"
                    disabled
                    className="w-full border border-gray-300 text-gray-400 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-400">Nama Barang</label>
                  <input
                    type="text"
                    value="Laptop Lenovo"
                    disabled
                    className="w-full border border-gray-400 text-gray-400 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-400">Satuan</label>
                  <input
                    type="text"
                    value="Unit"
                    disabled
                    className="w-full border border-gray-300 text-gray-400 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-400">Jumlah</label>
                  <input
                    type="text"
                    value="2"
                    disabled
                    className="w-full border border-gray-300 text-gray-400 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="font-medium text-gray-400">Keterangan</label>
                <textarea
                  disabled
                  value="Pengadaan untuk operasional"
                  className="w-full border border-gray-300 text-gray-400 bg-gray-100 rounded px-3 py-2 mt-1"
                  rows="3"
                />
              </div>
            </div>
            

            
            {/* tombol selesai di kanan bawah kartu */}
              <div className="flex justify-end m-6 px-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow">Simpan</button>
              </div>
            {/* garis tosca bawah */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>

      {/* Modal preview */}
      {previewSrc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <button onClick={closePreview} className="absolute right-0 top-0 -translate-y-2 translate-x-2 bg-white rounded-full p-2 shadow">
              ✕
            </button>

            {previewSrc.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={previewSrc}
                title="PDF preview"
                className="w-[80vw] h-[80vh] bg-white rounded"
              />
            ) : (
              <img src={previewSrc} alt="preview" className="max-w-[80vw] max-h-[80vh] rounded shadow-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
