"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import userService from "../../../lib/userService";
import divisiService from "../../../lib/divisiService";

export default function TambahUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nama_lengkap: "",
    email: "",
    divisi_id: "",
    role: "",
  });

  const [divisiList, setDivisiList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load divisi dropdown
  useEffect(() => {
    const loadDivisi = async () => {
      try {
        const data = await divisiService.getDivisiDropdown();
        setDivisiList(data);
      } catch (error) {
        console.error("Gagal memuat divisi:", error);
      }
    };
    loadDivisi();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      nama_lengkap: "",
      email: "",
      divisi_id: "",
      role: "",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok");
      return;
    }

    if (
      !formData.username ||
      !formData.password ||
      !formData.nama_lengkap ||
      !formData.role
    ) {
      setError("Username, Password, Nama, dan Role wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      submitData.role = submitData.role.toLowerCase();

      await userService.createUser(submitData);

      alert("User berhasil ditambahkan!");

      // Reset filter sebelum redirect
      localStorage.setItem("userManagement_refresh", Date.now());

      router.push("/GA/manajemen_user");
    } catch (error) {
      console.error("Gagal menambah user:", error);
      setError(error.response?.data?.error || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-poppins bg-gray-100">
      {/* Header - Tetap fixed di atas */}
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-white shadow-sm items-center h-16">
        <div className="bg-white w-60 h-16 flex items-center justify-center border-r border-white">
          <img src="/logo/ItCenter.png" alt="IT Center" className="w-32" />
        </div>
        <div className="flex-1 h-16 flex items-center px-8">
          {/* Kosong untuk saat ini, bisa diisi dengan user profile dll */}
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
            
            <nav className="p-2">
              <ul className="space-y-1">
                <Link href="/GA/dashboard_ga">
                  <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer transition-colors duration-200 rounded">
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
                  <li className="bg-blue-500 px-5 py-2 cursor-pointer rounded">
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

        {/* Main Content - Scrollable dengan padding yang lebih baik */}
        <main className="flex-1 text-black p-6 bg-gray-200 overflow-y-auto ml-60">
          {/* Fixed header untuk judul halaman */}
          <div className="bg-gray-200 pt-4 pb-4 mb-6">
            <h2 className="text-2xl text-black font-semibold">Manajemen User</h2>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Header atas card */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-teal-600">
                Form Tambah User
              </h3>
              <Link href="/GA/manajemen_user">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors">
                  Kembali
                </button>
              </Link>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {/* Form Input */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2 text-sm">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    placeholder="Masukkan username"
                  />
                </div>

                {/* Nama */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2 text-sm">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block font-medium text-gray-700 mb-2 text-sm">
                    Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                {/* Konfirmasi Password */}
                <div className="relative">
                  <label className="block font-medium text-gray-700 mb-2 text-sm">
                    Konfirmasi Password *
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    placeholder="Konfirmasi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                  >
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                {/* Email */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="contoh@email.com"
                  />
                </div>

                {/* Divisi (Dropdown) */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2 text-sm">
                    Divisi
                  </label>
                  <select
                    name="divisi_id"
                    value={formData.divisi_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Pilih Divisi</option>
                    {divisiList.map((divisi) => (
                      <option key={divisi.id} value={divisi.id}>
                        {divisi.nama_divisi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role (Radio Button) */}
              <div className="mt-4">
                <label className="block font-medium text-gray-700 mb-3 text-sm">
                  Role *
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="Pemohon"
                      checked={formData.role === "Pemohon"}
                      onChange={handleChange}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm">Pemohon</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="Admin"
                      checked={formData.role === "Admin"}
                      onChange={handleChange}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm">Admin</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="Validator"
                      checked={formData.role === "Validator"}
                      onChange={handleChange}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm">Validator</span>
                  </label>
                </div>
              </div>

              {/* Tombol */}
              <div className="flex justify-center gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Menambahkan..." : "Tambah User"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded text-sm transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>

            {/* Garis bawah hijau */}
            <div className="h-1 bg-teal-600 w-full"></div>
          </div>
        </main>
      </div>
    </div>
  );
}