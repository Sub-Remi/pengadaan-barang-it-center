"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function TambahBarangPage() {
  const [formData, setFormData] = useState({
    kode: "",
    kategori: "",
    nama: "",
    spesifikasi: "",
    satuan: "",
    stok: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      {/* Header */}
      <header className="flex bg-white shadow-sm items-center">
        <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-20 flex items-center px-8"></div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1">
          <nav className="flex-1 mt-6">
            <ul className="space-y-1">
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Form Penerimaan
                </li>
              </Link>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Barang</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Tambah Barang
              </h3>
              <Link href="/GA/data_barang">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Form Input */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kode Barang */}
                <div>
                  <label className="font-medium text-gray-700">
                    Kode Barang
                  </label>
                  <input
                    type="text"
                    name="kode"
                    value={formData.kode}
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Kategori Barang (Dropdown) */}
                <div>
                  <label className="font-medium text-gray-700">
                    Kategori Barang
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    <option value="ATK">ATK</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Perabot">Perabot</option>
                  </select>
                </div>

                {/* Nama Barang */}
                <div>
                  <label className="font-medium text-gray-700">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Satuan */}
                <div>
                  <label className="font-medium text-gray-700">
                    Kategori Barang
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">-- Pilih Satuan --</option>
                    <option value="ATK">Rim</option>
                    <option value="Elektronik">Unit</option>
                    <option value="Perabot">Pack</option>
                  </select>
                </div>

                {/* Stok */}
                <div>
                  <label className="font-medium text-gray-700">Stok</label>
                  <input
                    type="number"
                    name="stok"
                    value={formData.stok}
                    onChange={handleChange}
                    className="w-full border border-gray-400 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Tombol Tambah */}
              <div className="flex justify-end mt-8">
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded">
                  Tambah
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
