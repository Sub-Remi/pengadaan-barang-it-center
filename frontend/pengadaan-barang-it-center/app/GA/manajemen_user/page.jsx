"use client";
import Link from "next/link";
import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function ManajemenUserPage() {
  const data = [
    { no: 1, nama: "John doe", username: "johndodo", email: "johndodo@ymail.com", role: "Finance" },
    { no: 2, nama: "Ellen", username: "ellenG", email: "ellenG@ymail.com", role: "Divisi" },
    { no: 3, nama: "David", username: "urdavid", email: "urdavid@ymail.com", role: "Divisi" },
    { no: 4, nama: "Casie", username: "casieya", email: "casieya@ymail.com", role: "Divisi" },
    { no: 5, nama: "Vanesh", username: "panesha", email: "panesha@ymail.com", role: "Finance" },
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
              <Link href="/GA/dashboard_ga">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

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

              <Link href="/GA/data_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Divisi
                </li>
              </Link>

              <Link href="/GA/manajemen_user">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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
          <h2 className="text-3xl font-semibold mb-6">Manajemen User</h2>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header atas */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">Data User</h3>
              <Link href="/GA/tambah_user">
              <button className="flex items-center bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                <FaPlus className="mr-2" /> Tambah User
              </button>
              </Link>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
              <label htmlFor="search" className="text-gray-700 font-medium">
                Search
              </label>
              <input
                id="search"
                type="text"
                className="border border-gray-300 rounded px-2 py-1 text-x1"
              />

              <label className="font-medium text-gray-700">Divisi</label>
              <select className="border border-gray-300 rounded px-2 py-1">
                <option>Pilih</option>
                <option>HR</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>IT</option>
              </select>
            </div>

            {/* Tabel */}
            <table className="w-full border-collapse text-x1">
              <thead>
                <tr className="bg-white text-left">
                  <th className="px-6 py-3 font-semibold">No</th>
                  <th className="px-6 py-3 font-semibold">Nama</th>
                  <th className="px-6 py-3 font-semibold">Username</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
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
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {row.nama}
                    </td>
                    <td className="px-6 py-3">{row.username}</td>
                    <td className="px-6 py-3">{row.email}</td>
                    <td className="px-6 py-3">{row.role}</td>
                    <td className="px-6 py-3 text-center">
                      <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <FaTrash />
                      </button>
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
