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
      <div className="flex flex-col h-screen font-poppins bg-gray-100">
        {/* Header - Tetap fixed di atas */}
        <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
          <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
            <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
          </div>
          <div className="flex-1 h-16 flex items-center px-8">
            <button
              onClick={refreshDashboard}
              className="ml-auto flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm transition-colors"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </header>

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
                  <Link href="/Divisi/dashboard_divisi">
                    <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
                      Dashboard
                    </li>
                  </Link>

                  <hr className="border-t border-white/30 my-2" />

                  <li className="px-5 py-2 font-semibold text-gray-200 cursor-default text-x1">
                    PENGADAAN
                  </li>

                  <Link href="/Divisi/draf_permintaan">
                    <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                      Draf Permintaan
                    </li>
                  </Link>

                  <Link href="/Divisi/permintaan_divisi">
                    <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                      Permintaan
                    </li>
                  </Link>

                  <Link href="/Divisi/riwayat_divisi">
                    <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
                      Riwayat
                    </li>
                  </Link>
                </ul>
              </nav>
            </div>
          </aside>

          {/* Main Content - Scrollable dengan padding yang lebih baik */}
          <main className="flex-1 text-black p-6 bg-gray-200 overflow-y-auto ml-60">
            {/* Header untuk judul halaman */}
            <div className="bg-gray-200 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl text-black font-semibold">Dashboard</h2>
                <span className="text-sm text-gray-600">
                  Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
                </span>
              </div>
            </div>

            {/* Dashboard cards - Grid 2 kolom */}
              <div className="flex flex-wrap gap-6 mb-10">
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
              </div>

            {/* Ringkasan Statistik */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Ringkasan
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Total</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Permintaan Aktif:</span>
                        <span className="font-semibold">{counts.permintaan}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Draft:</span>
                        <span className="font-semibold">{counts.draft}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-t border-gray-100 pt-3">
                        <span className="text-gray-700 font-medium">Total Semua:</span>
                        <span className="font-bold text-teal-600">{counts.permintaan + counts.draft}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-sm text-gray-600">
                        Pantau permintaan dan draft Anda
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardDivisiPage;