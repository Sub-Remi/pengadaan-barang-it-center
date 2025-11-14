"use client";
import Link from "next/link";
import React from "react";

export default function LaporanGAPage() {
  const data = [
    { no: 1, divisi: "HR", tanggal: "01/10/2025", kategori: "ATK", status: "Diproses" },
    { no: 2, divisi: "Marketing", tanggal: "02/10/2025", kategori: "Perlengkapan IT", status: "Menunggu" },
    { no: 3, divisi: "Finance", tanggal: "03/10/2025", kategori: "Perabot Kantor", status: "Selesai" },
    { no: 4, divisi: "IT Support", tanggal: "06/10/2025", kategori: "ATK", status: "Diproses" },
    { no: 5, divisi: "Marketing", tanggal: "07/10/2025", kategori: "Perabot Kantor", status: "Selesai" },
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">Laporan</li>
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
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Laporan</h2>

          {/* Card Container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header Atas */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Laporan Pengadaan
              </h3>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="font-medium text-gray-700">Kategori:</label>
                <select className="border border-gray-300 rounded px-2 py-1 text-x1">
                  <option>Pilih</option>
                  <option>ATK</option>
                  <option>Perlengkapan IT</option>
                  <option>Perabot Kantor</option>
                </select>

                <label className="font-medium text-gray-700">Dari Tanggal:</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded px-2 py-1 text-x1"
                />

                <label className="font-medium text-gray-700">Sampai Tanggal:</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded px-2 py-1 text-x1"
                />

                <label className="font-medium text-gray-700">Divisi:</label>
                <select className="border border-gray-300 rounded px-2 py-1 text-x1">
                  <option>Pilih</option>
                  <option>HR</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>IT Support</option>
                </select>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded">
                  Excel
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded">
                  PDF
                </button>
              </div>
            </div>

            {/* Tabel */}
            <table className="w-full border-collapse text-x1">
              <thead>
                <tr className="bg-white text-left">
                  <th className="px-6 py-3 font-semibold">No</th>
                  <th className="px-6 py-3 font-semibold">Divisi</th>
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-6 py-3 font-semibold">Kategori</th>
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
                    <td className="px-6 py-3">{row.tanggal}</td>
                    <td className="px-6 py-3">{row.kategori}</td>
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

          {/* Statistik Bawah */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Total Permintaan</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">5</h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Permintaan Selesai</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">2</h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Permintaan Diproses</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">2</h3>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-600 font-medium">Permintaan Ditolak</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-2">0</h3>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
