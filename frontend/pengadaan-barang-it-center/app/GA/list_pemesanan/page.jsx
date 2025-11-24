"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

export default function ListPemesananPage() {
  // DATA PERMINTAAN
  const dataPermintaan = [
    { no: 1, idpb: "10111", tanggal: "01/01/2025", barang: "Laptop", status: "Selesai" },
    { no: 2, idpb: "10777", tanggal: "02/06/2025", barang: "Kertas HVS", status: "Diproses" },
  ];

  // DATA INDEPENDEN
  const dataIndependen = [
    { no: 1, idpb: "9001", tanggal: "03/01/2025", barang: "Spidol", status: "Diproses" },
    { no: 2, idpb: "9002", tanggal: "05/01/2025", barang: "Map Arsip", status: "Selesai" },
  ];

  // STATE FILTER AKTIF
  const [filter, setFilter] = useState("permintaan");

  // DATA YANG DITAMPILKAN
  const displayedData = filter === "permintaan" ? dataPermintaan : dataIndependen;

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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
          <h2 className="text-3xl font-semibold mb-6">Pemesanan</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                List Pemesanan
              </h3>
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3 flex-wrap">

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

              <button
                onClick={() => setFilter("permintaan")}
                className={`px-4 py-1 rounded font-medium border ${
                  filter === "permintaan"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Permintaan
              </button>

              <button
                onClick={() => setFilter("independen")}
                className={`px-4 py-1 rounded font-medium border ${
                  filter === "independen"
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Independen
              </button>
              </div>
            </div>

            {/* TABLE */}
            <table className="w-full border-collapse text-x1">
              <thead>
                <tr className="bg-white text-left">
                  <th className="px-6 py-3 font-semibold">No</th>
                  <th className="px-6 py-3 font-semibold">ID PB</th>
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-6 py-3 font-semibold">Nama Barang</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <td className="px-6 py-3">{row.no}</td>
                    <td className="px-6 py-3">{row.idpb}</td>
                    <td className="px-6 py-3">{row.tanggal}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{row.barang}</td>
                    <td className="px-6 py-3">{row.status}</td>
                    <td className="px-6 py-3 text-center">
                      <Link href="/GA/detail_pemesanan">
                        <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded">
                          <FaEye />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Garis bawah */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
