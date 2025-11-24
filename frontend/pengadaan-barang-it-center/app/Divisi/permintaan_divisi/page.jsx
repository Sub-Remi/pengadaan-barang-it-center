"use client";
import Link from "next/link";
import React from "react";
import { FaPlus, FaEye } from "react-icons/fa";

export default function PermintaanPage() {
  const data = [
    { no: 1, idPB: "00000", judul: "Permintaan", tanggal: "dd/mm/yyyy", status: "Menunggu" },
    { no: 2, idPB: "00000", judul: "Permintaan", tanggal: "dd/mm/yyyy", status: "Selesai" },
    { no: 3, idPB: "00000", judul: "Permintaan", tanggal: "dd/mm/yyyy", status: "Menunggu" },
    { no: 4, idPB: "00000", judul: "Permintaan", tanggal: "dd/mm/yyyy", status: "Diproses" },
    { no: 5, idPB: "00000", judul: "Permintaan", tanggal: "dd/mm/yyyy", status: "Menunggu" },
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
              <Link href="/Divisi/dashboard_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-x1 text-gray-200 mt-2 cursor-default">
                PENGADAAN
              </li>

              <Link href="/Divisi/draf_permintaan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Draf Permintaan
                </li>
              </Link>

              <Link href="/Divisi/permintaan_divisi">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Permintaan
                </li>
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

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">Data Permintaan</h3>
              <Link href="/Divisi/form_permintaan">
              <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                <FaPlus />
                Tambah Permintaan
              </button>
              </Link>
            </div>

            {/* Filter dan tombol Excel/PDF */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <label htmlFor="search" className="text-gray-700 font-medium">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1 text-x1"
                />

                <label className="font-medium text-gray-700">Dari Tanggal</label>
              <input type="date" className="border border-gray-300 rounded px-2 py-1" />

              <label className="font-medium text-gray-700">Sampai Tanggal</label>
              <input type="date" className="border border-gray-300 rounded px-2 py-1" />
              
                <select className="border border-gray-300 rounded px-2 py-1 text-x1">
                  <option>Semua</option>
                  <option>Menunggu</option>
                  <option>Selesai</option>
                  <option>Diproses</option>
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
                <tr className="bg-white text-left border-b">
                  <th className="px-6 py-3 font-semibold">No</th>
                  <th className="px-6 py-3 font-semibold">Id PB</th>
                  <th className="px-6 py-3 font-semibold">Judul</th>
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-3">{row.no}</td>
                    <td className="px-6 py-3">{row.idPB}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {row.judul}
                    </td>
                    <td className="px-6 py-3">{row.tanggal}</td>
                    <td className="px-6 py-3">{row.status}</td>
                    <td className="px-6 py-3 text-center">
                        <Link href="/Divisi/detail_permintaan">
                      <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded">
                        <FaEye />
                      </button>
                      </Link>
                    </td>
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
