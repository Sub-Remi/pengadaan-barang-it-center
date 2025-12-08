// file: src/controller/fileController.js
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const previewFile = async (req, res) => {
  try {
    const { type, filename } = req.params;

    console.log("🔍 Preview file request:", { type, filename });

    // Validasi tipe file
    const allowedTypes = ["dokumen_pembelian", "bukti_penerimaan"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Tipe file tidak diizinkan" });
    }

    // Path ke file
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      type,
      filename
    );

    console.log("📁 Looking for file at:", filePath);

    // Cek apakah file exists
    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found:", filePath);
      return res.status(404).json({
        error: "File tidak ditemukan",
        details: `Path: ${filePath}`,
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const ext = path.extname(filename).toLowerCase();

    // Set Content-Type berdasarkan ekstensi
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".txt":
        contentType = "text/plain";
        break;
    }

    // Set headers untuk preview
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", fileSize);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache 1 jam

    // Stream file ke response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("💥 Preview file error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan saat memuat file",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { type, filename } = req.params;

    console.log("📥 Download file request:", { type, filename });

    const allowedTypes = ["dokumen_pembelian", "bukti_penerimaan"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Tipe file tidak diizinkan" });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      type,
      filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File tidak ditemukan" });
    }

    // Set headers untuk download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("💥 Download error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Gagal mendownload file" });
        }
      }
    });
  } catch (error) {
    console.error("💥 Download file error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
