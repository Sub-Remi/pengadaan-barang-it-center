import DokumenPembelian from "../models/dokumen_pembelian.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import dbPool from "../config/database.js";

// Temporary controller untuk validator - bisa diisi nanti
export const getPermintaanForValidation = async (req, res) => {
  try {
    res.json({
      message: "Daftar permintaan untuk validasi",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateBarang = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      message: `Barang dengan ID ${id} berhasil divalidasi`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get dokumen yang perlu divalidasi
export const getDokumenForValidation = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filters
    const filters = {
      jenis_dokumen: req.query.jenis_dokumen || "",
      divisi_id: req.query.divisi_id || "",
      search: req.query.search || "",
    };

    console.log("📋 Validator getting dokumen for validation:", filters);

    const result = await DokumenPembelian.findDokumenForValidation(
      page,
      limit,
      filters
    );

    res.json({
      message: "Daftar dokumen untuk validasi berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get dokumen for validation error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get riwayat dokumen yang sudah divalidasi
export const getValidatedDokumen = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filters
    const filters = {
      is_valid: req.query.is_valid || "",
      jenis_dokumen: req.query.jenis_dokumen || "",
      search: req.query.search || "",
    };

    console.log("📋 Validator getting validated dokumen:", filters);

    const result = await DokumenPembelian.findValidatedDokumen(
      page,
      limit,
      filters
    );

    res.json({
      message: "Riwayat dokumen validasi berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get validated dokumen error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get detail dokumen untuk validasi
export const getDokumenDetailForValidation = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Validator getting dokumen detail for validation:", id);

    const dokumen = await DokumenPembelian.findById(id);

    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    // Get semua dokumen untuk barang yang sama (untuk context)
    const allDokumenForBarang = await DokumenPembelian.findByBarangPermintaanId(
      dokumen.barang_permintaan_id
    );

    res.json({
      message: "Detail dokumen untuk validasi berhasil diambil.",
      data: {
        ...dokumen,
        all_dokumen: allDokumenForBarang,
      },
    });
  } catch (error) {
    console.error("💥 Get dokumen detail for validation error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Validasi dokumen (approve/reject)
export const validateDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_valid, catatan_validator } = req.body;
    const validated_by = req.user.id;

    console.log("✅ Validating dokumen:", { id, is_valid, catatan_validator });

    // Validasi input
    if (is_valid === undefined || is_valid === null) {
      return res
        .status(400)
        .json({ error: "Status validasi harus diisi (true/false)." });
    }

    // Cek apakah dokumen ada
    const dokumen = await DokumenPembelian.findById(id);
    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    // Cek apakah dokumen sudah divalidasi
    if (dokumen.is_valid !== null) {
      return res
        .status(400)
        .json({ error: "Dokumen sudah divalidasi sebelumnya." });
    }

    // Update validasi dokumen
    const affectedRows = await DokumenPembelian.updateValidation(
      id,
      is_valid,
      catatan_validator,
      validated_by
    );

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal memvalidasi dokumen." });
    }

    // Cek status semua dokumen untuk barang ini
    const dokumenStatus = await BarangPermintaan.checkAllDokumenValidated(
      dokumen.barang_permintaan_id
    );

    console.log("📊 Dokumen status after validation:", dokumenStatus);

    // Jika ada dokumen yang di-reject, update status barang
    if (dokumenStatus.rejected_count > 0) {
      await BarangPermintaan.updateStatusAfterValidation(
        dokumen.barang_permintaan_id,
        "ditolak"
      );
      console.log("❌ Barang ditolak karena ada dokumen yang di-reject");
    }
    // Jika semua dokumen sudah divalidasi (approved)
    else if (
      dokumenStatus.pending_count === 0 &&
      dokumenStatus.validated_count > 0
    ) {
      await BarangPermintaan.updateStatusAfterValidation(
        dokumen.barang_permintaan_id,
        "selesai"
      );
      console.log(
        "✅ Semua dokumen validated, barang status updated to selesai"
      );
    }

    res.json({
      message: `Dokumen berhasil ${is_valid ? "divalidasi" : "ditolak"}.`,
      data: {
        is_valid: is_valid,
        catatan_validator: catatan_validator,
      },
    });
  } catch (error) {
    console.error("💥 Validate dokumen error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get validator dashboard statistics - FIX dengan query manual
export const getValidatorStats = async (req, res) => {
  try {
    console.log("📊 Getting validator statistics");

    // Hitung dokumen pending validation
    const pendingQuery = `
      SELECT COUNT(*) as total 
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      WHERE bp.status = 'dalam pemesanan'
      AND dp.is_valid IS NULL
    `;

    // Hitung dokumen validated
    const validatedQuery = `
      SELECT COUNT(*) as total 
      FROM dokumen_pembelian 
      WHERE is_valid = true
    `;

    // Hitung dokumen rejected
    const rejectedQuery = `
      SELECT COUNT(*) as total 
      FROM dokumen_pembelian 
      WHERE is_valid = false
    `;

    const [[pendingRows]] = await dbPool.execute(pendingQuery);
    const [[validatedRows]] = await dbPool.execute(validatedQuery);
    const [[rejectedRows]] = await dbPool.execute(rejectedQuery);

    const stats = {
      pending: pendingRows.total,
      validated: validatedRows.total,
      rejected: rejectedRows.total,
      total: pendingRows.total + validatedRows.total + rejectedRows.total,
    };

    res.json({
      message: "Statistik validator berhasil diambil.",
      data: stats,
    });
  } catch (error) {
    console.error("💥 Get validator stats error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get permintaan dengan barang dalam pemesanan (alternatif view)
export const getPermintaanWithPemesanan = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      divisi_id: req.query.divisi_id || "",
      search: req.query.search || "",
    };

    console.log("📋 Validator getting permintaan with pemesanan:", filters);

    // Query untuk mendapatkan permintaan yang memiliki barang dengan status 'dalam pemesanan'
    let query = `
      SELECT DISTINCT
        p.*,
        u.nama_lengkap,
        d.nama_divisi,
        COUNT(bp.id) as jumlah_barang_pemesanan
      FROM permintaan p
      JOIN users u ON p.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      JOIN barang_permintaan bp ON p.id = bp.permintaan_id
      WHERE bp.status = 'dalam pemesanan'
    `;

    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM permintaan p
      JOIN barang_permintaan bp ON p.id = bp.permintaan_id
      WHERE bp.status = 'dalam pemesanan'
    `;

    const values = [];
    const countValues = [];

    // Filter by divisi
    if (filters.divisi_id) {
      query += " AND u.divisi_id = ?";
      countQuery += " AND u.divisi_id = ?";
      values.push(filters.divisi_id);
      countValues.push(filters.divisi_id);
    }

    // Search by nomor permintaan atau nama pemohon
    if (filters.search) {
      query += " AND (p.nomor_permintaan LIKE ? OR u.nama_lengkap LIKE ?)";
      countQuery += " AND (p.nomor_permintaan LIKE ? OR u.nama_lengkap LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm);
    }

    query += " GROUP BY p.id";
    query += " ORDER BY p.created_at DESC";

    // Pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      // Untuk setiap permintaan, get detail barang dan dokumen
      const permintaanWithDetails = await Promise.all(
        rows.map(async (permintaan) => {
          const barangList = await BarangPermintaan.findByPermintaanId(
            permintaan.id
          );
          const barangPemesanan = barangList.filter(
            (barang) => barang.status === "dalam pemesanan"
          );

          // Get dokumen untuk setiap barang pemesanan
          const barangWithDokumen = await Promise.all(
            barangPemesanan.map(async (barang) => {
              const dokumenList =
                await DokumenPembelian.findByBarangPermintaanId(barang.id);
              return {
                ...barang,
                dokumen: dokumenList,
              };
            })
          );

          return {
            ...permintaan,
            barang: barangWithDokumen,
          };
        })
      );

      res.json({
        message: "Daftar permintaan dengan barang pemesanan berhasil diambil.",
        data: permintaanWithDetails,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("💥 Get permintaan with pemesanan error:", error);
      throw error;
    }
  } catch (error) {
    console.error("💥 Get permintaan with pemesanan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export default {
  getPermintaanForValidation,
  validateBarang,
  getDokumenForValidation,
  getValidatedDokumen,
  getDokumenDetailForValidation,
  validateDokumen,
  getValidatorStats,
  getPermintaanWithPemesanan,
};
