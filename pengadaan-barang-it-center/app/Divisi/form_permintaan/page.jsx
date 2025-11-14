"use client";
import Link from "next/link";
import React from "react";
import { Search } from "lucide-react";

export default function FormPermintaanBarangPage() {
  const dataBarang = [
    { no: 1, kategori: "ATK", namaBarang: "Pulpen", jumlah: "20", keterangan: "Kebutuhan meeting" },
    { no: 2, kategori: "Elektronik", namaBarang: "Mouse", jumlah: "10", keterangan: "Untuk staf baru" },
  ];

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
              <Link href="/divisi/dashboard_divisi">
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

              <Link href="/Divisi/form_permintaan">
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

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
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
                    placeholder="Nama"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Divisi</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                    <option>Pilih Divisi</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>IT Support</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700">Tanggal Kebutuhan</label>
                  <input
                    type="date"
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
                  <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                    <option>Pilih Kategori</option>
                    <option>ATK</option>
                    <option>Elektronik</option>
                    <option>Furniture</option>
                    <option>Lainnya</option>
                  </select>
                </div>

                {/* Nama Barang */}
                <div>
                  <label className="font-medium text-gray-800">Nama Barang</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded px-3 py-2"
                      placeholder="Nama barang"
                    />
                    <button className="bg-gray-300 hover:bg-gray-400 rounded px-3 py-2">
                      <Search className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Spesifikasi (Dropdown) */}
                <div>
                  <label className="font-medium text-gray-700">Spesifikasi</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                    <option>Pilih Spesifikasi</option>
                    <option>Standar</option>
                    <option>Premium</option>
                    <option>Custom</option>
                  </select>
                </div>

                {/* Jumlah */}
                <div>
                  <label className="font-medium text-gray-700">Jumlah</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  />
                </div>

                {/* Keterangan */}
                <div className="md:col-span-2">
                  <label className="font-medium text-gray-700">Keterangan</label>
                  <textarea
                    rows="3"
                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                  ></textarea>
                </div>
              </div>

              {/* Tombol Tambah */}
              <div className="mt-4 flex justify-end">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
                  Tambah
                </button>
              </div>
            </div>

            {/* Tabel Barang */}
            <div className="px-6 py-4 bg-white">
              <table className="w-full border-collapse text-x1">
                <thead>
                  <tr className="bg-white text-left">
                    <th className="px-4 py-2 font-semibold">No</th>
                    <th className="px-4 py-2 font-semibold">Kategori</th>
                    <th className="px-4 py-2 font-semibold">Nama Barang</th>
                    <th className="px-4 py-2 font-semibold">Jumlah</th>
                    <th className="px-4 py-2 font-semibold">Keterangan</th>
                    <th className="px-4 py-2 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataBarang.map((row, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                    >
                      <td className="px-4 py-2">{row.no}</td>
                      <td className="px-4 py-2">{row.kategori}</td>
                      <td className="px-4 py-2">{row.namaBarang}</td>
                      <td className="px-4 py-2">{row.jumlah}</td>
                      <td className="px-4 py-2">{row.keterangan}</td>
                      <td className="px-4 py-2">
                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                          x
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tombol Simpan & Kirim */}
              <div className="flex justify-end gap-3 mt-6">
                <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded">
                  Simpan
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                  Kirim
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
