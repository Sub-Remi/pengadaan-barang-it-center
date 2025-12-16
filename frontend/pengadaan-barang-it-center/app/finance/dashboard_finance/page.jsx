"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

function DashboardFinance() {
  const [dashboardData, setDashboardData] = useState({
    totalPemesanan: 0,
    pemesananDiproses: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch data untuk dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3200/api/validator/pemesanan?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = [];

      if (response.status === 404 || response.status === 500) {
        console.log("⚠️ API belum tersedia, menggunakan data dummy");
        // Data dummy fallback
        data = [
          {
            id: 1,
            nomor_permintaan: "PB-10111",
            tanggal: "2025-01-01",
            nama_barang: "Laptop",
            status: "Menunggu Validasi",
            dokumen_jenis: "PO",
          },
          {
            id: 2,
            nomor_permintaan: "PB-10777",
            tanggal: "2025-06-02",
            nama_barang: "Printer",
            status: "Pending",
            dokumen_jenis: "Invoice",
          },
          {
            id: 3,
            nomor_permintaan: "PB-10112",
            tanggal: "2025-01-03",
            nama_barang: "Monitor",
            status: "Validated",
            dokumen_jenis: "PO",
          },
          {
            id: 4,
            nomor_permintaan: "PB-10778",
            tanggal: "2025-01-05",
            nama_barang: "Keyboard",
            status: "Menunggu Validasi",
            dokumen_jenis: "Quotation",
          },
        ];
      } else {
        const result = await response.json();
        data = result.data || [];
      }

      // Hitung total pemesanan
      const totalPemesanan = data.length;
      
      // Hitung pemesanan yang diproses (status mengandung "diproses" atau "menunggu validasi" atau "pending")
      const pemesananDiproses = data.filter(item => {
        const status = item.status?.toLowerCase() || "";
        return status.includes("diproses") || 
               status.includes("menunggu") || 
               status.includes("pending");
      }).length;

      setDashboardData({
        totalPemesanan,
        pemesananDiproses
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values jika error
      setDashboardData({
        totalPemesanan: 0,
        pemesananDiproses: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
              <Link href="/finance/dashboard_finance">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-x1 text-gray-200 mt-2 cursor-default">
                PEMESANAN
              </li>

              <Link href="/finance/data_pemesanan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Data Pemesanan
                </li>
              </Link>

              {/* <Link href="/finance/riwayat_finance">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Riwayat
                </li>
              </Link> */}
            </ul>
          </nav>
        </aside>

        {/* Dashboard */}
        <main className="flex-1 p-8 bg-gray-200">
          <h2 className="text-3xl text-black font-semibold mb-6">Dashboard</h2>

          <div className="flex flex-wrap gap-6 text-black">
            {/* Card Total Pemesanan */}
            <Link href="/finance/data_pemesanan">
              <div className="relative bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                <h2 className="text-blue-800 font-medium mb-2">Total Pemesanan</h2>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-800 mr-2"></div>
                    <span className="text-lg">Memuat...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold">{dashboardData.totalPemesanan}</p>
                )}
              </div>
            </Link>

            {/* Card Pemesanan Diproses */}
            <Link href="/finance/data_pemesanan?status=diproses">
              <div className="bg-white w-64 h-28 rounded-lg shadow-md p-4 border-l-8 border-blue-800 text-xl">
                <h3 className="text-blue-800 font-medium mb-2">Pemesanan Diproses</h3>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-800 mr-2"></div>
                    <span className="text-lg">Memuat...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-semibold">{dashboardData.pemesananDiproses}</p>
                )}
              </div>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardFinance;