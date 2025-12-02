"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function FormPermintaanBarangPage() {
  const [barangList, setBarangList] = useState([]);
  const [formData, setFormData] = useState({
    judul: "",
    tanggalPermintaan: "",
    kategoriBarang: "",
    namaBarang: "",
    satuan: "",
    jumlah: "",
    keterangan: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTambahBarang = () => {
    if (!formData.kategoriBarang || !formData.namaBarang || !formData.jumlah) {
      alert("Kategori, Nama Barang, dan Jumlah harus diisi!");
      return;
    }

    const newBarang = {
      no: barangList.length + 1,
      kategori: formData.kategoriBarang,
      namaBarang: formData.namaBarang,
      satuan: formData.satuan,
      jumlah: formData.jumlah,
      keterangan: formData.keterangan
    };

    setBarangList([...barangList, newBarang]);
     
    // Reset form barang
    setFormData(prev => ({
      ...prev,
      kategoriBarang: "",
      namaBarang: "",
      satuan: "",
      jumlah: "",
      keterangan: ""
    }));
  };

  const handleHapusBarang = (index) => {
    const newList = barangList.filter((_, i) => i !== index);
    // Update nomor urut
    const updatedList = newList.map((item, i) => ({ ...item, no: i + 1 }));
    setBarangList(updatedList);
  };

  const handleSimpanDraft = () => {
    if (barangList.length === 0) {
      alert("Tambahkan minimal 1 barang sebelum menyimpan!");
      return;
    }
    // Logic untuk simpan draft
    console.log("Simpan draft:", { formData, barangList });
    alert("Permintaan berhasil disimpan sebagai draft!");
  };

  const handleKirim = () => {
    if (barangList.length === 0) {
      alert("Tambahkan minimal 1 barang sebelum mengirim!");
      return;
    }
    if (!formData.judul || !formData.tanggalPermintaan) {
      alert("Judul Permintaan dan Tanggal Permintaan harus diisi!");
      return;
    }
    // Logic untuk kirim permintaan
    console.log("Kirim permintaan:", { formData, barangList });
    alert("Permintaan berhasil dikirim!");
  };

  return (
    <div className="flex h-screen font-poppins bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1 fixed top-0 left-0 h-full">
        <div className="h-20 border-b border-white flex items-center justify-center bg-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32 border-white" />
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 pb-6">
            <Link href="/Divisi/dashboard_divisi">
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">Permintaan</li>
              </Link>

              <Link href="/Divisi/riwayat_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Riwayat
                </li>
              </Link>
          </ul>
        </nav>
      </aside>

      {/* Main Wrapper (Header + Content) */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        {/* Header */}
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10">
          <div className="flex-1 h-full flex items-center px-8">
            {/* Header content */}
          </div>
        </header>

        {/* Main Content Scrollable */}
        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">Permintaan</h2>

          {/* Card Form */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header Form */}
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Form Permintaan Barang
              </h3>
              <Link href="/Divisi/draf_permintaan">
              <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                &lt; Kembali
              </button>
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
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Masukkan judul permintaan"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Tanggal Permintaan</label>
                  <input
                    type="date"
                    name="tanggalPermintaan"
                    value={formData.tanggalPermintaan}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Data Barang */}
            <div className="px-6 py-4 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">Data Barang</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kategori Barang */}
                <div>
                  <label className="font-medium text-gray-700">Kategori Barang</label>
                  <select 
                    name="kategoriBarang"
                    value={formData.kategoriBarang}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="ATK">ATK</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Nama Barang */}
                <div>
                  <label className="font-medium text-gray-700">Nama Barang</label>
                  <input
                    type="text"
                    name="namaBarang"
                    value={formData.namaBarang}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Masukkan nama barang"
                  />
                </div>

                {/* Satuan */}
                <div>
                  <label className="font-medium text-gray-700">Satuan</label>
                  <select 
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  >
                    <option value="">Pilih Satuan</option>
                    <option value="Rim">Rim</option>
                    <option value="Pack">Pack</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Unit">Unit</option>
                    <option value="Set">Set</option>
                  </select>
                </div>

                {/* Jumlah */}
                <div>
                  <label className="font-medium text-gray-700">Jumlah</label>
                  <input
                    type="number"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="0"
                    min="1"
                  />
                </div>

                {/* Keterangan */}
                <div className="md:col-span-2">
                  <label className="font-medium text-gray-700">Keterangan</label>
                  <textarea
                    rows="3"
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Masukkan keterangan tambahan"
                  ></textarea>
                </div>
              </div>

              {/* Tombol Tambah */}
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleTambahBarang}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                >
                  Tambah Barang
                </button>
              </div>
            </div>

            {/* Tabel Barang */}
            <div className="px-6 py-4 bg-white">
              {barangList.length > 0 ? (
                <>
                  <table className="w-full border-collapse text-x1">
                    <thead>
                      <tr className="bg-white text-left">
                        <th className="px-4 py-2 font-semibold">No</th>
                        <th className="px-4 py-2 font-semibold">Kategori</th>
                        <th className="px-4 py-2 font-semibold">Nama Barang</th>
                        <th className="px-4 py-2 font-semibold">Satuan</th>
                        <th className="px-4 py-2 font-semibold">Jumlah</th>
                        <th className="px-4 py-2 font-semibold">Keterangan</th>
                        <th className="px-4 py-2 font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barangList.map((barang, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                        >
                          <td className="px-4 py-2">{barang.no}</td>
                          <td className="px-4 py-2">{barang.kategori}</td>
                          <td className="px-4 py-2">{barang.namaBarang}</td>
                          <td className="px-4 py-2">{barang.spesifikasi}</td>
                          <td className="px-4 py-2">{barang.satuan}</td>
                          <td className="px-4 py-2">{barang.jumlah}</td>
                          <td className="px-4 py-2">{barang.keterangan}</td>
                          <td className="px-4 py-2">
                            <button 
                              onClick={() => handleHapusBarang(index)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Info jumlah barang */}
                  <div className="mt-4 text-sm text-gray-600">
                    Total barang: {barangList.length}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Belum ada barang yang ditambahkan
                </div>
              )}

              {/* Tombol Simpan & Kirim */}
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={handleSimpanDraft}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded"
                >
                  Simpan Draft
                </button>
                <button 
                  onClick={handleKirim}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                >
                  Kirim Permintaan
                </button>
              </div>
            </div>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}