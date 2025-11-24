"use client";
import Link from "next/link";
import { useState } from "react";

export default function DokumenPemesananPage() {
  const [nota, setNota] = useState(null);
  const [po, setPo] = useState(null);
  const [formFilled, setFormFilled] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "nota") setNota(file);
      if (type === "po") setPo(file);
    }
  };

  const handleIsiForm = () => {
    window.location.href = "/GA/form_pemesanan";
  };

  const handleSubmit = () => {
    alert("Dokumen berhasil dikirim!");
  };

  const isReadyToSubmit = nota && po && formFilled;

  const renderPreview = (file) => {
    if (!file) return null;
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    return (
      <div className="mt-2">
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            onClick={() => setPreviewImage(URL.createObjectURL(file))}
            className="w-40 h-40 object-cover rounded border border-gray-300 shadow-sm cursor-pointer hover:opacity-80"
          />
        ) : isPDF ? (
          <p className="text-sm text-gray-600">
            File PDF dipilih: <span className="font-medium">{file.name}</span>
          </p>
        ) : (
          <p className="text-sm text-red-500">Format file tidak didukung</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen font-poppins bg-gray-100 overflow-hidden">
      
      {/* Sidebar TETAP */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1 fixed top-0 left-0 h-full">
        <div className="h-20 border-b border-white flex items-center justify-center bg-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32 border-white" />
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 pb-6">
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

      {/* KONTEN UTAMA */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        
        {/* Header tetap */}
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10"></header>

        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">Permintaan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Dokumen Pemesanan
              </h3>
              <Link href="/GA/list_pemesanan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* ✅ Data Barang FIX */}
            <div className="px-6 py-4 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Data Barang
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
            </div>

            {/* ✅ Upload Dokumen */}
            <div className="px-6 py-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Upload Dokumen
              </h4>

              {/* NOTA */}
              <div className="mb-6">
                <label className="font-medium text-gray-700 block mb-1">Nota</label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => handleFileChange(e, "nota")}
                  className="border border-gray-400 rounded-md px-3 py-2 text-sm w-40 bg-gray-100 hover:bg-gray-200"
                />
                {renderPreview(nota)}
              </div>

              {/* PO */}
              <div className="mb-6">
                <label className="font-medium text-gray-700 block mb-1">PO</label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => handleFileChange(e, "po")}
                  className="border border-gray-400 rounded-md px-3 py-2 text-sm w-40 bg-gray-100 hover:bg-gray-200"
                />
                {renderPreview(po)}
              </div>

              {/* PO */}
              <div className="mb-6">
                <label className="font-medium text-gray-700 block mb-1">Form Permintaan Barang</label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => handleFileChange(e, "po")}
                  className="border border-gray-400 rounded-md px-3 py-2 text-sm w-40 bg-gray-100 hover:bg-gray-200"
                />
                {renderPreview(po)}
              </div>
              {/* ✅ Tombol Kirim */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={!isReadyToSubmit}
                  className={`font-medium px-5 py-2 rounded text-white shadow ${
                    isReadyToSubmit
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Popup Preview */}
      {previewImage && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 left-5 bg-teal-600 hover:bg-teal-400 text-white font-semibold px-3 py-1.5 rounded-lg shadow-md transition"
          >
            ← Kembali
          </button>
          <img
            src={previewImage}
            alt="preview besar"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
}
