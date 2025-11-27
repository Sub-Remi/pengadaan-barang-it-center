"use client";
import Link from "next/link";
import { useState } from "react";
import jsPDF from "jspdf";

export default function FormPenerimaanBarangPage() {
  const [fotoBukti, setFotoBukti] = useState([]);
  const [fotoBuktiBase64, setFotoBuktiBase64] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // ✔ FIXED: fungsi upload + convert base64 yang benar
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setFotoBukti(files);

    const promises = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then((base64List) => {
      setFotoBuktiBase64(base64List); // ✔ base64 berurutan dan lengkap
    });
  };

  // ✔ Preview kecil di form
  const renderPreview = (files) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="flex gap-3 mt-3">
        {files.map((file, i) => (
          <img
            key={i}
            src={URL.createObjectURL(file)}
            className="w-20 h-20 object-cover rounded cursor-pointer border"
            onClick={() => setPreviewImage(URL.createObjectURL(file))}
          />
        ))}
      </div>
    );
  };

  // ✔ Generate PDF lengkap + foto
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Form Penerimaan Barang", 20, 20);

    // -----------------------------
    // Ambil nilai input
    // -----------------------------
    const tanggalPenerimaan = document.querySelectorAll('input[type="date"]')[0]
      ?.value;
    const tanggalPemeriksaan = document.querySelectorAll('input[type="date"]')[1]
      ?.value;

    const textInputs = document.querySelectorAll('input[type="text"]');

    const namaBarang = textInputs[0]?.value || "-";
    const satuan = textInputs[1]?.value || "-";
    const jumlahDipesan = textInputs[2]?.value || "-";
    const jumlahDiterima = textInputs[3]?.value || "-";
    const hasilPemeriksaan = textInputs[4]?.value || "-";

    // -----------------------------
    // Isi Data di PDF
    // -----------------------------
    doc.setFontSize(11);
    doc.text("Tanggal Penerimaan: ", 20, 40);
    doc.text(tanggalPenerimaan || "-", 80, 40);

    doc.text("Penerima: GA ", 20, 50);
  
    doc.text(`Nama Barang: ${namaBarang}`, 20, 80);
    doc.text(`Satuan: ${satuan}`, 20, 90);
    doc.text(`Jumlah Dipesan: ${jumlahDipesan}`, 20, 100);
    doc.text(`Jumlah Diterima: ${jumlahDiterima}`, 20, 110);

    doc.text("Pemeriksaan & Verifikasi:", 20, 130);
    doc.text("Diperiksa oleh: GA", 20, 140);
    doc.text(`Tanggal Pemeriksaan: ${tanggalPemeriksaan || "-"}`, 20, 150);
    doc.text(`Hasil Pemeriksaan: ${hasilPemeriksaan}`, 20, 160);

    // -----------------------------
    // FOTO BUKTI DI PDF (FIXED)
    // -----------------------------
    if (fotoBuktiBase64.length > 0) {
      doc.setFontSize(12);
      doc.text("Lampiran Foto Bukti:", 20, 175);

      fotoBuktiBase64.forEach((img, i) => {
        const x = 20 + (i % 3) * 60; // kolom
        const y = 185 + Math.floor(i / 3) * 60; // baris

        doc.addImage(img, "JPEG", x, y, 50, 50);
      });
    }

    doc.save("form-penerimaan-barang.pdf");
  };

  const handleSubmit = () => {
    alert("Data terkirim!");
  };

  return (
    <div className="font-poppins bg-gray-100">
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
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  List Pemesanan
                </li>
              </Link>

              <Link href="/GA/form_penerimaanbarang">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Form Penerimaan
                </li>
              </Link>
          </ul>
        </nav>
      </aside>

      {/* Main Wrapper */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        {/* Header */}
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10" />

        {/* Main Content */}
        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Title */}
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

            {/* ----------- FORM CONTENT ------------ */}
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
                    value="GA"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 mt-1 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rincian Barang */}
            <div className="px-6 py-5 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Rincian Barang Diterima
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Nama Barang", "Satuan", "Jumlah Dipesan", "Jumlah Diterima"].map(
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
                  <label className="font-medium text-gray-700">
                    Diperiksa oleh
                  </label>
                  <input
                    type="text"
                    value="GA"
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
                  <label className="font-medium text-gray-700">
                    Hasil Pemeriksaan
                  </label>
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
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="border border-gray-400 rounded-md px-3 py-2 text-sm w-40 bg-gray-100 hover:bg-gray-200"
                  />

                  <small className="text-gray-500 text-xs mt-1 block">
                    *.png, .jpg, .jpeg
                  </small>

                  {renderPreview(fotoBukti)}
                </div>
              </div>

              {/* Tombol */}
              <div className="flex justify-end mt-8 gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="font-medium px-5 py-2 rounded text-white shadow bg-blue-600 hover:bg-blue-700"
                >
                  Download PDF
                </button>

                
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* POPUP Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-w-[90%] max-h-[90%] rounded-lg border-4 border-white shadow-xl"
          />
        </div>
      )}
    </div>
  );
}
