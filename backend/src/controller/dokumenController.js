// file: src/controller/dokumenController.js
import DokumenPembelian from "../models/dokumen_pembelian.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dbPool from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log("🗑️ Deleting dokumen:", id);

    // Cek apakah dokumen ada
    const dokumen = await DokumenPembelian.findById(id);
    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    // Hanya admin atau yang mengupload yang bisa hapus
    if (dokumen.uploaded_by !== user_id && req.user.role !== "admin") {
      return res.status(403).json({
        error: "Anda tidak memiliki izin untuk menghapus dokumen ini.",
      });
    }

    // Hapus file fisik
    if (dokumen.file_path) {
      const filePath = path.join(__dirname, "..", "..", dokumen.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🗑️ File deleted from filesystem:", filePath);
      }
    }

    // Hapus dari database
    const query = "DELETE FROM dokumen_pembelian WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Gagal menghapus dokumen." });
    }

    res.json({
      message: "Dokumen berhasil dihapus.",
      deleted_id: id,
    });
  } catch (error) {
    console.error("💥 Delete dokumen error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Update/replace dokumen (delete old and create new)
export const replaceDokumen = async (req, res) => {
  try {
    const { id } = req.params;
    const { barang_permintaan_id, jenis_dokumen } = req.body;
    const uploaded_by = req.user.id;

    console.log("🔄 Replacing dokumen:", {
      id,
      barang_permintaan_id,
      jenis_dokumen,
    });

    // Validasi input
    if (!barang_permintaan_id || !jenis_dokumen) {
      return res.status(400).json({
        error: "barang_permintaan_id dan jenis_dokumen harus diisi.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File dokumen harus diupload." });
    }

    // Cek apakah ada dokumen lama
    const oldDokumen =
      id !== "new" ? await DokumenPembelian.findById(id) : null;

    // Jika ada dokumen lama, hapus
    if (oldDokumen) {
      // Hapus file lama
      if (oldDokumen.file_path) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          oldDokumen.file_path
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("🗑️ Old file deleted:", oldFilePath);
        }
      }

      // Hapus record lama
      const deleteQuery = "DELETE FROM dokumen_pembelian WHERE id = ?";
      await dbPool.execute(deleteQuery, [id]);
    }

    // Buat dokumen baru
    const relativePath = `/uploads/dokumen_pembelian/${req.file.filename}`;

    const insertQuery = `
      INSERT INTO dokumen_pembelian 
      (barang_permintaan_id, jenis_dokumen, nama_file, file_path, original_name, file_size, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.execute(insertQuery, [
      barang_permintaan_id,
      jenis_dokumen,
      req.file.filename,
      relativePath,
      req.file.originalname,
      req.file.size,
      uploaded_by,
    ]);

    const newDokumenId = result.insertId;

    console.log("✅ Dokumen replaced with new ID:", newDokumenId);

    res.status(201).json({
      message: oldDokumen
        ? "Dokumen berhasil diganti."
        : "Dokumen berhasil diupload.",
      data: {
        id: newDokumenId,
        nama_file: req.file.filename,
        original_name: req.file.originalname,
        jenis_dokumen: jenis_dokumen,
        file_path: relativePath,
        file_size: req.file.size,
      },
    });
  } catch (error) {
    // Hapus file baru jika ada error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("💥 Replace dokumen error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Cek apakah dokumen sudah ada untuk jenis tertentu
export const checkExistingDokumen = async (req, res) => {
  try {
    const { barang_permintaan_id, jenis_dokumen } = req.query;

    console.log("🔍 Checking existing dokumen:", {
      barang_permintaan_id,
      jenis_dokumen,
    });

    const query = `
      SELECT * FROM dokumen_pembelian 
      WHERE barang_permintaan_id = ? AND jenis_dokumen = ?
    `;

    const [rows] = await dbPool.execute(query, [
      barang_permintaan_id,
      jenis_dokumen,
    ]);

    res.json({
      exists: rows.length > 0,
      dokumen: rows[0] || null,
    });
  } catch (error) {
    console.error("💥 Check existing dokumen error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Upload dokumen pembelian
export const uploadDokumenPembelian = async (req, res) => {
  try {
    const { barang_permintaan_id, jenis_dokumen } = req.body;
    const uploaded_by = req.user.id;

    console.log("📤 Uploading dokumen pembelian:", {
      barang_permintaan_id,
      jenis_dokumen,
      uploaded_by,
      file: req.file,
    });

    // Validasi input
    if (!barang_permintaan_id || !jenis_dokumen) {
      // Hapus file jika ada error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        error: "barang_permintaan_id dan jenis_dokumen harus diisi.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File dokumen harus diupload." });
    }

    // Validasi jenis dokumen
    const validJenis = ["nota", "po", "form_penerimaan"];
    if (!validJenis.includes(jenis_dokumen)) {
      // Hapus file jika jenis tidak valid
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: "Jenis dokumen tidak valid." });
    }

    // Simpan file path relatif untuk frontend
    const relativePath = `/uploads/dokumen_pembelian/${req.file.filename}`;

    // Buat record dokumen
    const dokumenId = await DokumenPembelian.create({
      barang_permintaan_id,
      jenis_dokumen,
      nama_file: req.file.filename,
      file_path: relativePath, // Simpan path relatif
      original_name: req.file.originalname,
      file_size: req.file.size,
      uploaded_by,
    });

    console.log("✅ Dokumen uploaded with ID:", dokumenId);

    res.status(201).json({
      message: "Dokumen berhasil diupload.",
      data: {
        id: dokumenId,
        nama_file: req.file.filename,
        original_name: req.file.originalname,
        jenis_dokumen: jenis_dokumen,
        file_path: relativePath,
        file_size: req.file.size,
      },
    });
  } catch (error) {
    // Hapus file jika ada error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("💥 Upload dokumen pembelian error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get dokumen by barang_permintaan_id
export const getDokumenByBarangPermintaan = async (req, res) => {
  try {
    const { barang_permintaan_id } = req.params;

    console.log(
      "🔍 Getting dokumen for barang_permintaan_id:",
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
    console.error("💥 Get dokumen by barang_permintaan error:", error);
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

// Download dokumen
export const downloadDokumen = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📥 Downloading dokumen:", id);

    const dokumen = await DokumenPembelian.findById(id);
    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan." });
    }

    // Convert relative path to absolute path
    const absolutePath = path.join(__dirname, "..", "..", dokumen.file_path);

    console.log("📁 Looking for file at:", absolutePath);

    // Cek apakah file exists
    if (!fs.existsSync(absolutePath)) {
      console.error("❌ File not found:", absolutePath);
      return res.status(404).json({ error: "File tidak ditemukan." });
    }

    // Set headers untuk download
    res.download(
      absolutePath,
      dokumen.original_name || path.basename(absolutePath)
    );
  } catch (error) {
    console.error("💥 Download dokumen error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get dokumen statistics
export const getDokumenStats = async (req, res) => {
  try {
    console.log("📊 Getting dokumen statistics");

    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) as validated,
        SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN is_valid IS NULL THEN 1 ELSE 0 END) as pending
      FROM dokumen_pembelian
    `;

    const [rows] = await dbPool.execute(query);
    const stats = rows[0];

    res.json({
      message: "Statistik dokumen berhasil diambil.",
      data: stats,
    });
  } catch (error) {
    console.error("💥 Get dokumen stats error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};
