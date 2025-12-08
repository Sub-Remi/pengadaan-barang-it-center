"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import authService from '../../../lib/authService';

function DashboardGA() {
  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-gray-200">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800"></h1>
        </div>
      </header>

      {/* Konten utama */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar - Fixed dengan tinggi yang tepat dan scrollable */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col fixed left-0 top-16 bottom-0">
          {/* Container scrollable untuk menu */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <style jsx>{`
              /* Custom scrollbar untuk semua browser */
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #3b82f6 #1e3a8a;
              }
              
              /* Untuk WebKit browsers (Chrome, Safari, Edge) */
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #1e3a8a; /* blue-900 */
                border-radius: 4px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #3b82f6; /* blue-500 */
                border-radius: 4px;
                border: 2px solid #1e3a8a;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #60a5fa; /* blue-400 */
              }
            `}</style>
            
            <nav className="p-2 text-x1">
              <ul className="space-y-1">
                <Link href="/GA/dashboard_ga">
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                    Dashboard
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                {/* DATA MASTER */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
                  DATA MASTER
                </li>

                <Link href="/GA/data_permintaan">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Permintaan
                  </li>
                </Link>

                <Link href="/GA/data_barang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Barang
                  </li>
                </Link>

                <Link href="/GA/data_kategoribarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Kategori Barang
                  </li>
                </Link>

                <Link href="/GA/data_satuanbarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Satuan Barang
                  </li>
                </Link>

                <Link href="/GA/data_stokbarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Stok Barang
                  </li>
                </Link>

                <Link href="/GA/data_divisi">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Divisi
                  </li>
                </Link>

                <Link href="/GA/manajemen_user">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Manajemen User
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                {/* MONITORING */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
                  MONITORING
                </li>

                <Link href="/GA/laporan_ga">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Laporan
                  </li>
                </Link>

                <Link href="/GA/riwayat_ga">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Riwayat
                  </li>
                </Link>

                <hr className="border-t border-white/30 my-2" />

                {/* PEMESANAN */}
                <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-sm">
                  PEMESANAN
                </li>

                <Link href="/GA/list_pemesanan">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    List Pemesanan
                  </li>
                </Link>

                <Link href="/GA/form_penerimaanbarang">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                    Form Penerimaan
                  </li>
                </Link>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 bg-gray-200 overflow-y-auto ml-60">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Dashboard</h2>

          <div className="flex flex-wrap gap-6">
            {/* Permintaan Baru */}
            <Link href="/GA/data_permintaan">
              <div className="relative bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></div>
                <h2 className="text-blue-800 font-medium mb-2">Permintaan Baru</h2>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </Link>

            {/* Permintaan yang diproses */}
            <Link href="/GA/data_permintaan">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-blue-800 font-medium mb-2">Permintaan Diproses</h3>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </Link>

            {/* Pemesanan */}
            <Link href="/GA/list_pemesanan">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-teal-500 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-teal-600 font-medium mb-2">Pemesanan</h3>
                <p className="text-2xl font-semibold">11</p>
              </div>
            </Link>

            {/* Total Divisi */}
            <Link href="/GA/data_divisi">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-blue-800 font-medium mb-2">Total Divisi</h3>
                <p className="text-2xl font-semibold">8</p>
              </div>
            </Link>

            {/* Total User */}
            <Link href="/GA/manajemen_user">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
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