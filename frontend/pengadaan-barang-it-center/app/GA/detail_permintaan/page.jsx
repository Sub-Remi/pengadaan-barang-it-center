"use client";
import Link from "next/link";
import React from "react";

export default function DetailPengadaanPage() {
  return (
    <div className="flex h-screen font-poppins bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1 fixed top-0 left-0 h-full">
        <div className="h-20 border-b border-white flex items-center justify-center bg-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32 border-white" />
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
              <li className="bg-blue-500 px-5 py-2 cursor-pointer">Permintaan</li>
            </Link>
            <Link href="/GA/data_barang">
              <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Barang</li>
            </Link>
            <Link href="/GA/data_divisi">
              <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Divisi</li>
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
              <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Laporan</li>
            </Link>
            <Link href="/GA/riwayat_ga">
              <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Riwayat</li>
            </Link>
            <hr className="border-t border-white/30 my-2" />
            <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
              PEMESANAN
            </li>
            <Link href="/GA/list_pemesanan">
              <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                List Pemesanan
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

          </div>
        </header>

        {/* Main Content Scrollable */}
        <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
          <h2 className="text-3xl font-semibold mb-6">Permintaan</h2>

          {/* ---- Konten kamu dari sini ---- */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
              <h3 className="text-xl font-semibold text-teal-600">
                Detail Pengadaan
              </h3>
              <Link href="/GA/data_permintaan">
                <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                  &lt; Kembali
                </button>
              </Link>
            </div>

            {/* Data Pemohon */}
            <div className="px-6 py-4 border-b-4 border-b-gray-300">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Data Pemohon
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700">Nama Pemohon</label>
                  <input
                    type="text"
                    value="John Doe"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Departemen/Divisi</label>
                  <input
                    type="text"
                    value="Finance"
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
                  <label className="font-medium text-gray-700">Tanggal Kebutuhan</label>
                  <input
                    type="text"
                    value="2025-10-01"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Data Barang 1 */}
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
                    value="Laptop Lenovo ThinkPad"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Spesifikasi</label>
                  <input
                    type="text"
                    value="Core i5, RAM 16GB, SSD 512GB"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Jumlah</label>
                  <input
                    type="text"
                    value="5 Unit"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Status</label>
                  <input
                    type="text"
                    value="Menunggu Validasi"
                    disabled
                    className="w-full border border-gray-300 bg-yellow-100 text-yellow-700 font-semibold rounded px-3 py-2 mt-1"
                  />
                </div>

              </div>

              {/* Keterangan */}
              <div className="mt-4">
                <label className="font-medium text-gray-700">Keterangan</label>
                <textarea
                  value="Pengadaan untuk kebutuhan operasional IT Support"
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  rows="3"
                />
              </div>
               {/* Tombol Aksi */}
            <div className="flex justify-end gap-3 px-2 py-5">
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded">
                Tolak
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded">
                Ajukan Pembelian
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded">
                Validasi
              </button>
            </div>
            </div>


            {/* Data Barang 2 */}
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
                    value="Laptop Lenovo ThinkPad"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Spesifikasi</label>
                  <input
                    type="text"
                    value="Core i5, RAM 16GB, SSD 512GB"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Jumlah</label>
                  <input
                    type="text"
                    value="5 Unit"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Status</label>
                  <input
                    type="text"
                    value="Mengajukan Pemesanan"
                    disabled
                    className="w-full border border-gray-300 bg-blue-700 text-white font-semibold rounded px-3 py-2 mt-1"
                  />
                </div>

              </div>

              {/* Keterangan */}
              <div className="mt-4">
                <label className="font-medium text-gray-700">Keterangan</label>
                <textarea
                  value="Pengadaan untuk kebutuhan operasional IT Support"
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  rows="3"
                />
              </div>
              {/* Tombol Aksi */}
            <div className="flex justify-end gap-3 px-2 py-5">
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded">
                Tolak
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded">
                Ajukan Pembelian
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded">
                Validasi
              </button>
            </div>
            </div>

            {/* Data Barang 3 */}
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
                    value="Laptop Lenovo ThinkPad"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Spesifikasi</label>
                  <input
                    type="text"
                    value="Core i5, RAM 16GB, SSD 512GB"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Jumlah</label>
                  <input
                    type="text"
                    value="5 Unit"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Status</label>
                  <input
                    type="text"
                    value="Divalidasi"
                    disabled
                    className="w-full border border-gray-300 bg-green-600 text-white font-semibold rounded px-3 py-2 mt-1"
                  />
                </div>

              </div>

              {/* Keterangan */}
              <div className="mt-4">
                <label className="font-medium text-gray-700">Keterangan</label>
                <textarea
                  value="Pengadaan untuk kebutuhan operasional IT Support"
                  disabled
                  className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                  rows="3"
                />
              </div>
              {/* Tombol Aksi */}
            <div className="flex justify-end gap-3 px-2 py-5">
              <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded">
                Tolak
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded">
                Ajukan Pembelian
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded">
                Validasi
              </button>
            </div>
            </div>
            <div className="flex justify-end px-8 py-5">
                <button className="bg-lime-600 hover:bg-lime-700 text-white font-medium px-5 py-2 rounded">
                Simpan
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
