import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "os";
import dbPool from "./src/config/database.js";

//import routes
import authRoutes from "./src/routes/auth.js";
import pemohonRoutes from "./src/routes/pemohon.js";
import adminRoutes from "./src/routes/admin.js";
import validatorRoutes from "./src/routes/validator.js";
import kategoriRoutes from "./src/routes/kategori.js";
import satuanRoutes from "./src/routes/satuan.js";
import stokRoutes from "./src/routes/stok.js";
import { previewFile, downloadFile } from "./src/controller/fileController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Buat folder uploads jika belum ada
const createUploadsFolders = () => {
  const uploadsDir = path.join(__dirname, "uploads");
  const subDirs = ["dokumen_pembelian", "bukti_penerimaan"];

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("✅ Created uploads directory");
  }

  subDirs.forEach((subDir) => {
    const subDirPath = path.join(uploadsDir, subDir);
    if (!fs.existsSync(subDirPath)) {
      fs.mkdirSync(subDirPath, { recursive: true });
      console.log(`✅ Created ${subDir} directory`);
    }
  });
};
createUploadsFolders();

//middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Izinkan request tanpa origin (seperti Postman, curl)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://pengadaan-barang-it-center.vercel.app",
      ];
      
      // Izinkan semua IP di subnet 172.16.10.x
      if (origin.startsWith("http://192.168.1.")) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      // Set proper MIME types
      const ext = path.extname(filePath);
      if (ext === ".pdf") {
        res.setHeader("Content-Type", "application/pdf");
      } else if (ext === ".jpg" || ext === ".jpeg") {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (ext === ".png") {
        res.setHeader("Content-Type", "image/png");
      }
      // Untuk development, allow all origins
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// Log semua requests untuk debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const testDB = async () => {
  try {
    // Coba dengan query yang berbeda
    const [rows] = await dbPool.execute("SELECT 1 as test_value");
    console.log("Rows:", rows);
    console.log("✅ Database connected. Test value:", rows[0].test_value);
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};
testDB();

//routes
app.use("/api/auth", authRoutes);
app.use("/api/pemohon", pemohonRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/validator", validatorRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/satuan", satuanRoutes);
app.use("/api/stok", stokRoutes);

// Test endpoint untuk cek file
app.get("/api/test-file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(
    __dirname,
    "uploads",
    "dokumen_pembelian",
    filename
  );

  console.log("📁 Test file path:", filePath);
  console.log("📁 File exists:", fs.existsSync(filePath));

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      error: "File not found",
      path: filePath,
      cwd: process.cwd(),
      __dirname: __dirname,
    });
  }
});

// Routes untuk file preview dan download
app.get("/api/files/:type/:filename", previewFile);
app.get("/api/files/:type/:filename/download", downloadFile);

// Fallback route untuk testing
app.get("/preview/:type/:filename", (req, res) => {
  res.redirect(`/api/files/${req.params.type}/${req.params.filename}`);
});

// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

app.get("/", (req, res) => {
  res.send("Server working, go to /route_name");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server berjalan di:");
  console.log(`   • Local: http://localhost:${PORT}`);
  console.log(`   • Network: http://${getLocalIP()}:${PORT}`);
});

// Tambahkan fungsi untuk mendapatkan IP lokal
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
