import multer from "multer";
import path from "path";
import fs from "fs";

// Storage untuk bukti penerimaan barang
const storagePenerimaan = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/penerimaan/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "bukti-penerimaan-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const uploadBuktiPenerimaan = multer({
  storage: storagePenerimaan,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file gambar yang diizinkan"), false);
    }
  },
});

// Buat folder uploads jika belum ada
const createUploadsFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Storage untuk dokumen pembelian (PO, Nota, dll)
const storageDokumen = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/dokumen/";
    createUploadsFolder(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, "dokumen-" + uniqueSuffix + "-" + sanitizedName);
  },
});

// File filter untuk dokumen (PDF, DOC, DOCX, Images)
const dokumenFileFilter = function (req, file, cb) {
  // Izinkan PDF, DOC, DOCX, dan images
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Hanya file PDF, DOC, DOCX, dan gambar yang diizinkan"),
      false
    );
  }
};

// File filter untuk images only
const imageFileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan"), false);
  }
};

// Middleware untuk upload dokumen pembelian (PDF, DOC, Images)
export const uploadDokumenPembelian = multer({
  storage: storageDokumen,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: dokumenFileFilter,
});

// Error handler middleware untuk multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error:
          "File terlalu besar. Maksimal 10MB untuk dokumen, 5MB untuk gambar.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        error: "Field file tidak sesuai.",
      });
    }
  }

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  next();
};
