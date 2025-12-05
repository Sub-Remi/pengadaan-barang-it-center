"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import permintaanService from "../../../lib/permintaanService";
import authService from "../../../lib/authService";
import dropdownService from "../../../lib/dropdownService";
import ProtectedRoute from "../../../app/components/ProtectedRoute";

export default function FormPermintaanBarangPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isEditMode, setIsEditMode] = useState(!!editId);
  const [barangList, setBarangList] = useState([]);
  const [permintaanId, setPermintaanId] = useState(editId || null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [originalBarangIds, setOriginalBarangIds] = useState([]);

  // Data dropdown
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [stokBarangOptions, setStokBarangOptions] = useState([]);

  // Search states
  const [kategoriSearch, setKategoriSearch] = useState("");
  const [satuanSearch, setSatuanSearch] = useState("");
  const [stokSearch, setStokSearch] = useState("");

  // UI states
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [showSatuanDropdown, setShowSatuanDropdown] = useState(false);
  const [showStokDropdown, setShowStokDropdown] = useState(false);

  const [formData, setFormData] = useState({
    tanggal_kebutuhan: "",
    catatan: "",
  });

  const [barangForm, setBarangForm] = useState({
    kategori_barang: "",
    kategori_barang_id: null,
    nama_barang: "",
    spesifikasi: "",
    satuan: "",
    satuan_barang_id: null,
    jumlah: "",
    keterangan: "",
    stok_barang_id: null,
    stok_available: 0,
  });

  // Debounced search functions
  const debouncedSearchKategori = useCallback(
    debounce(async (search) => {
      try {
        setLoadingDropdown(true);
        const data = await dropdownService.getKategoriBarang(search);
        setKategoriOptions(data);
        setShowKategoriDropdown(true);
      } catch (error) {
        console.error("Error searching kategori:", error);
        setError("Gagal memuat data kategori");
      } finally {
        setLoadingDropdown(false);
      }
    }, 300),
    []
  );

  const debouncedSearchSatuan = useCallback(
    debounce(async (search) => {
      try {
        setLoadingDropdown(true);
        const data = await dropdownService.getSatuanBarang(search);
        setSatuanOptions(data);
        setShowSatuanDropdown(true);
      } catch (error) {
        console.error("Error searching satuan:", error);
        setError("Gagal memuat data satuan");
      } finally {
        setLoadingDropdown(false);
      }
    }, 300),
    []
  );

  const debouncedSearchStok = useCallback(
    debounce(async (search) => {
      try {
        setLoadingDropdown(true);
        const data = await dropdownService.getStokBarang(
          search,
          barangForm.kategori_barang_id
        );
        setStokBarangOptions(data);
        setShowStokDropdown(true);
      } catch (error) {
        console.error("Error searching stok:", error);
        setError("Gagal memuat data barang");
      } finally {
        setLoadingDropdown(false);
      }
    }, 300),
    [barangForm.kategori_barang_id]
  );

  //==================================

  // GANTI bagian useEffect untuk loadDraftData dengan ini:
  useEffect(() => {
    const loadDraftData = async () => {
      if (!editId) return;

      try {
        setLoading(true);
        // Load data permintaan
        const permintaanResponse = await permintaanService.getDetailPermintaan(
          editId
        );
        const permintaan = permintaanResponse.data;

        console.log("📋 Data permintaan dari API:", permintaan);
        console.log("📦 Data barang dari API:", permintaan.barang);

        setFormData({
          tanggal_kebutuhan: permintaan.tanggal_kebutuhan,
          catatan: permintaan.catatan || "",
        });

        // LOGGING: Cek struktur data
        console.log("🔍 Struktur lengkap response:", permintaanResponse);

        // Handle data barang berdasarkan struktur yang ada
        let barangData = [];

        // Cek apakah barang ada dan dalam format apa
        if (permintaan.barang && permintaan.barang.data) {
          // Format: { barang: { data: [...], pagination: {...} } }
          console.log(
            "📊 Barang dalam format paginated:",
            permintaan.barang.data
          );
          barangData = permintaan.barang.data;
        } else if (Array.isArray(permintaan.barang)) {
          // Format: { barang: [...] }
          console.log(
            "📊 Barang dalam format array langsung:",
            permintaan.barang
          );
          barangData = permintaan.barang;
        } else if (permintaan.barang) {
          // Format lain? Log untuk debugging
          console.log("❓ Format barang tidak dikenal:", permintaan.barang);
        }

        // Map data barang ke format yang diharapkan
        const mappedBarangData = barangData.map((barang) => {
          console.log("📝 Processing barang item:", barang);

          // Debug: Tampilkan semua properti barang
          console.log("🔍 Properties barang:", Object.keys(barang));

          let kategori_barang_id = null;
          let satuan_barang_id = null;
          let nama_satuan = "";
          let stok_available = 0;

          // Cek jika ada stok_barang object
          if (barang.stok_barang) {
            console.log("🏷️ Ada stok_barang:", barang.stok_barang);
            kategori_barang_id = barang.stok_barang.kategori_barang_id || null;
            satuan_barang_id = barang.stok_barang.satuan_barang_id || null;
            nama_satuan = barang.stok_barang.nama_satuan || "";
            stok_available = barang.stok_barang.stok || 0;
          }
          // Cek jika ada properti stok_barang_id tapi tidak ada stok_barang object
          else if (barang.stok_barang_id) {
            console.log("ℹ️ Hanya ada stok_barang_id:", barang.stok_barang_id);
            // Kita perlu mengambil data stok dari API jika diperlukan
          }

          return {
            id: barang.id || Date.now(),
            kategori_barang: barang.kategori_barang || "",
            kategori_barang_id: kategori_barang_id,
            nama_barang: barang.nama_barang || "",
            spesifikasi: barang.spesifikasi || "",
            satuan: nama_satuan || barang.satuan || "",
            satuan_barang_id: satuan_barang_id,
            jumlah: barang.jumlah || 0,
            keterangan: barang.keterangan || "",
            stok_barang_id: barang.stok_barang_id || null,
            stok_available: stok_available,
          };
        });

        console.log("✅ Processed barang data:", mappedBarangData);

        if (mappedBarangData.length > 0) {
          setBarangList(mappedBarangData);
          setOriginalBarangIds(mappedBarangData.map((b) => b.id));
        } else {
          console.log("⚠️ Tidak ada barang ditemukan dalam draft");
          setBarangList([]);
          setOriginalBarangIds([]);
        }

        setIsEditMode(true);
        setPermintaanId(editId);
      } catch (error) {
        console.error("❌ Error loading draft:", error);
        console.error(
          "Error details:",
          error.response?.data || error.message || error
        );
        setError(
          "Gagal memuat data draft: " + (error.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    loadDraftData();
  }, [editId]);

  // Get user data on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserData(user);

    // Set default date (today + 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const formattedDate = nextWeek.toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      tanggal_kebutuhan: formattedDate,
    }));

    // Load initial dropdown data
    loadInitialDropdownData();
  }, [router]);

  //================================

  // Load initial dropdown data
  const loadInitialDropdownData = async () => {
    try {
      setLoading(true);
      const [kategoriData, satuanData] = await Promise.all([
        dropdownService.getKategoriBarang(),
        dropdownService.getSatuanBarang(),
      ]);
      setKategoriOptions(kategoriData);
      setSatuanOptions(satuanData);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
      setError("Gagal memuat data dropdown");
    } finally {
      setLoading(false);
    }
  };

  // Handle klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".dropdown-container");
      let isInsideDropdown = false;

      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) {
          isInsideDropdown = true;
        }
      });

      if (!isInsideDropdown) {
        setShowKategoriDropdown(false);
        setShowSatuanDropdown(false);
        setShowStokDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle kategori search
  useEffect(() => {
    if (kategoriSearch !== undefined) {
      debouncedSearchKategori(kategoriSearch);
    }
  }, [kategoriSearch, debouncedSearchKategori]);

  // Handle satuan search
  useEffect(() => {
    if (satuanSearch !== undefined) {
      debouncedSearchSatuan(satuanSearch);
    }
  }, [satuanSearch, debouncedSearchSatuan]);

  // Handle stok search
  useEffect(() => {
    if (stokSearch !== undefined && barangForm.kategori_barang_id) {
      debouncedSearchStok(stokSearch);
    }
  }, [stokSearch, debouncedSearchStok, barangForm.kategori_barang_id]);

  //==================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBarangInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "kategori_barang") {
      setBarangForm((prev) => ({
        ...prev,
        [name]: value,
        kategori_barang_id: null,
        stok_barang_id: null,
        nama_barang: "",
        spesifikasi: "",
        satuan: "",
        satuan_barang_id: null,
        stok_available: 0,
      }));
      setKategoriSearch(value);
      setShowKategoriDropdown(true);
    } else if (name === "satuan") {
      setBarangForm((prev) => ({
        ...prev,
        [name]: value,
        satuan_barang_id: null,
      }));
      setSatuanSearch(value);
      setShowSatuanDropdown(true);
    } else if (name === "nama_barang") {
      setBarangForm((prev) => ({
        ...prev,
        [name]: value,
        stok_barang_id: null,
        stok_available: 0,
      }));
      setStokSearch(value);
      if (barangForm.kategori_barang_id) {
        setShowStokDropdown(true);
      }
    } else {
      setBarangForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectKategori = (kategori) => {
    if (kategori) {
      setBarangForm((prev) => ({
        ...prev,
        kategori_barang: kategori.nama_kategori,
        kategori_barang_id: kategori.id,
      }));
      setKategoriSearch("");
      setShowKategoriDropdown(false);

      // Reset stok search
      setStokSearch("");
      setStokBarangOptions([]);
    }
  };

  const handleSelectSatuan = (satuan) => {
    if (satuan) {
      setBarangForm((prev) => ({
        ...prev,
        satuan: satuan.nama_satuan,
        satuan_barang_id: satuan.id,
      }));
      setSatuanSearch("");
      setShowSatuanDropdown(false);
    }
  };

  const handleSelectStokBarang = (stokBarang) => {
    if (stokBarang) {
      setBarangForm((prev) => ({
        ...prev,
        nama_barang: stokBarang.nama_barang,
        spesifikasi: stokBarang.spesifikasi || "",
        kategori_barang: stokBarang.nama_kategori,
        kategori_barang_id: stokBarang.kategori_barang_id,
        satuan: stokBarang.nama_satuan,
        satuan_barang_id: stokBarang.satuan_barang_id,
        stok_barang_id: stokBarang.id,
        stok_available: stokBarang.stok,
      }));
      setStokSearch("");
      setShowStokDropdown(false);
    }
  };

  //==================================

  const validateBarangForm = () => {
    if (!barangForm.kategori_barang_id) {
      alert("Pilih kategori barang terlebih dahulu!");
      return false;
    }
    if (!barangForm.nama_barang.trim()) {
      alert("Nama barang harus diisi!");
      return false;
    }
    if (!barangForm.jumlah || parseInt(barangForm.jumlah) <= 0) {
      alert("Jumlah harus lebih dari 0!");
      return false;
    }
    if (!barangForm.satuan_barang_id) {
      alert("Pilih satuan terlebih dahulu!");
      return false;
    }
    return true;
  };

  const handleTambahBarang = () => {
    if (!validateBarangForm()) return;

    const newBarang = {
      id: Date.now(), // temporary ID
      kategori_barang: barangForm.kategori_barang,
      kategori_barang_id: barangForm.kategori_barang_id,
      nama_barang: barangForm.nama_barang,
      spesifikasi: barangForm.spesifikasi || "",
      satuan: barangForm.satuan,
      satuan_barang_id: barangForm.satuan_barang_id,
      jumlah: parseInt(barangForm.jumlah),
      keterangan: barangForm.keterangan || "",
      stok_barang_id: barangForm.stok_barang_id,
      stok_available: barangForm.stok_available,
    };

    setBarangList([...barangList, newBarang]);

    // Reset form barang
    setBarangForm({
      kategori_barang: "",
      kategori_barang_id: null,
      nama_barang: "",
      spesifikasi: "",
      satuan: "",
      satuan_barang_id: null,
      jumlah: "",
      keterangan: "",
      stok_barang_id: null,
      stok_available: 0,
    });

    setKategoriSearch("");
    setSatuanSearch("");
    setStokSearch("");
    setStokBarangOptions([]);
  };

  const handleHapusBarang = (index) => {
    const newList = barangList.filter((_, i) => i !== index);
    setBarangList(newList);
  };

  const tambahBarangKePermintaan = async (permintaanId, barang) => {
    try {
      const barangData = {
        kategori_barang: barang.kategori_barang,
        nama_barang: barang.nama_barang,
        spesifikasi: barang.spesifikasi,
        jumlah: barang.jumlah,
        keterangan: barang.keterangan,
        stok_barang_id: barang.stok_barang_id,
      };

      const response = await permintaanService.addBarangToPermintaan(
        permintaanId,
        barangData
      );
      return response;
    } catch (error) {
      console.error("Error adding barang:", error);
      throw error;
    }
  };

  //==================================

  const updateDraftPermintaan = async () => {
    try {
      // 1. Update data permintaan
      const updateData = {
        tanggal_kebutuhan: formData.tanggal_kebutuhan,
        catatan: formData.catatan,
      };

      // 2. Kita perlu handle update barang
      // Untuk simplifikasi, kita hapus semua barang lama dan tambah yang baru
      // Atau kita bisa implementasi logic yang lebih kompleks: update yang ada, hapus yang dihapus, tambah yang baru

      alert("Fitur update draft akan diimplementasikan nanti");
      return false;
    } catch (error) {
      console.error("Error updating draft:", error);
      throw error;
    }
  };

  const handleSimpanDraft = async () => {
    if (barangList.length === 0) {
      alert("Tambahkan minimal 1 barang sebelum menyimpan!");
      return;
    }

    if (!formData.tanggal_kebutuhan) {
      alert("Tanggal kebutuhan harus diisi!");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        // Update draft yang sudah ada
        await updateDraftPermintaan();
        alert("Draft berhasil diperbarui!");
      } else {
        // Buat draft baru
        const permintaanData = {
          tanggal_kebutuhan: formData.tanggal_kebutuhan,
          catatan: formData.catatan || "",
        };

        const createResponse = await permintaanService.createPermintaan(
          permintaanData
        );
        const newPermintaanId = createResponse.data.id;
        setPermintaanId(newPermintaanId);

        // Tambahkan semua barang ke permintaan
        const barangPromises = barangList.map((barang) =>
          tambahBarangKePermintaan(newPermintaanId, barang)
        );

        await Promise.all(barangPromises);

        alert("Permintaan berhasil disimpan sebagai draft!");
      }

      router.push("/Divisi/draf_permintaan");
    } catch (error) {
      console.error("Error saving draft:", error);
      setError(error.error || "Gagal menyimpan draft");
      alert(error.error || "Gagal menyimpan draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKirim = async () => {
    if (barangList.length === 0) {
      alert("Tambahkan minimal 1 barang sebelum mengirim!");
      return;
    }

    if (!formData.tanggal_kebutuhan) {
      alert("Tanggal kebutuhan harus diisi!");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin mengirim permintaan ini?")) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        // Untuk draft yang sudah ada, kita submit saja
        await permintaanService.submitPermintaan(permintaanId);
        alert("Permintaan berhasil dikirim!");
        router.push("/Divisi/permintaan_divisi");
      } else {
        // Buat permintaan baru langsung submit
        const permintaanData = {
          tanggal_kebutuhan: formData.tanggal_kebutuhan,
          catatan: formData.catatan || "",
        };

        const createResponse = await permintaanService.createPermintaan(
          permintaanData
        );
        const newPermintaanId = createResponse.data.id;

        // Tambahkan semua barang ke permintaan
        const barangPromises = barangList.map((barang) =>
          tambahBarangKePermintaan(newPermintaanId, barang)
        );

        await Promise.all(barangPromises);

        // Submit permintaan (ubah status dari draft menjadi menunggu)
        await permintaanService.submitPermintaan(newPermintaanId);

        alert("Permintaan berhasil dikirim!");
        router.push(`/Divisi/detail_permintaan?id=${newPermintaanId}`);
      }
    } catch (error) {
      console.error("Error sending permintaan:", error);
      setError(error.error || "Gagal mengirim permintaan");
      alert(error.error || "Gagal mengirim permintaan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["pemohon"]}>
      <div className="flex h-screen font-poppins bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-blue-900 text-white flex flex-col text-2x1 fixed top-0 left-0 h-full">
          <div className="h-20 border-b border-white flex items-center justify-center bg-white">
            <img
              src="/logo/ItCenter.png"
              alt="IT Center"
              className="w-32 border-white"
            />
          </div>
          <nav className="flex-1 mt-6 overflow-y-auto">
            <ul className="space-y-1 pb-6">
              <Link href="/divisi/dashboard_divisi">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Dashboard
                </li>
              </Link>

              <hr className="border-t border-white/30 my-2" />

              <li className="px-5 py-2 font-semibold text-gray-200 cursor-default">
                PENGADAAN
              </li>

              <Link href="/Divisi/draf_permintaan">
                <li className="px-5 py-2 hover:bg-blue-500 cursor-pointer">
                  Draf Permintaan
                </li>
              </Link>

              <Link href="/Divisi/form_permintaan">
                <li className="bg-blue-500 px-5 py-2 cursor-pointer">
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

        {/* Main Wrapper (Header + Content) */}
        <div className="flex flex-col flex-1 ml-60 h-full">
          {/* Header */}
          <header className="flex bg-white shadow-sm items-center h-20 fixed top-0 left-60 right-0 z-10">
            <div className="flex-1 h-full flex items-center px-8">
              <div className="ml-auto">
                <span className="text-gray-700">
                  {userData?.nama_lengkap || userData?.username || "User"}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content Scrollable */}
          <main className="flex-1 mt-20 overflow-y-auto bg-gray-200 p-8">
            <h2 className="text-3xl text-black font-semibold mb-6">
              Permintaan
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header Form */}
              <div className="flex justify-between items-center px-6 py-5 border-b-4 border-b-gray-300">
                <h3 className="text-xl font-semibold text-teal-600">
                  Form Permintaan Barang
                </h3>
                <Link href="/Divisi/permintaan_divisi">
                  <button className="bg-teal-600 hover:bg-green-600 text-white px-4 py-1.5 rounded">
                    &lt; Kembali
                  </button>
                </Link>
              </div>

              {/* Data Permintaan */}
              <div className="px-6 py-4 border-b-4 border-b-gray-300">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Data Permintaan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-gray-700">
                      Nama Pemohon
                    </label>
                    <input
                      type="text"
                      value={userData?.nama_lengkap || userData?.username || ""}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Email</label>
                    <input
                      type="text"
                      value={userData?.email || ""}
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Divisi</label>
                    <input
                      type="text"
                      value={
                        userData?.divisi_id
                          ? `Divisi ${userData.divisi_id}`
                          : "Belum ditentukan"
                      }
                      disabled
                      className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">
                      Tanggal Kebutuhan
                    </label>
                    <input
                      type="date"
                      name="tanggal_kebutuhan"
                      value={formData.tanggal_kebutuhan}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-black"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">
                      Catatan/Keterangan
                    </label>
                    <textarea
                      name="catatan"
                      value={formData.catatan}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder="Masukkan catatan atau keterangan tambahan"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Data Barang */}
              <div className="px-6 py-4 border-b-4 border-b-gray-300">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Data Barang
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Kategori Barang */}
                  <div className="relative dropdown-container">
                    <label className="font-medium text-gray-700">
                      Kategori Barang *
                    </label>
                    <input
                      type="text"
                      name="kategori_barang"
                      value={barangForm.kategori_barang}
                      onChange={handleBarangInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder="Cari atau ketik kategori"
                      required
                    />
                    {showKategoriDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {loadingDropdown ? (
                          <div className="p-2 text-center text-gray-500">
                            Memuat...
                          </div>
                        ) : kategoriOptions.length > 0 ? (
                          kategoriOptions.map((kategori) => (
                            <div
                              key={kategori.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                              onClick={() => handleSelectKategori(kategori)}
                            >
                              {kategori.nama_kategori}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">
                            Tidak ditemukan
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Nama Barang */}
                  <div className="relative dropdown-container">
                    <label className="font-medium text-gray-700">
                      Nama Barang *
                    </label>
                    <input
                      type="text"
                      name="nama_barang"
                      value={barangForm.nama_barang}
                      onChange={handleBarangInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder={
                        barangForm.kategori_barang_id
                          ? "Cari atau ketik nama barang"
                          : "Pilih kategori terlebih dahulu"
                      }
                      disabled={!barangForm.kategori_barang_id}
                      required
                    />
                    {showStokDropdown && barangForm.kategori_barang_id && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {loadingDropdown ? (
                          <div className="p-2 text-center text-gray-500">
                            Memuat...
                          </div>
                        ) : stokBarangOptions.length > 0 ? (
                          stokBarangOptions.map((barang) => (
                            <div
                              key={barang.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100"
                              onClick={() => handleSelectStokBarang(barang)}
                            >
                              <div className="font-medium">
                                {barang.nama_barang}
                              </div>
                              <div className="text-sm text-gray-500">
                                Kode: {barang.kode_barang} | Stok: {barang.stok}
                              </div>
                              {barang.spesifikasi && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {barang.spesifikasi}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">
                            Tidak ditemukan
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Satuan */}
                  <div className="relative dropdown-container">
                    <label className="font-medium text-gray-700">
                      Satuan *
                    </label>
                    <input
                      type="text"
                      name="satuan"
                      value={barangForm.satuan}
                      onChange={handleBarangInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder="Cari atau ketik satuan"
                      required
                    />
                    {showSatuanDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {loadingDropdown ? (
                          <div className="p-2 text-center text-gray-500">
                            Memuat...
                          </div>
                        ) : satuanOptions.length > 0 ? (
                          satuanOptions.map((satuan) => (
                            <div
                              key={satuan.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                              onClick={() => handleSelectSatuan(satuan)}
                            >
                              {satuan.nama_satuan}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">
                            Tidak ditemukan
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Jumlah */}
                  <div>
                    <label className="font-medium text-gray-700">
                      Jumlah *
                    </label>
                    <input
                      type="number"
                      name="jumlah"
                      value={barangForm.jumlah}
                      onChange={handleBarangInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>

                  {/* Spesifikasi */}
                  <div>
                    <label className="font-medium text-gray-700">
                      Spesifikasi
                    </label>
                    <input
                      type="text"
                      name="spesifikasi"
                      value={barangForm.spesifikasi}
                      onChange={handleBarangInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder="Masukkan spesifikasi"
                    />
                  </div>

                  {/* Keterangan */}
                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">
                      Keterangan
                    </label>
                    <textarea
                      rows="3"
                      name="keterangan"
                      value={barangForm.keterangan}
                      onChange={handleBarangInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder="Masukkan keterangan tambahan"
                    />
                  </div>

                  {/* Info Stok */}
                  {barangForm.stok_available > 0 && (
                    <div className="md:col-span-2">
                      <div className="p-2 bg-blue-50 text-blue-700 rounded">
                        <span className="font-medium">Info Stok:</span>
                        Tersedia {barangForm.stok_available} unit di gudang
                      </div>
                    </div>
                  )}
                </div>

                {/* Tombol Tambah */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleTambahBarang}
                    disabled={isSaving}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah Barang
                  </button>
                </div>
              </div>

              {/* Tabel Barang */}
              <div className="px-6 py-4 bg-white">
                {barangList.length > 0 ? (
                  <>
                    <table className="w-full border-collapse text-gray-700 text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-2 font-semibold border">No</th>
                          <th className="px-4 py-2 font-semibold border">
                            Kategori
                          </th>
                          <th className="px-4 py-2 font-semibold border">
                            Nama Barang
                          </th>
                          <th className="px-4 py-2 font-semibold border">
                            Spesifikasi
                          </th>
                          <th className="px-4 py-2 font-semibold border">
                            Satuan
                          </th>
                          <th className="px-4 py-2 font-semibold border">
                            Jumlah
                          </th>
                          <th className="px-4 py-2 font-semibold border">
                            Keterangan
                          </th>
                          <th className="px-4 py-2 font-semibold border">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {barangList.map((barang, index) => (
                          <tr
                            key={barang.id}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-gray-100`}
                          >
                            <td className="px-4 py-2 border">{index + 1}</td>
                            <td className="px-4 py-2 border">
                              {barang.kategori_barang}
                            </td>
                            <td className="px-4 py-2 border font-medium">
                              {barang.nama_barang}
                            </td>
                            <td className="px-4 py-2 border text-sm">
                              {barang.spesifikasi || "-"}
                            </td>
                            <td className="px-4 py-2 border">
                              {barang.satuan}
                            </td>
                            <td className="px-4 py-2 border">
                              {barang.jumlah}
                            </td>
                            <td className="px-4 py-2 border">
                              {barang.keterangan || "-"}
                            </td>
                            <td className="px-4 py-2 border">
                              <button
                                onClick={() => handleHapusBarang(index)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Info jumlah barang */}
                    <div className="mt-4 text-sm text-gray-600">
                      Total barang: {barangList.length}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada barang yang ditambahkan
                  </div>
                )}

                {/* Tombol Simpan & Kirim */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={handleSimpanDraft}
                    disabled={isSaving || barangList.length === 0}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Draft"}
                  </button>
                  <button
                    onClick={handleKirim}
                    disabled={isSaving || barangList.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Mengirim..." : "Kirim Permintaan"}
                  </button>
                </div>
              </div>

              {/* Garis bawah hijau */}
              <div className="h-1 bg-teal-600 w-full"></div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
