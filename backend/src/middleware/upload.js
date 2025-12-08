// file: src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk membuat folder jika tidak ada
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Folder created: ${dirPath}`);
  }
};

// Konfigurasi storage untuk dokumen pembelian
const dokumenStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Path relatif ke root project
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "dokumen_pembelian"
    );
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Hilangkan spasi dan karakter khusus dari nama file
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(originalName);
    const filename = path.basename(originalName, ext);

    // Buat nama file yang aman
    const safeFilename = `dokumen_${uniqueSuffix}${ext.toLowerCase()}`;
    cb(null, safeFilename);
  },
});

// Filter file untuk dokumen
const dokumenFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file PDF, JPEG, JPG, dan PNG yang diperbolehkan"));
  }
};

export const uploadDokumenPembelian = multer({
  storage: dokumenStorage,
  fileFilter: dokumenFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// Konfigurasi storage untuk bukti penerimaan
const buktiStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      "bukti_penerimaan"
    );
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(originalName);
    const safeFilename = `bukti_${uniqueSuffix}${ext.toLowerCase()}`;
    cb(null, safeFilename);
  },
});

export const uploadBuktiPenerimaan = multer({
  storage: buktiStorage,
  fileFilter: dokumenFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Middleware untuk handle upload error
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File terlalu besar. Maksimal 10MB." });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};
