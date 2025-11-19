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
    id: "10111",
    tanggal: "01/01/2025",
    namaBarang: "Kertas HVS A4",
    divisi: "HR",
    jumlah: 4,
    nota: "/uploads/nota_10111.jpg", // bisa png/jpg
    po: "/uploads/po_10111.jpg",
    bukti: [
      "/uploads/bukti_10111_1.jpg",
      "/uploads/bukti_10111_2.jpg",
    ],
    informasiUmum: {
      tanggalPenerimaan: "01/08/2025",
      penerima: "Kepala GA",
    },
    rincian: {
      spesifikasi: "80 gr Kenko",
      jumlahDipesan: 4,
      jumlahDiterima: 4,
    },
    pemeriksaan: {
      diperiksaOleh: "Kepala GA",
      tanggalPemeriksaan: "01/08/2025",
      hasil: "Tidak Ditemukan barang rusak atau kurang",
    },
  };

  const openPreview = (src) => setPreviewSrc(src);
  const closePreview = () => setPreviewSrc(null);

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
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
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
              <h3 className="text-xl font-semibold text-teal-600">Cek Dokumen Penerimaan</h3>
              <Link href="/finance/data_pemesanan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">&lt; Kembali</button>
              </Link>
            </div>

            {/* ringkasan PB (tabel sederhana) */}
            <div className="px-6 py-4 border-b-4 border-b-gray-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th className="py-2">ID PB</th>
                      <th className="py-2">Tanggal</th>
                      <th className="py-2">Nama Barang</th>
                      <th className="py-2">Divisi</th>
                      <th className="py-2">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="py-3 font-medium">{pb.id}</td>
                      <td className="py-3">{pb.tanggal}</td>
                      <td className="py-3">{pb.namaBarang}</td>
                      <td className="py-3">{pb.divisi}</td>
                      <td className="py-3">{pb.jumlah}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Nota / PO preview */}
            <div className="px-6 pt-6 pb-4 border-b">
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
              </div>
            </div>

            {/* Informasi Umum */}
            <div className="px-6 py-6 border-b">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Informasi Umum</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Tanggal Penerimaan</label>
                  <input type="text" value={pb.informasiUmum.tanggalPenerimaan} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Penerima</label>
                  <input type="text" value={pb.informasiUmum.penerima} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
              </div>
            </div>

            {/* Rincian Barang Diterima */}
            <div className="px-6 py-6 border-b">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Rincian Barang Diterima</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Nama Barang</label>
                  <input type="text" value={pb.namaBarang} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Spesifikasi</label>
                  <input type="text" value={pb.rincian.spesifikasi} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Jumlah Dipesan</label>
                  <input type="text" value={pb.rincian.jumlahDipesan} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Jumlah Diterima</label>
                  <input type="text" value={pb.rincian.jumlahDiterima} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
              </div>
            </div>

            {/* Pemeriksaan & Verifikasi + Foto Bukti */}
            <div className="px-6 py-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Pemeriksaan & Verifikasi</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Diperiksa oleh</label>
                  <input type="text" value={pb.pemeriksaan.diperiksaOleh} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Tanggal Pemeriksaan</label>
                  <input type="text" value={pb.pemeriksaan.tanggalPemeriksaan} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="font-medium text-gray-700">Hasil Pemeriksaan</label>
                  <input type="text" value={pb.pemeriksaan.hasil} disabled className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1 text-sm" />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="font-medium text-gray-700 block mb-2">Foto Bukti</label>
                  <div className="flex gap-4 items-start">
                    {pb.bukti.map((b, idx) => (
                      <div key={idx}>{renderThumb(b, `bukti-${idx}`)}</div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">maks 3, png, jpg, jpeg</div>
                </div>
              </div>

              {/* tombol selesai di kanan bawah kartu */}
              <div className="flex justify-end mt-8 px-2">
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow">Selesai</button>
              </div>
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
