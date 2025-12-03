import StokBarang from "../models/stok_barang.js";
import KategoriBarang from "../models/kategori_barang.js";
import SatuanBarang from "../models/satuan_barang.js";

// Get all stok dengan join kategori dan satuan
export const getAllStok = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const kategori_id = req.query.kategori_id || "";
    const satuan_id = req.query.satuan_id || "";

    const result = await StokBarang.findAllWithPagination(
      page,
      limit,
      search,
      kategori_id,
      satuan_id
    );

    // Get all kategori dan satuan untuk filter dropdown
    const [allKategori, allSatuan] = await Promise.all([
      KategoriBarang.findAll(),
      SatuanBarang.findAll(),
    ]);

    res.json({
      success: true,
      message: "Daftar stok barang berhasil diambil.",
      data: result.data,
      filters: {
        kategori: allKategori,
        satuan: allSatuan,
      },
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get all stok error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Get detail stok
export const getStokDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const stok = await StokBarang.findById(id);

    if (!stok) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Detail stok barang berhasil diambil.",
      data: stok,
    });
  } catch (error) {
    console.error("💥 Get stok detail error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Create new stok (dari halaman Data Barang)
export const createStok = async (req, res) => {
  try {
    const {
      kode_barang, // DITERIMA DARI INPUT FRONTEND
      kategori_barang_id,
      nama_barang,
      spesifikasi,
      satuan_barang_id,
      stok = 0, // DEFAULT 0
      stok_minimum = 0,
    } = req.body;

    console.log("📦 Creating new barang:", {
      kode_barang,
      nama_barang,
      kategori_barang_id,
      satuan_barang_id,
    });

    // ✅ VALIDASI INPUT YANG DIPERLUKAN
    const requiredFields = [
      "kode_barang",
      "kategori_barang_id",
      "nama_barang",
      "satuan_barang_id",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Field berikut harus diisi: ${missingFields.join(", ")}`,
      });
    }

    // ✅ VALIDASI 1: Cek apakah kode barang sudah digunakan
    const existingKode = await StokBarang.findByKode(kode_barang);
    if (existingKode) {
      return res.status(400).json({
        success: false,
        error: "Kode barang sudah digunakan.",
        data: {
          existing_item: {
            kode: existingKode.kode_barang,
            nama: existingKode.nama_barang,
          },
        },
      });
    }

    // ✅ VALIDASI 2: Cek apakah nama + spesifikasi sudah ada
    const existingBarang = await StokBarang.findByNamaAndSpesifikasi(
      nama_barang,
      spesifikasi
    );
    if (existingBarang) {
      return res.status(400).json({
        success: false,
        error: "Barang dengan nama dan spesifikasi yang sama sudah ada.",
        data: {
          existing_item: {
            kode: existingBarang.kode_barang,
            nama: existingBarang.nama_barang,
            spesifikasi: existingBarang.spesifikasi,
          },
        },
      });
    }

    // ✅ VALIDASI 3: Cek apakah kategori dan satuan valid
    const [kategori, satuan] = await Promise.all([
      KategoriBarang.findById(kategori_barang_id),
      SatuanBarang.findById(satuan_barang_id),
    ]);

    if (!kategori) {
      return res.status(400).json({
        success: false,
        error: "Kategori tidak ditemukan.",
      });
    }

    if (!satuan) {
      return res.status(400).json({
        success: false,
        error: "Satuan tidak ditemukan.",
      });
    }

    // ✅ CREATE BARANG BARU
    const stokId = await StokBarang.create({
      kode_barang: kode_barang.trim(),
      kategori_barang_id,
      nama_barang: nama_barang.trim(),
      spesifikasi: (spesifikasi || "").trim(),
      satuan_barang_id,
      stok: parseInt(stok) || 0, // Default 0
      stok_minimum: parseInt(stok_minimum) || 0,
    });

    console.log("✅ Barang created with ID:", stokId);

    res.status(201).json({
      success: true,
      message: "Barang berhasil ditambahkan.",
      data: {
        id: stokId,
        kode_barang: kode_barang,
        nama_barang: nama_barang,
      },
    });
  } catch (error) {
    console.error("💥 Create stok error:", error);

    // Handle duplicate error lebih spesifik
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        error: "Data barang sudah ada di sistem.",
      });
    }

    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Update stok (tidak termasuk kode_barang dan stok)
export const updateStok = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kategori_barang_id,
      nama_barang,
      spesifikasi,
      satuan_barang_id,
      stok_minimum,
    } = req.body;

    // Validasi input
    if (!kategori_barang_id || !nama_barang || !satuan_barang_id) {
      return res.status(400).json({
        success: false,
        error: "Kategori, nama barang, dan satuan harus diisi.",
      });
    }

    // Cek apakah stok ada
    const existingStok = await StokBarang.findById(id);
    if (!existingStok) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan.",
      });
    }

    // Cek apakah kategori dan satuan valid
    const [kategori, satuan] = await Promise.all([
      KategoriBarang.findById(kategori_barang_id),
      SatuanBarang.findById(satuan_barang_id),
    ]);

    if (!kategori) {
      return res.status(400).json({
        success: false,
        error: "Kategori tidak ditemukan.",
      });
    }

    if (!satuan) {
      return res.status(400).json({
        success: false,
        error: "Satuan tidak ditemukan.",
      });
    }

    // Update stok
    const affectedRows = await StokBarang.update(id, {
      kategori_barang_id,
      nama_barang: nama_barang.trim(),
      spesifikasi: spesifikasi?.trim() || "",
      satuan_barang_id,
      stok_minimum: parseInt(stok_minimum) || 0,
    });

    if (affectedRows === 0) {
      return res.status(400).json({
        success: false,
        error: "Gagal mengupdate stok barang.",
      });
    }

    res.json({
      success: true,
      message: "Stok barang berhasil diupdate.",
    });
  } catch (error) {
    console.error("💥 Update stok error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Tambah stok quantity
export const tambahStok = async (req, res) => {
  try {
    const { id } = req.params;
    const { tambah_stok } = req.body;

    if (!tambah_stok || tambah_stok <= 0) {
      return res.status(400).json({
        success: false,
        error: "Jumlah stok yang ditambahkan harus lebih dari 0.",
      });
    }

    const result = await StokBarang.updateStokQuantity(id, tambah_stok);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: `Stok berhasil ditambahkan ${tambah_stok} unit.`,
      data: { new_stok: result.newStok },
    });
  } catch (error) {
    console.error("💥 Tambah stok error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Terjadi kesalahan server.",
    });
  }
};

// Delete stok
export const deleteStok = async (req, res) => {
  try {
    const { id } = req.params;

    const affectedRows = await StokBarang.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: "Stok barang tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      message: "Stok barang berhasil dihapus.",
    });
  } catch (error) {
    console.error("💥 Delete stok error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Get all barang untuk halaman Data Barang
export const getAllBarang = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const kategori_id = req.query.kategori_id || "";

    const result = await StokBarang.findAllWithPagination(
      page,
      limit,
      search,
      kategori_id,
      ""
    );

    // Get all kategori untuk filter
    const allKategori = await KategoriBarang.findAll();

    res.json({
      success: true,
      message: "Daftar barang berhasil diambil.",
      data: result.data,
      filters: {
        kategori: allKategori,
      },
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get all barang error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

// Get barang untuk dropdown (select option)
export const getBarangDropdown = async (req, res) => {
  try {
    const barangList = await StokBarang.findAllForDropdown();

    res.json({
      success: true,
      message: "Daftar barang untuk dropdown berhasil diambil.",
      data: barangList,
    });
  } catch (error) {
    console.error("💥 Get barang dropdown error:", error);
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan server.",
    });
  }
};

export default {
  getAllStok,
  getStokDetail,
  createStok,
  updateStok,
  tambahStok,
  deleteStok,
  getAllBarang,
  getBarangDropdown,
};
