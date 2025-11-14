"use client";
import Link from "next/link";
import React from "react";

function DashboardGA() {
  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
      {/* Header */}
      <header className="flex bg-white shadow-sm items-center">
        {/* Logo kiri */}
        <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>

        {/* Putih memanjang kanan */}
        <div className="flex-1 h-20 flex items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800"></h1>
        </div>
      </header>

      {/* Konten utama */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1">
          <nav className="flex-1 mt-6">
            <ul className="space-y-1">
              <Link href="/GA/dashboard_ga">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              {/* DATA MASTER */}
              <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
                DATA MASTER
              </li>

              <Link href="/GA/data_permintaan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">Permintaan</li>
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
            </ul>
          </nav>
        </aside>

        {/* Dashboard */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>

          <div className="flex flex-wrap gap-6">
            {/* Permintaan Baru */}
            <Link href="/GA/data_permintaan">
              <div className="relative bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></div>
                <h2 className="text-blue-800 font-medium mb-2">Permintaan Baru</h2>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </Link>

            {/* Permintaan yang diproses */}
            <Link href="/GA/data_permintaan">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                <h3 className="text-blue-800 font-medium mb-2">Permintaan Diproses</h3>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </Link>

            {/* Pemesanan */}
            <Link href="/GA/list_pemesanan">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-teal-500 text-xl">
                <h3 className="text-teal-600 font-medium mb-2">Pemesanan</h3>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </Link>

            {/* Total Divisi */}
            <Link href="/GA/data_divisi">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                <h3 className="text-blue-800 font-medium mb-2">Total Divisi</h3>
                <p className="text-2xl font-semibold">8</p>
              </div>
            </Link>

            {/* Total User */}
            <Link href="/GA/manajemen_user">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                <h3 className="text-blue-800 font-medium mb-2">Total User</h3>
                <p className="text-2xl font-semibold">7</p>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardGA;
