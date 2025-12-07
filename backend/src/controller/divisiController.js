import Divisi from "../models/divisi.js";

// Get all divisi dengan pagination untuk admin
export const getAllDivisi = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    console.log("🏢 Admin getting all divisi:", { page, limit, search });

    const result = await Divisi.findAllWithPagination(page, limit, search);

    res.json({
      message: "Daftar divisi berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get all divisi error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get all divisi untuk dropdown (tanpa pagination)
export const getDivisiDropdown = async (req, res) => {
  try {
    console.log("📋 Getting divisi dropdown");

    const divisiList = await Divisi.findAll();

    res.json({
      message: "Daftar divisi untuk dropdown berhasil diambil.",
      data: divisiList,
    });
  } catch (error) {
    console.error("💥 Get divisi dropdown error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get divisi detail
export const getDivisiDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting divisi detail:", id);

    const divisi = await Divisi.findById(id);

    if (!divisi) {
      return res.status(404).json({ error: "Divisi tidak ditemukan." });
    }

    res.json({
      message: "Detail divisi berhasil diambil.",
      data: divisi,
    });
  } catch (error) {
    console.error("💥 Get divisi detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Create new divisi
export const createDivisi = async (req, res) => {
  try {
    const { nama_divisi } = req.body;

    console.log("🆕 Creating new divisi:", { nama_divisi });

    // Validasi input
    if (!nama_divisi || nama_divisi.trim() === "") {
      return res.status(400).json({ error: "Nama divisi harus diisi." });
    }

    // Cek apakah nama divisi sudah ada
    const existingDivisi = await Divisi.findByNama(nama_divisi.trim());
    if (existingDivisi) {
      return res.status(400).json({ error: "Nama divisi sudah digunakan." });
    }

    const divisiId = await Divisi.create(nama_divisi.trim());

    console.log("✅ Divisi created with ID:", divisiId);

    res.status(201).json({
      message: "Divisi berhasil dibuat.",
      data: { id: divisiId },
    });
  } catch (error) {
    console.error("💥 Create divisi error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Update divisi
export const updateDivisi = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_divisi } = req.body;

    console.log("✏️ Updating divisi:", { id, nama_divisi });

    // Validasi input
    if (!nama_divisi || nama_divisi.trim() === "") {
      return res.status(400).json({ error: "Nama divisi harus diisi." });
    }

    // Cek apakah divisi ada
    const existingDivisi = await Divisi.findById(id);
    if (!existingDivisi) {
      return res.status(404).json({ error: "Divisi tidak ditemukan." });
    }

    // Cek apakah nama divisi sudah digunakan (oleh divisi lain)
    const divisiWithSameName = await Divisi.findByNama(nama_divisi.trim());
    if (divisiWithSameName && divisiWithSameName.id !== parseInt(id)) {
      return res.status(400).json({ error: "Nama divisi sudah digunakan." });
    }

    const affectedRows = await Divisi.update(id, nama_divisi.trim());

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal mengupdate divisi." });
    }

    res.json({
      message: "Divisi berhasil diupdate.",
    });
  } catch (error) {
    console.error("💥 Update divisi error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Delete divisi
export const deleteDivisi = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting divisi:", id);

    // Cek apakah divisi ada
    const existingDivisi = await Divisi.findById(id);
    if (!existingDivisi) {
      return res.status(404).json({ error: "Divisi tidak ditemukan." });
    }

    try {
      const affectedRows = await Divisi.delete(id);

      if (affectedRows === 0) {
        return res.status(400).json({ error: "Gagal menghapus divisi." });
      }

      res.json({
        message: "Divisi berhasil dihapus.",
      });
    } catch (error) {
      if (error.message.includes("masih digunakan")) {
        return res.status(400).json({
          error:
            "Tidak dapat menghapus divisi karena masih digunakan oleh pengguna.",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("💥 Delete divisi error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get divisi statistics
export const getDivisiStats = async (req, res) => {
  try {
    console.log("📊 Getting divisi statistics");

    const stats = await Divisi.getStats();

    res.json({
      message: "Statistik divisi berhasil diambil.",
      data: stats,
    });
  } catch (error) {
    console.error("💥 Get divisi stats error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get all divisi untuk dropdown (tanpa pagination) - untuk pemohon
export const getDivisiDropdownForPemohon = async (req, res) => {
  try {
    console.log("📋 Pemohon getting divisi dropdown");

    const divisiList = await Divisi.findAll();

    res.json({
      message: "Daftar divisi untuk dropdown berhasil diambil.",
      data: divisiList,
    });
  } catch (error) {
    console.error("💥 Get divisi dropdown for pemohon error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export default {
  getAllDivisi,
  getDivisiDropdown,
  getDivisiDetail,
  createDivisi,
  updateDivisi,
  deleteDivisi,
  getDivisiStats,
  getDivisiDropdownForPemohon,
};
