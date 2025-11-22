"use client";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function TambahUserPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nama: "",
    email: "",
    role: "Divisi",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      nama: "",
      email: "",
      role: "Divisi",
    });
  };

  return (
    <div className="flex min-h-screen font-poppins bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white flex flex-col fixed top-0 left-0 h-full">
        <div className="h-20 border-b border-white flex items-center justify-center bg-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto">
          <ul className="space-y-1 pb-6">
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
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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

              <Link href="/GA/form_penerimaanbarang">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Form Penerimaan
                </li>
              </Link>
          </ul>
        </nav>
      </aside>

      {/* Main Wrapper */}
      <div className="flex flex-col flex-1 ml-60 h-full">
        {/* Header */}
        <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10">
          <div className="flex-1 h-full flex items-center px-8"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-200 mt-20 overflow-y-auto">

          <h2 className="text-3xl font-semibold mb-6">Manajemen User</h2>

          <div className="bg-white rounded-lg shadow-md relative">
            {/* Header Form */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-[#00A99D]">
                Form Tambah User
              </h3>
              <Link href="/GA/manajemen_user">
                <button className="bg-[#00A99D] hover:bg-[#009B91] text-white px-5 py-2 rounded">
                  Kembali
                </button>
              </Link>
            </div>

            {/* Form */}
            <form className="px-10 py-8 space-y-6 mx-auto max-w-2xl">
              {/* Username */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-[#bfe5e1] focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block font-semibold text-gray-800 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 pr-10 bg-[#bfe5e1] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[40px] text-gray-600"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Konfirmasi Password */}
              <div className="relative">
                <label className="block font-semibold text-gray-800 mb-1">
                  Konfirmasi Password
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-[40px] text-gray-500 items-center"
                >
                  {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Garis pemisah */}
              <hr className="border-b-2 border-gray-300 -mx-99" />

              {/* Nama */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                />
              </div>

              {/* Divisi */}
              <div>
                <label className="block font-semibold text-gray-800 mb-1">
                  Divisi
                </label>
                <input
                  type="divisi"
                  name="divisi"
                  value={formData.divisi}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none"
                />
              </div>

              {/* Tombol */}
              <div className="flex justify-center gap-6 pt-4">
                <button
                  type="submit"
                  className="bg-[#00A651] hover:bg-[#00944A] text-white font-semibold px-6 py-2 rounded shadow"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-[#ED1C24] hover:bg-[#C8171D] text-white font-semibold px-6 py-2 rounded shadow"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Garis bawah hijau tosca */}
            <div className="h-2 bg-[#00A99D] w-full rounded-b-lg"></div>
          </div>
        </main>
      </div>
    </div>
  );
}
