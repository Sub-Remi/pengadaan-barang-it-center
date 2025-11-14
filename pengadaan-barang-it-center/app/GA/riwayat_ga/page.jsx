"use client";
import Link from "next/link";
import React from "react";

export default function RiwayatGAPage() {
  const data = [
    { no: 1, divisi: "HR", namaBarang: "Kertas HVS A4", tanggal: "01/01/2025", jumlah: 5, status: "Selesai" },
    { no: 2, divisi: "Marketing", namaBarang: "Map Coklat A4", tanggal: "02/06/2025", jumlah: 24, status: "Ditolak" },
    { no: 3, divisi: "Finance", namaBarang: "Kertas Cover Biru", tanggal: "24/04/2025", jumlah: 10, status: "Selesai" },
    { no: 4, divisi: "IT", namaBarang: "Sticky Notes Kuning", tanggal: "04/10/2025", jumlah: 5, status: "Selesai" },
    { no: 5, divisi: "Marketing", namaBarang: "Bolpoin Hitam", tanggal: "05/05/2025", jumlah: 2, status: "Ditolak" },
  ];

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      {/* Header */}
      <header className="flex bg-white shadow-sm items-center">
        <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
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

              <li className="px-5 py-2 font-semibold text-gray-200">DATA MASTER</li>

              <Link href="/GA/data_permintaan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Permintaan</li>
              </Link>
              <Link href="/GA/data_barang">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Barang</li>
              </Link>
              <Link href="/GA/data_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Divisi</li>
              </Link>
              <Link href="/GA/manajemen_user">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Manajemen User</li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-gray-200">MONITORING</li>
              <Link href="/GA/laporan_ga">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Laporan</li>
              </Link>
              <Link href="/GA/riwayat_ga">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">Riwayat</li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-gray-200">PEMESANAN</li>
              <Link href="/GA/list_pemesanan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">List Pemesanan</li>
              </Link>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Riwayat</h2>

          {/* Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header Atas */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">Riwayat Pengadaan</h3>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b bg-white">
              <label className="font-medium text-gray-700">Search</label>
              <input
                type="text"
                placeholder="Cari nama barang..."
                className="border border-gray-300 rounded px-3 py-1"
              />

              <label className="font-medium text-gray-700">Dari Tanggal</label>
              <input type="date" className="border border-gray-300 rounded px-2 py-1" />

              <label className="font-medium text-gray-700">Sampai Tanggal</label>
              <input type="date" className="border border-gray-300 rounded px-2 py-1" />

              <label className="font-medium text-gray-700">Divisi</label>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>Pilih</option>
                <option>HR</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>IT</option>
              </select>
            </div>

            {/* Tabel */}
            <table className="w-full border-collapse text-x1">
              <thead>
                <tr className="bg-white text-left">
                  <th className="px-6 py-3 font-semibold">No</th>
                  <th className="px-6 py-3 font-semibold">Divisi</th>
                  <th className="px-6 py-3 font-semibold">Nama Barang</th>
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-6 py-3 font-semibold">Jumlah</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <td className="px-6 py-3">{row.no}</td>
                    <td className="px-6 py-3">{row.divisi}</td>
                    <td className="px-6 py-3">{row.namaBarang}</td>
                    <td className="px-6 py-3">{row.tanggal}</td>
                    <td className="px-6 py-3">{row.jumlah}</td>
                    <td className="px-6 py-3">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-end px-6 py-4 bg-white border-t">
              <div className="inline-flex text-sm border rounded-md overflow-hidden">
                <button className="px-3 py-1 bg-white hover:bg-gray-100 border-r">
                  Previous
                </button>
                <button className="px-3 py-1 bg-teal-600 text-white border-r">
                  1
                </button>
                <button className="px-3 py-1 bg-white hover:bg-gray-100 border-r">
                  2
                </button>
                <button className="px-3 py-1 bg-white hover:bg-gray-100 border-r">
                  3
                </button>
                <button className="px-3 py-1 bg-white hover:bg-gray-100">
                  Next
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
