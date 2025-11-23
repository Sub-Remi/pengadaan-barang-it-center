import DokumenPembelian from "../models/dokumen_pembelian.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import fs from "fs";

// Upload dokumen pembelian - SIMPLIFIED
export const uploadDokumenPembelian = async (req, res) => {
  try {
    const { barang_permintaan_id, jenis_dokumen } = req.body;
    const uploaded_by = req.user.id;
    const file = req.file;

    console.log("📄 Uploading dokumen pembelian:", {
      barang_permintaan_id,
      jenis_dokumen,
      uploaded_by,
    });

    // Validasi input - HANYA 2 FIELD WAJIB
    if (!barang_permintaan_id || !jenis_dokumen) {
      return res.status(400).json({
        error: "Barang permintaan ID dan jenis dokumen harus diisi.",
      });
    }

    if (!file) {
      return res.status(400).json({ error: "File dokumen harus diupload." });
    }

    // Validasi jenis dokumen
    const validJenisDokumen = ["PO", "Nota", "Form Penerimaan", "Lainnya"];
    if (!validJenisDokumen.includes(jenis_dokumen)) {
      return res.status(400).json({ error: "Jenis dokumen tidak valid." });
    }

    // Cek apakah barang permintaan ada
    const barang = await BarangPermintaan.findById(barang_permintaan_id);
    if (!barang) {
      // Hapus file yang sudah diupload jika barang tidak ditemukan
      if (file.path) {
        fs.unlinkSync(file.path);
      }
      return res
        .status(404)
        .json({ error: "Barang permintaan tidak ditemukan." });
    }

    // Upload dokumen - HANYA SIMPAN METADATA FILE
    const dokumenId = await DokumenPembelian.create({
      barang_permintaan_id,
      jenis_dokumen,
      file_url: file.path,
      original_name: file.originalname,
      file_size: file.size,
      uploaded_by,
    });

    console.log("✅ Dokumen pembelian uploaded with ID:", dokumenId);

    res.status(201).json({
      message: "Dokumen pembelian berhasil diupload.",
      data: {
        id: dokumenId,
        file_name: file.originalname,
        file_size: file.size,
      },
    });
  } catch (error) {
    console.error("💥 Upload dokumen pembelian error:", error);

    // Hapus file yang sudah diupload jika ada error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get all dokumen by barang_permintaan_id
export const getDokumenByBarangPermintaan = async (req, res) => {
  try {
    const { barang_permintaan_id } = req.params;

    console.log(
      "📋 Getting dokumen for barang permintaan:",
      barang_permintaan_id
    );

    const dokumenList = await DokumenPembelian.findByBarangPermintaanId(
      barang_permintaan_id
    );

    res.json({
      message: "Daftar dokumen berhasil diambil.",
      data: dokumenList,
    });
  } catch (error) {
    console.error("💥 Get dokumen by barang permintaan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get dokumen detail
export const getDokumenDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting dokumen detail:", id);

    const dokumen = await DokumenPembelian.findById(id);

    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    res.json({
      message: "Detail dokumen berhasil diambil.",
      data: dokumen,
    });
  } catch (error) {
    console.error("💥 Get dokumen detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Delete dokumen
export const deleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting dokumen:", id);

    // Cek apakah dokumen ada
    const existingDokumen = await DokumenPembelian.findById(id);
    if (!existingDokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    const result = await DokumenPembelian.delete(id);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Gagal menghapus dokumen." });
    }

    // Hapus file fisik dari server
    if (result.filePath && fs.existsSync(result.filePath)) {
      fs.unlinkSync(result.filePath);
      console.log("✅ Physical file deleted:", result.filePath);
    }

    res.json({
      message: "Dokumen berhasil dihapus.",
    });
  } catch (error) {
    console.error("💥 Delete dokumen error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Download dokumen
export const downloadDokumen = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📥 Downloading dokumen:", id);

    const dokumen = await DokumenPembelian.findById(id);

    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    if (!dokumen.file_path || !fs.existsSync(dokumen.file_path)) {
      return res.status(404).json({ error: "File dokumen tidak ditemukan." });
    }

    // Set headers untuk download
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${dokumen.original_name}"`
    );
    res.setHeader("Content-Length", dokumen.file_size);

    // Stream file ke client
    const fileStream = fs.createReadStream(dokumen.file_path);
    fileStream.pipe(res);
  } catch (error) {
    console.error("💥 Download dokumen error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get dokumen statistics
export const getDokumenStats = async (req, res) => {
  try {
    console.log("📊 Getting dokumen statistics");

    const stats = await DokumenPembelian.getStats();

    res.json({
      message: "Statistik dokumen berhasil diambil.",
      data: stats,
    });
  } catch (error) {
    console.error("💥 Get dokumen stats error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export default {
  uploadDokumenPembelian,
  getDokumenByBarangPermintaan,
  getDokumenDetail,
  deleteDokumen,
  downloadDokumen,
  getDokumenStats,
};
