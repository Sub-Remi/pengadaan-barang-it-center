"use client";

import Link from "next/link";
import React from "react";
import ProtectedRoute from "../../../app/components/ProtectedRoute";

function App() {
  return (
    <ProtectedRoute allowedRoles={["pemohon"]}>
      <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
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
                  <Link href="/Divisi/dashboard_divisi">
                    <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
                    <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
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

            {/* Dashboard */}
            <main className="flex-1 p-8 bg-gray-200">
              <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>

              <div className="flex flex-wrap gap-6">
                {/* Permintaan */}
                <Link href="/Divisi/permintaan_divisi">
                  <div className="relative bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></div>
                    <h2 className="text-blue-800 font-medium mb-2">
                      Permintaan
                    </h2>
                    <p className="text-2xl font-semibold">3</p>
                  </div>
                </Link>

                {/* Draf Permintaan */}
                <Link href="/Divisi/draf_permintaan">
                  <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                    <h3 className="text-blue-800 font-medium mb-2">
                      Draf Permintaan
                    </h3>
                    <p className="text-2xl font-semibold">3</p>
                  </div>
                </Link>

                {/* Riwayat */}
                <Link href="/Divisi/riwayat_divisi">
                  <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-teal-500 text-xl">
                    <h3 className="text-teal-600 font-medium mb-2">
                      Riwayat Permintaan
                    </h3>
                    <p className="text-2xl font-semibold">12</p>
                  </div>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default App;
