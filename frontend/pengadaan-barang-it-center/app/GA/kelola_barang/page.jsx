"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function DetailBarangPage() {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
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
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">Detail Barang</h3>
              <Link href="/GA/data_barang">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Isi form */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dropdown Kategori */}
                <div>
                  <label className="font-medium text-gray-700">Kategori Barang</label>
                  <select
                    disabled={!isEditMode}
                    className={`w-full border rounded px-3 py-2 mt-1 transition ${
                      isEditMode
                        ? "border-gray-300 bg-white text-gray-800"
                        : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <option>ATK</option>
                    <option>Elektronik</option>
                    <option>Perabot</option>
                  </select>
                </div>

                {/* Nama Barang */}
                <div>
                  <label className="font-medium text-gray-700">Nama Barang</label>
                  <input
                    type="text"
                    defaultValue="Kertas HVS A4"
                    disabled={!isEditMode}
                    className={`w-full border rounded px-3 py-2 mt-1 transition ${
                      isEditMode
                        ? "border-gray-300 bg-white text-gray-800"
                        : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Dropdown Spesifikasi */}
                <div>
                  <label className="font-medium text-gray-700">Spesifikasi</label>
                  <input
                    type="text"
                    defaultValue="A4"
                    disabled={!isEditMode}
                    className={`w-full border rounded px-3 py-2 mt-1 transition ${
                      isEditMode
                        ? "border-gray-300 bg-white text-gray-800"
                        : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Satuan */}
                <div>
                  <label className="font-medium text-gray-700">Satuan</label>
                  <input
                    type="text"
                    defaultValue="Rim"
                    disabled={!isEditMode}
                    className={`w-full border rounded px-3 py-2 mt-1 transition ${
                      isEditMode
                        ? "border-gray-300 bg-white text-gray-800"
                        : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Stok */}
                <div>
                  <label className="font-medium text-gray-700">Stok</label>
                  <input
                    type="number"
                    defaultValue="70"
                    disabled={!isEditMode}
                    className={`w-full border rounded px-3 py-2 mt-1 transition ${
                      isEditMode
                        ? "border-gray-300 bg-white text-gray-800"
                        : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Tombol Simpan dan Ubah */}
              <div className="flex justify-end mt-8 gap-2">
                <button
                  onClick={handleEditToggle}
                  className={`${
                    isEditMode
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-5 py-2 rounded`}
                >
                  {isEditMode ? "Batal" : "Ubah"}
                </button>
                <button
                  disabled={!isEditMode}
                  className={`px-5 py-2 font-medium rounded text-white transition ${
                    isEditMode
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Simpan
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