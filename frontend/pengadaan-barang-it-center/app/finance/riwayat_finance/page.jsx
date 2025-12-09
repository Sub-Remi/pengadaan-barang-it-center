"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";

export default function ListPemesananPage() {
  // DATA PEMESANAN
  const dataPemesanan = [
    { no: 1, idpb: "10111", tanggal: "01/01/2025", barang: "Laptop", status: "Selesai" },
    { no: 2, idpb: "10777", tanggal: "02/06/2025", barang: "Printer", status: "Diproses" },
    { no: 3, idpb: "10112", tanggal: "03/01/2025", barang: "Monitor", status: "Selesai" },
    { no: 4, idpb: "10778", tanggal: "05/01/2025", barang: "Keyboard", status: "Diproses" },
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
              <Link href="/finance/dashboard_finance">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-gray-200">PEMESANAN</li>

              <Link href="/finance/data_pemesanan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Data Pemesanan</li>
              </Link>

              <Link href="/finance/riwayat_finance">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Riwayat
                </li>
              </Link>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl text-black font-semibold mb-6">Riwayat</h2>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Riwayat Pemesanan
              </h3>
            </div>

            {/* FILTER TANGGAL */}
            <div className="flex flex-wrap items-center px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="font-medium text-black">Dari Tanggal:</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded px-2 py-1 text-x1"
                />

                <label className="font-medium text-black">Sampai Tanggal:</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded px-2 py-1 text-x1"
                />
              </div>
            </div>

            {/* TABLE */}
            <table className="w-full text-black border-collapse text-x1">
              <thead>
                <tr className="bg-white text-left">
                  <th className="px-6 py-3 font-semibold">No</th>
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Tanggal</th>
                  <th className="px-6 py-3 font-semibold">Nama Barang</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {dataPemesanan.map((row, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                  >
                    <td className="px-6 py-3">{row.no}</td>
                    <td className="px-6 py-3">{row.idpb}</td>
                    <td className="px-6 py-3">{row.tanggal}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{row.barang}</td>
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

            {/* Garis bawah */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}