import DokumenPembelian from "../models/dokumen_pembelian.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import dbPool from "../config/database.js";
import { uniq } from "lodash-es";

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

// Di validatorController.js, tambahkan:
export const updatePemesananStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("🔄 Updating pemesanan status:", { id, status });

    if (!status) {
      return res.status(400).json({ error: "Status harus diisi." });
    }

    // HANYA nilai enum yang valid dari tabel pemesanan
    const validStatuses = ["diproses", "selesai", "ditolak"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Status tidak valid. Status yang diperbolehkan: ${validStatuses.join(
          ", "
        )}`,
      });
    }

    const query = `
      UPDATE pemesanan 
      SET status = ?, updated_at = NOW() 
      WHERE id = ?
    `;

    const [result] = await dbPool.execute(query, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pemesanan tidak ditemukan." });
    }

    res.json({
      message: `Status pemesanan berhasil diubah menjadi ${status}.`,
    });
  } catch (error) {
    console.error("💥 Update pemesanan status error:", error);
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

// Validasi dokumen (approve/reject) - LOGIKA BARU
export const validateDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_valid, catatan_validator } = req.body;
    const validated_by = req.user.id;

    console.log("✅ Validating dokumen:", {
      id,
      is_valid,
      catatan_validator,
      validated_by,
    });

    // Validasi input
    if (is_valid === undefined || is_valid === null) {
      return res
        .status(400)
        .json({ error: "Status validasi harus diisi (true/false)." });
    }

    // Konversi ke boolean
    const isValidBoolean =
      is_valid === true || is_valid === "true" || is_valid === 1;

    // Cek apakah dokumen ada
    const dokumen = await DokumenPembelian.findById(id);
    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    // PERBAIKAN: Izinkan validasi ulang jika status sebelumnya "ditolak"
    if (dokumen.is_valid === 1) {
      return res.status(400).json({
        error: "Dokumen sudah divalidasi sebelumnya dan tidak bisa diubah.",
      });
    }

    // Jika ditolak, wajib catatan
    if (
      !isValidBoolean &&
      (!catatan_validator || catatan_validator.trim() === "")
    ) {
      return res.status(400).json({
        error: "Harap berikan catatan penolakan.",
      });
    }

    // PERBAIKAN: Update validasi dokumen (boleh update jika is_valid = 0 atau null)
    const affectedRows = await DokumenPembelian.updateValidation(
      id,
      isValidBoolean,
      catatan_validator,
      validated_by
    );

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal memvalidasi dokumen." });
    }

    console.log("✅ Dokumen validation updated:", {
      dokumen_id: id,
      is_valid: isValidBoolean,
      affectedRows,
    });

    // Cek status semua dokumen untuk barang ini
    const dokumenStatus = await BarangPermintaan.checkAllDokumenValidated(
      dokumen.barang_permintaan_id
    );

    console.log("📊 Dokumen status after validation:", dokumenStatus);

    // PERBAIKAN: LOGIKA STATUS YANG BENAR
    const totalDokumen = parseInt(dokumenStatus.total_dokumen) || 0;
    const validatedCount = parseInt(dokumenStatus.validated_count) || 0;
    const rejectedCount = parseInt(dokumenStatus.rejected_count) || 0;
    const pendingCount = parseInt(dokumenStatus.pending_count) || 0;

    console.log("📈 Dokumen counts:", {
      totalDokumen,
      validatedCount,
      rejectedCount,
      pendingCount,
    });

    // PERBAIKAN: GET PEMESANAN ID DARI BARANG_PERMINTAAN
    const getPemesananQuery = `
      SELECT p.id as pemesanan_id, p.status as pemesanan_status
      FROM pemesanan p
      WHERE p.barang_permintaan_id = ?
    `;
    const [[pemesananData]] = await dbPool.execute(getPemesananQuery, [
      dokumen.barang_permintaan_id,
    ]);

    if (!pemesananData) {
      console.log(
        "⚠️ Pemesanan tidak ditemukan untuk barang:",
        dokumen.barang_permintaan_id
      );
    } else {
      console.log("📦 Pemesanan data:", pemesananData);
    }

    // LOGIKA: Update status berdasarkan kondisi dokumen
    let newBarangStatus = "dalam pemesanan"; // default
    let newPemesananStatus = "diproses"; // default

    // 1. Jika ada dokumen yang ditolak
    if (rejectedCount > 0) {
      newBarangStatus = "dalam pemesanan"; // Tetap dalam pemesanan agar bisa direvisi
      newPemesananStatus = "diproses"; // Tetap diproses
      console.log("❌ Ada dokumen ditolak, status tetap untuk revisi");
    }
    // 2. Jika semua dokumen sudah divalidasi (approved)
    else if (
      pendingCount === 0 &&
      validatedCount === totalDokumen &&
      totalDokumen > 0
    ) {
      newBarangStatus = "selesai";
      newPemesananStatus = "selesai"; // Status khusus untuk pemesanan yang sudah divalidasi
      console.log("✅ Semua dokumen validated");
    }
    // 3. Jika masih ada dokumen pending
    else {
      newBarangStatus = "dalam pemesanan";
      newPemesananStatus = "diproses";
      console.log("⏳ Masih ada dokumen pending");
    }

    // Update status barang_permintaan
    await BarangPermintaan.updateStatusAfterValidation(
      dokumen.barang_permintaan_id,
      newBarangStatus,
      isValidBoolean ? "" : catatan_validator
    );

    // Update status pemesanan jika ada
    if (pemesananData) {
      const updatePemesananQuery = `
        UPDATE pemesanan 
        SET status = ?, updated_at = NOW() 
        WHERE id = ?
      `;
      await dbPool.execute(updatePemesananQuery, [
        newPemesananStatus,
        pemesananData.pemesanan_id,
      ]);
      console.log(
        `📦 Status pemesanan ${pemesananData.pemesanan_id} diubah menjadi ${newPemesananStatus}`
      );
    }

    // Cek dan update status permintaan
    const checkPermintaanQuery = `
      SELECT permintaan_id 
      FROM barang_permintaan 
      WHERE id = ?
    `;
    const [[barangRow]] = await dbPool.execute(checkPermintaanQuery, [
      dokumen.barang_permintaan_id,
    ]);

    if (barangRow) {
      const checkAllBarangQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
          SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
          SUM(CASE WHEN status IN ('menunggu validasi', 'diproses', 'dalam pemesanan') THEN 1 ELSE 0 END) as dalam_proses
        FROM barang_permintaan
        WHERE permintaan_id = ?
      `;
      const [[statusRows]] = await dbPool.execute(checkAllBarangQuery, [
        barangRow.permintaan_id,
      ]);

      const totalBarang = parseInt(statusRows.total) || 0;
      const jumlahSelesai = parseInt(statusRows.selesai) || 0;
      const jumlahDitolak = parseInt(statusRows.ditolak) || 0;
      const jumlahDalamProses = parseInt(statusRows.dalam_proses) || 0;

      let statusPermintaan = "diproses";

      if (jumlahDalamProses === 0 && totalBarang > 0) {
        if (jumlahDitolak === totalBarang) {
          statusPermintaan = "ditolak";
        } else {
          statusPermintaan = "selesai";
        }
      }

      // Update status permintaan
      await dbPool.execute(
        "UPDATE permintaan SET status = ?, updated_at = NOW() WHERE id = ?",
        [statusPermintaan, barangRow.permintaan_id]
      );
      console.log(
        `📄 Status permintaan ${barangRow.permintaan_id} diubah menjadi ${statusPermintaan}`
      );
    }

    res.json({
      message: `Dokumen berhasil ${isValidBoolean ? "divalidasi" : "ditolak"}.`,
      data: {
        is_valid: isValidBoolean,
        catatan_validator: catatan_validator,
        dokumen_status: dokumenStatus,
        new_barang_status: newBarangStatus,
        new_pemesanan_status: newPemesananStatus,
      },
    });
  } catch (error) {
    console.error("💥 Validate dokumen error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
              // Tambahkan key unik untuk setiap dokumen
              const dokumenWithKeys = dokumenList.map((d) => ({
                ...d,
                uniqueKey: `${d.id}-${d.jenis_dokumen}`,
              }));
              return {
                ...barang,
                dokumen: dokumenWithKeys,
                uniqueKey: `${barang.id}-${barang.nama_barang}`,
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

// Di validatorController.js, fungsi getPemesananForValidator
export const getPemesananForValidator = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      status: req.query.status || "",
      search: req.query.search || "",
      start_date: req.query.start_date || "",
      end_date: req.query.end_date || "",
    };

    console.log("📋 Validator getting pemesanan with filters:", filters);

    // HAPUS kondisi WHERE bp.status = 'dalam pemesanan'
    let query = `
      SELECT 
        p.*,
        bp.nama_barang,
        bp.jumlah,
        bp.spesifikasi,
        perm.nomor_permintaan,
        u.nama_lengkap as pemohon_nama,
        d.nama_divisi,
        (SELECT COUNT(*) FROM dokumen_pembelian dp 
         WHERE dp.barang_permintaan_id = bp.id) as jumlah_dokumen,
        (SELECT COUNT(*) FROM dokumen_pembelian dp 
         WHERE dp.barang_permintaan_id = bp.id AND dp.is_valid IS NULL) as dokumen_pending,
        bp.status as barang_status  // Tambahkan status barang
      FROM pemesanan p
      JOIN barang_permintaan bp ON p.barang_permintaan_id = bp.id
      JOIN permintaan perm ON bp.permintaan_id = perm.id
      JOIN users u ON perm.user_id = u.id
      JOIN divisi d ON u.divisi_id = d.id
      WHERE 1=1  // Ubah dari WHERE bp.status = 'dalam pemesanan'
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM pemesanan p
      JOIN barang_permintaan bp ON p.barang_permintaan_id = bp.id
      WHERE 1=1  // Ubah juga di count query
    `;

    const values = [];
    const countValues = [];

    // Filter by status - TAMPILKAN SEMUA STATUS, bukan hanya 'diproses'
    if (filters.status && filters.status !== "semua") {
      query += " AND p.status = ?";
      countQuery += " AND p.status = ?";
      values.push(filters.status);
      countValues.push(filters.status);
    }

    // Filter by date range
    if (filters.start_date) {
      query += " AND p.tanggal_pemesanan >= ?";
      countQuery += " AND p.tanggal_pemesanan >= ?";
      values.push(filters.start_date);
      countValues.push(filters.start_date);
    }

    if (filters.end_date) {
      query += " AND p.tanggal_pemesanan <= ?";
      countQuery += " AND p.tanggal_pemesanan <= ?";
      values.push(filters.end_date);
      countValues.push(filters.end_date);
    }

    // Filter by search
    if (filters.search) {
      query +=
        " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ? OR u.nama_lengkap LIKE ?)";
      countQuery +=
        " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ? OR u.nama_lengkap LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm, searchTerm);
    }

    query += " ORDER BY p.created_at DESC";

    // Pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      // Format data untuk frontend
      const formattedData = rows.map((row) => ({
        id: row.id,
        pemesanan_id: row.id,
        barang_permintaan_id: row.barang_permintaan_id,
        nomor_permintaan: row.nomor_permintaan,
        tanggal: row.tanggal_pemesanan,
        nama_barang: row.nama_barang,
        jumlah: row.jumlah,
        pemohon: row.pemohon_nama,
        divisi: row.nama_divisi,
        status: row.status,
        barang_status: row.barang_status, // Kirim status barang juga
        jumlah_dokumen: row.jumlah_dokumen,
        dokumen_pending: row.dokumen_pending,
        created_at: row.created_at,
        catatan: row.catatan || "",
      }));

      res.json({
        message: "Data pemesanan berhasil diambil.",
        data: formattedData,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      console.error("💥 Get pemesanan for validator error:", error);
      throw error;
    }
  } catch (error) {
    console.error("💥 Get pemesanan for validator error:", error);
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
  updatePemesananStatus,
  getPemesananForValidator,
};
