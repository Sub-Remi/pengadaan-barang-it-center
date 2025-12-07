"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "../../../app/components/ProtectedRoute";

import { useNotification } from "../../../app/context/NotificationContext";
import { FaSync } from "react-icons/fa";

function DashboardDivisiPage() {
  const { notificationCounts, pendingChanges, fetchCounts } = useNotification();
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({
    permintaan: 0,
    draft: 0,
    riwayat: 0
  });

  const refreshDashboard = async () => {
    setLoading(true);
    await fetchCounts();
    setLoading(false);
  };

  useEffect(() => {
    setCounts(notificationCounts);
  }, [notificationCounts]);

  return (
    <ProtectedRoute allowedRoles={["pemohon"]}>
      <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
        <div className="flex flex-col min-h-screen font-poppins bg-gray-100">
          {/* Header */}
          <header className="flex bg-white shadow-sm items-center">
            <div className="bg-white w-60 h-20 flex items-center justify-center border-r border-white">
              <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
            </div>
            <div className="flex-1 h-20 flex items-center px-8">
              <button
                onClick={refreshDashboard}
                className="ml-auto flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-semibold">Dashboard</h2>
                <span className="text-sm text-gray-600">
                  Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                </span>
              </div>

              <div className="flex flex-wrap gap-6">
                {/* Permintaan */}
                <Link href="/Divisi/permintaan_divisi">
                  <div className="relative bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow">
                    {pendingChanges.hasPendingStatusChange && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">!</span>
                      </div>
                    )}
                    <h2 className="text-blue-800 font-medium mb-2">
                      Permintaan
                      {pendingChanges.hasPendingStatusChange && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Status berubah!
                        </span>
                      )}
                    </h2>
                    <p className="text-2xl font-semibold">{counts.permintaan}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {pendingChanges.hasPendingStatusChange 
                        ? "Ada perubahan status terbaru" 
                        : "Semua permintaan aktif"}
                    </p>
                  </div>
                </Link>

                {/* Draf Permintaan */}
                <Link href="/Divisi/draf_permintaan">
                  <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow">
                    <h3 className="text-blue-800 font-medium mb-2">
                      Draf Permintaan
                    </h3>
                    <p className="text-2xl font-semibold">{counts.draft}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Belum diajukan
                    </p>
                  </div>
                </Link>

                {/* Riwayat */}
                <Link href="/Divisi/riwayat_divisi">
                  <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-teal-500 text-xl hover:shadow-lg transition-shadow">
                    <h3 className="text-teal-600 font-medium mb-2">
                      Riwayat Permintaan
                    </h3>
                    <p className="text-2xl font-semibold">{counts.riwayat}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Selesai/Ditolak
                    </p>
                  </div>
                </Link>
              </div>

              {/* Statistik tambahan */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Info Cepat</h3>
                  <ul className="text-sm space-y-2">
                    <li>• Total semua permintaan: {counts.permintaan}</li>
                    <li>• Draft yang belum diajukan: {counts.draft}</li>
                    <li>• Notifikasi aktif: {pendingChanges.hasPendingStatusChange ? "1" : "0"}</li>
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardDivisiPage;