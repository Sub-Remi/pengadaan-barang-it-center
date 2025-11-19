"use client";
import Link from "next/link";
import { useState } from "react";

export default function FormPenerimaanBarangPage() {
  const [fotoBukti, setFotoBukti] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // maksimal 3 file
    setFotoBukti(files);
  };

  const handleSubmit = () => {
    alert("Form penerimaan berhasil dikirim!");
  };

  const renderPreview = (files) => {
    if (!files.length) return null;
    return (
      <div className="flex flex-wrap gap-4 mt-3">
        {files.map((file, index) => {
          const isImage = file.type.startsWith("image/");
          const isPDF = file.type === "application/pdf";
          return (
            <div key={index}>
              {isImage ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  onClick={() => setPreviewImage(URL.createObjectURL(file))}
                  className="w-32 h-32 object-cover rounded border border-gray-300 shadow-sm cursor-pointer hover:opacity-80"
                />
              ) : isPDF ? (
                <p className="text-sm text-gray-600">
                  File PDF: <span className="font-medium">{file.name}</span>
                </p>
              ) : (
                <p className="text-sm text-red-500">Format tidak didukung</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className=" font-poppins bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-full">
        <div className="h-20 border-b border-white flex items-center justify-center bg-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 pb-6">
            <Link href="/GA/dashboard_ga">
              <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                Dashboard
              </li>
            </Link>
            <hr className="border-t border-white/30 my-2" />
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
            <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
              PEMESANAN
            </li>
            <Link href="/GA/list_pemesanan">
              <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                List Pemesanan
              </li>
            </Link>
          </ul>
        </nav>
      </aside>

      {/* Main Wrapper */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        {/* Header */}
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10">
          <div className="flex-1 h-full flex items-center px-8"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">

          <h2 className="text-3xl font-semibold mb-6">Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Form Penerimaan Barang
              </h3>
              <Link href="/GA/detail_pemesanan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Informasi Umum */}
            <div className="px-6 py-5 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Informasi Umum
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">
                    Tanggal Penerimaan
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Penerima</label>
                  <input
                    type="text"
                    value="Kepala GA"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 mt-1 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rincian Barang Diterima */}
            <div className="px-6 py-5 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Rincian Barang Diterima
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Nama Barang", "Spesifikasi", "Jumlah Dipesan", "Jumlah Diterima"].map(
                  (label, i) => (
                    <div key={i}>
                      <label className="font-medium text-gray-700">{label}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 text-sm"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Pemeriksaan & Verifikasi */}
            <div className="px-6 py-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Pemeriksaan & Verifikasi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Diperiksa oleh</label>
                  <input
                    type="text"
                    value="Kepala GA"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 mt-1 text-sm"
                  />
                </div>
                <div>
                  <label className="font-medium text-gray-700">
                    Tanggal Pemeriksaan
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-medium text-gray-700">Hasil Pemeriksaan</label>
                  <input
                    type="text"
                    className="w-full border border-gray-400 rounded-md px-3 py-2 mt-1 text-sm"
                  />
                </div>

                {/* Upload Bukti */}
                <div className="col-span-2">
                  <label className="font-medium text-gray-700 block mb-1">
                    Foto Bukti
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleFileChange}
                    className="border border-gray-400 rounded-md px-3 py-2 text-sm w-40 bg-gray-100 hover:bg-gray-200"
                  />
                  <small className="text-gray-500 text-xs mt-1 block">
                    *Maks 3 file — format: png, jpg, jpeg, pdf
                  </small>
                  {renderPreview(fotoBukti)}
                </div>
              </div>

              {/* Tombol Kirim */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSubmit}
                  className="font-medium px-5 py-2 rounded text-white shadow bg-green-600 hover:bg-green-700"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Popup Preview Gambar */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
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
