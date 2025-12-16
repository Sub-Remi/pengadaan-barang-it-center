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
  const [namaBarangSearch, setNamaBarangSearch] = useState("");

  // UI states
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [showSatuanDropdown, setShowSatuanDropdown] = useState(false);
  const [showStokDropdown, setShowStokDropdown] = useState(false);

  const [formData, setFormData] = useState({
    tanggal_kebutuhan: "",
    catatan: "",
  });

  // State untuk form barang
  const [barangForm, setBarangForm] = useState({
    nama_barang: "",
    nama_barang_display: "",
    spesifikasi: "",
    jumlah: "",
    keterangan: "",
    stok_barang_id: null,
    stok_available: 0,
    kategori_barang: "",
    kategori_barang_id: null,
    satuan: "",
    satuan_barang_id: null,
    isFromStok: false,
    jumlahError: "",
  });

  // Debounced search untuk nama barang
  const debouncedSearchNamaBarang = useCallback(
    debounce(async (search) => {
      try {
        setLoadingDropdown(true);
        const data = await dropdownService.getStokBarang(search, null);
        setStokBarangOptions(data);
        setShowStokDropdown(true);
      } catch (error) {
        console.error("Error searching barang:", error);
        setError("Gagal memuat data barang");
      } finally {
        setLoadingDropdown(false);
      }
    }, 300),
    []
  );

  // Handle search nama barang
  useEffect(() => {
    if (namaBarangSearch !== undefined && namaBarangSearch.trim() !== "") {
      debouncedSearchNamaBarang(namaBarangSearch);
    } else {
      setStokBarangOptions([]);
      setShowStokDropdown(false);
    }
  }, [namaBarangSearch, debouncedSearchNamaBarang]);

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

  // Di bagian useEffect untuk get user data
  useEffect(() => {
    const loadUserData = async () => {
      const user = authService.getCurrentUser();
      if (!user) {
        router.push("/login/login");
        return;
      }

      setUserData(user);

      // Set default date (TODAY)
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        tanggal_kebutuhan: formattedDate,
      }));

      // Load initial dropdown data
      loadInitialDropdownData();
    };

    loadUserData();
  }, [router]);

  // Load draft data untuk mode edit
  useEffect(() => {
    const loadDraftData = async () => {
      if (!editId) return;

      try {
        setLoading(true);
        const permintaanResponse = await permintaanService.getDetailPermintaan(
          editId
        );
        const permintaan = permintaanResponse.data;

        setFormData({
          tanggal_kebutuhan: permintaan.tanggal_kebutuhan
            ? new Date(permintaan.tanggal_kebutuhan).toISOString().split("T")[0]
            : "",
          catatan: permintaan.catatan,
        });

        let barangData = [];
        if (permintaan.barang && permintaan.barang.data) {
          barangData = permintaan.barang.data;
        } else if (Array.isArray(permintaan.barang)) {
          barangData = permintaan.barang;
        }

        const mappedBarangData = barangData.map((barang) => {
          let kategori_barang_id = null;
          let satuan_barang_id = null;
          let nama_satuan = "";
          let stok_available = 0;
          let isFromStok = false;

          if (barang.stok_barang) {
            kategori_barang_id = barang.stok_barang.kategori_barang_id || null;
            satuan_barang_id = barang.stok_barang.satuan_barang_id || null;
            nama_satuan = barang.stok_barang.nama_satuan || "";
            stok_available = barang.stok_barang.stok || 0;
            isFromStok = true;
          }

          return {
            id: barang.id || Date.now(),
            kategori_barang: barang.kategori_barang || "",
            kategori_barang_id: kategori_barang_id,
            nama_barang: barang.nama_barang || "",
            nama_barang_display: barang.nama_barang || "",
            spesifikasi: barang.spesifikasi || "",
            satuan: nama_satuan || barang.satuan || "",
            satuan_barang_id: satuan_barang_id,
            jumlah: barang.jumlah || 0,
            keterangan: barang.keterangan || "",
            stok_barang_id: barang.stok_barang_id || null,
            stok_available: stok_available,
            isFromStok: isFromStok,
          };
        });

        setBarangList(mappedBarangData);
        setOriginalBarangIds(mappedBarangData.map((b) => b.id));
        setIsEditMode(true);
        setPermintaanId(editId);
      } catch (error) {
        console.error("❌ Error loading draft:", error);
        setError(
          "Gagal memuat data draft: " + (error.message || "Unknown error")
        );
      }
    };

    loadDraftData();
  }, [editId]);

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
    }
  };

  // Handle klik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle barang input change
  const handleBarangInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "nama_barang_display") {
      setBarangForm((prev) => ({
        ...prev,
        nama_barang_display: value,
        nama_barang: "",
        stok_barang_id: null,
        stok_available: 0,
        kategori_barang: "",
        kategori_barang_id: null,
        satuan: "",
        satuan_barang_id: null,
        isFromStok: false,
        jumlahError: "",
      }));
      setNamaBarangSearch(value);
    } else if (name === "jumlah") {
      const jumlahValue = parseInt(value) || 0;
      const stokTersedia = barangForm.stok_available || 0;

      let jumlahError = "";

      if (jumlahValue <= 0) {
        jumlahError = "Jumlah harus lebih dari 0!";
      } else if (stokTersedia > 0 && jumlahValue > stokTersedia) {
        jumlahError = `Jumlah melebihi stok tersedia (${stokTersedia} ${barangForm.satuan})!`;
      }

      setBarangForm((prev) => ({
        ...prev,
        [name]: value,
        jumlahError: jumlahError,
      }));
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
        stok_barang_id: null,
        nama_barang: "",
        spesifikasi: "",
        satuan: "",
        satuan_barang_id: null,
        stok_available: 0,
      }));
      setKategoriSearch("");
      setShowKategoriDropdown(false);
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

  // Handle select stok barang
  const handleSelectStokBarang = (stokBarang) => {
    if (stokBarang) {
      setBarangForm((prev) => ({
        ...prev,
        nama_barang: stokBarang.nama_barang,
        nama_barang_display: stokBarang.nama_barang,
        spesifikasi: stokBarang.spesifikasi || "",
        kategori_barang: stokBarang.nama_kategori,
        kategori_barang_id: stokBarang.kategori_barang_id,
        satuan: stokBarang.nama_satuan,
        satuan_barang_id: stokBarang.satuan_barang_id,
        stok_barang_id: stokBarang.id,
        stok_available: stokBarang.stok,
        isFromStok: true,
        jumlahError: "",
      }));
      setNamaBarangSearch("");
      setShowStokDropdown(false);
    }
  };

  // Reset form barang
  const resetBarangForm = () => {
    setBarangForm({
      nama_barang: "",
      nama_barang_display: "",
      spesifikasi: "",
      jumlah: "",
      keterangan: "",
      stok_barang_id: null,
      stok_available: 0,
      kategori_barang: "",
      kategori_barang_id: null,
      satuan: "",
      satuan_barang_id: null,
      isFromStok: false,
    });
    setNamaBarangSearch("");
    setStokBarangOptions([]);
  };

  const validateBarangForm = () => {
    if (!barangForm.nama_barang.trim()) {
      alert("Nama barang harus diisi! Silakan pilih dari dropdown.");
      return false;
    }

    if (!barangForm.jumlah || parseInt(barangForm.jumlah) <= 0) {
      alert("Jumlah harus lebih dari 0!");
      return false;
    }

    if (!barangForm.isFromStok) {
      alert("Barang harus dipilih dari daftar stok yang tersedia!");
      return false;
    }

    const jumlahValue = parseInt(barangForm.jumlah);
    const stokTersedia = barangForm.stok_available || 0;

    if (stokTersedia > 0 && jumlahValue > stokTersedia) {
      alert(
        `Jumlah melebihi stok tersedia! Stok tersedia: ${stokTersedia} ${barangForm.satuan}`
      );
      return false;
    }

    if (barangForm.jumlahError) {
      alert(barangForm.jumlahError);
      return false;
    }

    return true;
  };

  // Fungsi untuk validasi semua barang di daftar
  const validateAllBarang = () => {
    if (barangList.length === 0) {
      alert("Tambahkan minimal 1 barang sebelum menyimpan!");
      return false;
    }

    for (const barang of barangList) {
      if (barang.stok_available > 0 && barang.jumlah > barang.stok_available) {
        alert(
          `Barang "${barang.nama_barang}" melebihi stok tersedia!\nDiminta: ${barang.jumlah}, Stok tersedia: ${barang.stok_available}`
        );
        return false;
      }
    }

    return true;
  };

  const handleTambahBarang = () => {
    if (!validateBarangForm()) return;

    const newBarang = {
      id: Date.now(),
      nama_barang: barangForm.nama_barang,
      nama_barang_display: barangForm.nama_barang_display,
      spesifikasi: barangForm.spesifikasi || "",
      jumlah: parseInt(barangForm.jumlah),
      keterangan: barangForm.keterangan || "",
      stok_barang_id: barangForm.stok_barang_id,
      stok_available: barangForm.stok_available,
      kategori_barang: barangForm.kategori_barang,
      kategori_barang_id: barangForm.kategori_barang_id,
      satuan: barangForm.satuan,
      satuan_barang_id: barangForm.satuan_barang_id,
      isFromStok: barangForm.isFromStok,
    };

    setBarangList([...barangList, newBarang]);
    resetBarangForm();
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

  const updateDraftPermintaan = async () => {
    try {
      const updateData = {
        tanggal_kebutuhan: formData.tanggal_kebutuhan,
        catatan: formData.catatan,
        barang_list: barangList.map((barang) => ({
          kategori_barang: barang.kategori_barang,
          nama_barang: barang.nama_barang,
          spesifikasi: barang.spesifikasi,
          jumlah: barang.jumlah,
          keterangan: barang.keterangan,
          stok_barang_id: barang.stok_barang_id,
          kategori_barang_id: barang.kategori_barang_id,
          satuan_barang_id: barang.satuan_barang_id,
        })),
      };

      const response = await permintaanService.updateDraftPermintaan(
        permintaanId,
        updateData
      );

      console.log("✅ Draft updated successfully:", response);
      return true;
    } catch (error) {
      console.error("❌ Error updating draft:", error);
      throw error;
    }
  };

  const handleSimpanDraft = async () => {
    if (!formData.tanggal_kebutuhan) {
      alert("Tanggal kebutuhan harus diisi!");
      return;
    }

    if (!formData.catatan) {
      alert("Judul Permintaan harus diisi!");
      return;
    }

    if (!validateAllBarang()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateDraftPermintaan();
        alert("Draft berhasil diperbarui!");
      } else {
        const permintaanData = {
          tanggal_kebutuhan: formData.tanggal_kebutuhan,
          catatan: formData.catatan,
        };

        const createResponse = await permintaanService.createPermintaan(
          permintaanData
        );
        const newPermintaanId = createResponse.data.id;
        setPermintaanId(newPermintaanId);

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
    if (!formData.tanggal_kebutuhan) {
      alert("Tanggal kebutuhan harus diisi!");
      return;
    }

    if (!formData.catatan) {
      alert("Judul Permintaan harus diisi!");
      return;
    }

    if (!validateAllBarang()) {
      return;
    }

    if (!confirm("Apakah Anda yakin ingin mengirim permintaan ini?")) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateDraftPermintaan();
        await permintaanService.submitPermintaan(permintaanId);
        alert("Permintaan berhasil dikirim!");
        router.push("/Divisi/permintaan_divisi");
      } else {
        const permintaanData = {
          tanggal_kebutuhan: formData.tanggal_kebutuhan,
          catatan: formData.catatan,
        };

        const createResponse = await permintaanService.createPermintaan(
          permintaanData
        );
        const newPermintaanId = createResponse.data.id;

        const barangPromises = barangList.map((barang) =>
          tambahBarangKePermintaan(newPermintaanId, barang)
        );

        await Promise.all(barangPromises);
        await permintaanService.submitPermintaan(newPermintaanId);

        alert("Permintaan berhasil dikirim!");
        router.push(`/Divisi/permintaan_divisi`);
      }
    } catch (error) {
      console.error("Error sending permintaan:", error);
      setError(error.error || "Gagal mengirim permintaan");
      alert(error.error || "Gagal mengirim permintaan");
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi untuk mendapatkan nama divisi
  const getDivisiName = () => {
    // Cek jika userData memiliki nama_divisi langsung
    if (userData?.nama_divisi) {
      return userData.nama_divisi;
    }
    // Fallback: tampilkan Divisi + ID
    else if (userData?.divisi_id) {
      return `Divisi ${userData.divisi_id}`;
    }
    // Default jika tidak ada data
    else {
      return "Belum ditentukan";
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
              <Link href="/Divisi/dashboard_divisi">
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

              <Link href="/Divisi/permintaan_divisi">
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
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Email</label>
                    <input
                      type="text"
                      value={userData?.email || ""}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Divisi</label>
                    <input
                      type="text"
                      value={getDivisiName()}
                      disabled
                      className="w-full border text-black border-gray-300 bg-gray-100 rounded px-3 py-2 mt-1"
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
                      className="w-full border text-black border-gray-300 rounded px-3 py-2 mt-1 text-black"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-medium text-gray-700">
                      Judul Permintaan *
                    </label>
                    <input
                      type="text"
                      name="catatan"
                      value={formData.catatan}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700"
                      placeholder="Masukkan judul permintaan"
                      required
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
                  {/* Nama Barang */}
                  <div className="relative dropdown-container md:col-span-2">
                    <label className="font-medium text-gray-700">
                      Nama Barang *
                      <span className="text-sm text-gray-500 ml-2">
                        (Cari dan pilih dari daftar stok)
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nama_barang_display"
                        value={barangForm.nama_barang_display}
                        onChange={handleBarangInputChange}
                        onFocus={() => {
                          if (barangForm.nama_barang_display) {
                            setShowStokDropdown(true);
                          }
                        }}
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1 text-gray-700 pr-10"
                        placeholder="Ketik untuk mencari barang..."
                        required
                        autoComplete="off"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-gray-400">🔍</span>
                      </div>
                    </div>

                    {showStokDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                        {loadingDropdown ? (
                          <div className="p-3 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-1">Memuat...</p>
                          </div>
                        ) : stokBarangOptions.length > 0 ? (
                          stokBarangOptions.map((barang) => (
                            <div
                              key={barang.id}
                              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                              onClick={() => handleSelectStokBarang(barang)}
                            >
                              <div className="font-medium text-gray-800">
                                {barang.nama_barang}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">
                                  {barang.nama_kategori}
                                </span>
                                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">
                                  {barang.nama_satuan}
                                </span>
                                <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                  Stok: {barang.stok}
                                </span>
                              </div>
                              {barang.spesifikasi && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Spesifikasi: {barang.spesifikasi}
                                </div>
                              )}
                            </div>
                          ))
                        ) : namaBarangSearch ? (
                          <div className="p-3 text-center text-gray-500">
                            Barang tidak ditemukan. Pastikan nama barang sudah
                            benar.
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Kategori Barang */}
                  <div>
                    <label className="font-medium text-gray-700">
                      Kategori Barang
                    </label>
                    <input
                      type="text"
                      value={
                        barangForm.kategori_barang ||
                        "Pilih nama barang terlebih dahulu"
                      }
                      disabled
                      className={`w-full border border-gray-300 rounded px-3 py-2 mt-1 ${
                        barangForm.kategori_barang
                          ? "bg-gray-50 text-gray-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                      readOnly
                    />
                    {!barangForm.kategori_barang && (
                      <p className="text-xs text-gray-500 mt-1">
                        Akan terisi otomatis setelah memilih nama barang
                      </p>
                    )}
                  </div>

                  {/* Satuan */}
                  <div>
                    <label className="font-medium text-gray-700">Satuan</label>
                    <input
                      type="text"
                      value={
                        barangForm.satuan || "Pilih nama barang terlebih dahulu"
                      }
                      disabled
                      className={`w-full border border-gray-300 rounded px-3 py-2 mt-1 ${
                        barangForm.satuan
                          ? "bg-gray-50 text-gray-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                      readOnly
                    />
                    {!barangForm.satuan && (
                      <p className="text-xs text-gray-500 mt-1">
                        Akan terisi otomatis setelah memilih nama barang
                      </p>
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
                      className={`w-full border ${
                        barangForm.jumlahError
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } rounded px-3 py-2 mt-1 text-gray-700`}
                      placeholder="0"
                      min="1"
                      required
                      disabled={!barangForm.nama_barang}
                    />
                    {!barangForm.nama_barang && (
                      <p className="text-xs text-gray-500 mt-1">
                        Isi nama barang terlebih dahulu
                      </p>
                    )}
                    {barangForm.jumlahError && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ {barangForm.jumlahError}
                      </p>
                    )}
                  </div>

                  {/* Info Stok */}
                  {barangForm.stok_available > 0 && (
                    <div>
                      <label className="font-medium text-gray-700">
                        Stok Tersedia
                      </label>
                      <div
                        className={`p-2 rounded border mt-1 ${
                          barangForm.jumlah &&
                          parseInt(barangForm.jumlah) >
                            barangForm.stok_available
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-2">📦</span>
                          <span>
                            Tersedia: {barangForm.stok_available}{" "}
                            {barangForm.satuan}
                          </span>
                          {barangForm.jumlah &&
                            parseInt(barangForm.jumlah) >
                              barangForm.stok_available && (
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                                ⚠️ Melebihi Stok
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  )}

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
                      placeholder="Masukkan spesifikasi (jika berbeda dengan stok)"
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
                </div>

                {/* Tombol Tambah Barang */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleTambahBarang}
                    disabled={
                      isSaving || !barangForm.nama_barang || !barangForm.jumlah
                    }
                    className={`px-6 py-2 rounded font-medium ${
                      barangForm.nama_barang && barangForm.jumlah
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {barangForm.nama_barang && barangForm.jumlah
                      ? "➕ Tambah Barang"
                      : "Lengkapi data terlebih dahulu"}
                  </button>
                </div>
              </div>

              {/* Tabel Barang */}
              <div className="px-6 py-4 bg-white">
                {barangList.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <h5 className="text-lg font-semibold text-gray-800">
                        Daftar Barang ({barangList.length} item)
                      </h5>
                      <p className="text-sm text-gray-600">
                        *Kategori dan Satuan terkunci berdasarkan data stok
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-gray-700 text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="px-4 py-3 font-semibold border">
                              No
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Nama Barang
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Kategori
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Spesifikasi
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Satuan
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Jumlah
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Keterangan
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Stok
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Sisa Stok
                            </th>
                            <th className="px-4 py-3 font-semibold border">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {barangList.map((barang, index) => (
                            <tr key={barang.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border text-center">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3 border font-medium">
                                {barang.nama_barang}
                                {barang.isFromStok && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    Dari Stok
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 border">
                                <div className="flex items-center">
                                  <span>{barang.kategori_barang}</span>
                                  <span
                                    className="ml-2 text-gray-400 text-xs"
                                    title="Terisi otomatis"
                                  >
                                    🔒
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 border">
                                {barang.spesifikasi || "-"}
                              </td>
                              <td className="px-4 py-3 border">
                                <div className="flex items-center">
                                  <span>{barang.satuan}</span>
                                  <span
                                    className="ml-2 text-gray-400 text-xs"
                                    title="Terisi otomatis"
                                  >
                                    🔒
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 border text-center">
                                {barang.jumlah}
                              </td>
                              <td className="px-4 py-3 border">
                                {barang.keterangan || "-"}
                              </td>
                              <td className="px-4 py-3 border text-center">
                                <div className="flex flex-col items-center">
                                  <span className="font-medium">
                                    {barang.jumlah}
                                  </span>
                                  {barang.stok_available > 0 &&
                                    barang.jumlah > barang.stok_available && (
                                      <span className="text-xs text-red-600 mt-1">
                                        ⚠️ Melebihi stok (
                                        {barang.stok_available})
                                      </span>
                                    )}
                                </div>
                              </td>

                              <td className="px-4 py-3 border text-center">
                                {barang.stok_available > 0 ? (
                                  <div className="flex flex-col items-center">
                                    <span
                                      className={`font-medium ${
                                        barang.jumlah > barang.stok_available
                                          ? "text-red-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {barang.stok_available}
                                    </span>
                                    {barang.jumlah > barang.stok_available && (
                                      <span className="text-xs text-red-600">
                                        ❌ Melebihi
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 border text-center">
                                <button
                                  onClick={() => handleHapusBarang(index)}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
                                  title="Hapus barang"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-lg">Belum ada barang yang ditambahkan</p>
                    <p className="text-sm mt-1">
                      Tambahkan barang dengan mengisi form di atas
                    </p>
                  </div>
                )}

                {/* Tombol Simpan & Kirim */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    onClick={handleSimpanDraft}
                    disabled={
                      isSaving ||
                      barangList.length === 0 ||
                      barangList.some(
                        (barang) =>
                          barang.stok_available > 0 &&
                          barang.jumlah > barang.stok_available
                      )
                    }
                    className={`px-6 py-2.5 rounded font-medium ${
                      barangList.some(
                        (barang) =>
                          barang.stok_available > 0 &&
                          barang.jumlah > barang.stok_available
                      )
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title={
                      barangList.some(
                        (barang) =>
                          barang.stok_available > 0 &&
                          barang.jumlah > barang.stok_available
                      )
                        ? "Ada barang yang melebihi stok tersedia"
                        : "Simpan permintaan sebagai draft"
                    }
                  >
                    {isSaving ? "⏳ Menyimpan..." : "💾 Simpan Draft"}
                  </button>
                  <button
                    onClick={handleKirim}
                    disabled={
                      isSaving ||
                      barangList.length === 0 ||
                      barangList.some(
                        (barang) =>
                          barang.stok_available > 0 &&
                          barang.jumlah > barang.stok_available
                      )
                    }
                    className={`px-6 py-2.5 rounded font-medium ${
                      barangList.some(
                        (barang) =>
                          barang.stok_available > 0 &&
                          barang.jumlah > barang.stok_available
                      )
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title={
                      barangList.some(
                        (barang) =>
                          barang.stok_available > 0 &&
                          barang.jumlah > barang.stok_available
                      )
                        ? "Ada barang yang melebihi stok tersedia"
                        : "Kirim permintaan untuk diverifikasi"
                    }
                  >
                    {isSaving ? "⏳ Mengirim..." : "📤 Kirim Permintaan"}
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