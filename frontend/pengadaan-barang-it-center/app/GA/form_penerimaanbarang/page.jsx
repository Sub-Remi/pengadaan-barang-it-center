"use client";
import Link from "next/link";
import { useState } from "react";
import jsPDF from "jspdf";
import { FaDownload, FaPaperPlane } from "react-icons/fa";

export default function FormPenerimaanBarangPage() {
  const [fotoBukti, setFotoBukti] = useState([]);
  const [fotoBuktiBase64, setFotoBuktiBase64] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi upload + convert base64
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
      setFotoBuktiBase64(base64List);
    });
  };

  // Preview kecil di form
  const renderPreview = (files) => {
    if (!files || files.length === 0) return null;

    return (
      <div className="flex gap-3 mt-3">
        {files.map((file, i) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(file)}
              className="w-20 h-20 object-cover rounded cursor-pointer border border-gray-300 hover:opacity-80 transition-opacity"
              onClick={() => setPreviewImage(URL.createObjectURL(file))}
              alt={`Preview ${i + 1}`}
            />
            <span className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {i + 1}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Generate PDF lengkap + foto
  const handleDownloadPDF = () => {
    setLoading(true);
    
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("Form Penerimaan Barang", 20, 20);

    // Ambil nilai input
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

    // Isi Data di PDF
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

    // FOTO BUKTI DI PDF
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
    setLoading(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulasi proses submit
    setTimeout(() => {
      alert("Form Penerimaan Barang berhasil dikirim!");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8">
          {/* Kosong untuk saat ini, bisa diisi dengan user profile dll */}
        </div>
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
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
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
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                    Form Penerimaan
                  </li>
                </Link>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content - Scrollable dengan padding yang lebih baik */}
        <main className="flex-1 text-black p-6 bg-gray-200 overflow-y-auto ml-60">
          {/* Fixed header untuk judul halaman */}
          <div className="bg-gray-200 pt-4 pb-4 mb-6">
            <h2 className="text-2xl text-black font-semibold">Pemesanan</h2>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header atas card */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Form Penerimaan Barang
              </h3>
              <Link href="/GA/list_pemesanan">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* ----------- FORM CONTENT ------------ */}
            {/* Informasi Umum */}
            <div className="px-6 py-6 border-b">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Informasi Umum
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-sm text-gray-700 mb-1">
                    Tanggal Penerimaan
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-1">Penerima</label>
                  <input
                    type="text"
                    value="GA"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rincian Barang */}
            <div className="px-6 py-6 border-b">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Rincian Barang Diterima
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Nama Barang", "Satuan", "Jumlah Dipesan", "Jumlah Diterima"].map(
                  (label, i) => (
                    <div key={i}>
                      <label className="font-medium text-sm text-gray-700 mb-1">{label}</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <label className="font-medium text-sm text-gray-700 mb-1">
                    Diperiksa oleh
                  </label>
                  <input
                    type="text"
                    value="GA"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="font-medium text-sm text-gray-700 mb-1">
                    Tanggal Pemeriksaan
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-medium text-sm text-gray-700 mb-1">
                    Hasil Pemeriksaan
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Contoh: Barang lengkap, kondisi baik, sesuai spesifikasi"
                  />
                </div>

                {/* Upload Bukti */}
                <div className="col-span-2">
                  <label className="font-medium text-sm text-gray-700 mb-1">
                    Foto Bukti Penerimaan (Maksimal 3 file)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded text-sm cursor-pointer transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Pilih File
                      </label>
                    </div>
                    <div className="text-sm text-gray-500">
                      {fotoBukti.length > 0 ? (
                        <span>{fotoBukti.length} file terpilih</span>
                      ) : (
                        <span>Belum ada file terpilih</span>
                      )}
                    </div>
                  </div>
                  
                  <small className="text-gray-500 text-xs mt-1 block">
                    Format: .png, .jpg, .jpeg (Maksimal 3 file)
                  </small>

                  {renderPreview(fotoBukti)}
                </div>
              </div>

              {/* Tombol */}
              <div className="flex justify-end mt-8 gap-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 rounded text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download PDF
                    </>
                  )}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 rounded text-sm font-medium transition-colors bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Kirim Form
                    </>
                  )}
                </button>
              </div>

              {/* Catatan */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-gray-700 mb-2 text-sm flex items-center">
                  <span className="mr-2">📝</span> Petunjuk Pengisian
                </h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Isi semua field yang tersedia dengan data yang benar.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Upload foto bukti penerimaan barang (maksimal 3 file).</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Klik "Download PDF" untuk menyimpan form sebagai file PDF.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Klik "Kirim Form" untuk mengirimkan form ke sistem.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>

      {/* POPUP Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-4xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              ✕
            </button>
            <img
              src={previewImage}
              className="max-w-full max-h-[90vh] rounded-lg border-4 border-white shadow-xl"
              alt="Preview Foto"
            />
          </div>
        </div>
      )}
    </div>
  );
}