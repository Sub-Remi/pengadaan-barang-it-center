"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import authService from '../../../lib/authService';
import dashboardService from '../../../lib/dashboardService'; // Import service baru

function DashboardGA() {
  const [stats, setStats] = useState({
    permintaanBaru: 0,
    permintaanDiproses: 0,
    totalBarang: 0,
    totalPemesanan: 0,
    totalDivisi: 0,
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Option 1: Jika ada endpoint khusus untuk dashboard stats
      // const statsData = await dashboardService.getDashboardStats();
      // setStats(statsData);

      // Option 2: Fetch masing-masing data secara parallel
      const [
        permintaanBaru,
        permintaanDiproses,
        totalBarang,
        totalPemesanan,
        totalDivisi,
        totalUser
      ] = await Promise.all([
        dashboardService.getPermintaanByStatus('menunggu'),
        dashboardService.getPermintaanByStatus('diproses'),
        dashboardService.getTotalCount('admin/barang'),
        dashboardService.getTotalCount('admin/pemesanan'),
        dashboardService.getTotalCount('admin/divisi'),
        dashboardService.getTotalCount('admin/users') // atau endpoint user yang sesuai
      ]);

      setStats({
        permintaanBaru,
        permintaanDiproses,
        totalBarang,
        totalPemesanan,
        totalDivisi,
        totalUser
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data setiap 30 detik
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8">
          <h1 className="text-xl font-semibold text-gray-800"></h1>
          {/* Tambahkan refresh button */}
          <button 
            onClick={fetchDashboardData}
            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Refresh Data'
            )}
          </button>
        </div>
      </header>

      {/* Konten utama */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar - Tetap seperti semula */}
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

                {/* <hr className="border-t border-white/30 my-2" /> */}

                {/* PEMESANAN
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
                </Link> */}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 bg-gray-200 overflow-y-auto ml-60">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Dashboard</h2>

          <div className="flex text-black flex-wrap gap-6">
            {/* Permintaan Baru */}
            <Link href="/GA/data_permintaan">
              <div className="relative bg-white w-66 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                
                <h2 className="text-blue-800 font-medium mb-2">Permintaan Menunggu</h2>
                <p className="text-2xl font-semibold">
                  {loading ? (
                    <span className="inline-block h-6 w-10 bg-gray-300 rounded animate-pulse"></span>
                  ) : (
                    stats.permintaanBaru
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Status: Menunggu</p>
              </div>
            </Link>

            {/* Permintaan yang diproses */}
            <Link href="/GA/data_permintaan?status=diproses">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-blue-800 font-medium mb-2">Permintaan Diproses</h3>
                <p className="text-2xl font-semibold">
                  {loading ? (
                    <span className="inline-block h-6 w-10 bg-gray-300 rounded animate-pulse"></span>
                  ) : (
                    stats.permintaanDiproses
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Status: Diproses</p>
              </div>
            </Link>

            {/* Pemesanan */}
            {/* <Link href="/GA/list_pemesanan">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-teal-500 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-teal-600 font-medium mb-2">Pemesanan</h3>
                <p className="text-2xl font-semibold">
                  {loading ? (
                    <span className="inline-block h-6 w-10 bg-gray-300 rounded animate-pulse"></span>
                  ) : (
                    stats.totalPemesanan
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total Pemesanan</p>
              </div>
            </Link> */}

            {/* Total Barang (diubah dari Total Divisi) */}
            <Link href="/GA/data_barang">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-blue-800 font-medium mb-2">Total Barang</h3>
                <p className="text-2xl font-semibold">
                  {loading ? (
                    <span className="inline-block h-6 w-10 bg-gray-300 rounded animate-pulse"></span>
                  ) : (
                    stats.totalBarang
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Jenis barang tersedia</p>
              </div>
            </Link>

            {/* Total Divisi */}
            <Link href="/GA/data_divisi">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-blue-800 font-medium mb-2">Total Divisi</h3>
                <p className="text-2xl font-semibold">
                  {loading ? (
                    <span className="inline-block h-6 w-10 bg-gray-300 rounded animate-pulse"></span>
                  ) : (
                    stats.totalDivisi
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Divisi</p>
              </div>
            </Link>

            {/* Total User */}
            <Link href="/GA/manajemen_user">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-blue-800 font-medium mb-2">Total User</h3>
                <p className="text-2xl font-semibold">
                  {loading ? (
                    <span className="inline-block h-6 w-10 bg-gray-300 rounded animate-pulse"></span>
                  ) : (
                    stats.totalUser
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pengguna terdaftar</p>
              </div>
            </Link>
          </div>

          {/* Info tambahan */}
          <div className="mt-8 text-sm text-gray-600">
            <p>Data diperbarui secara otomatis setiap 30 detik</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardGA;