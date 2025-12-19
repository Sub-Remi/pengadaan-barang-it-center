import User from "../models/user.js";
import { generateToken } from "../config/auth.js";
import bcrypt from "bcryptjs";
import dbPool from "../config/database.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🔐 Login attempt:", { username, password: "***" });

    // Validasi input
    if (!username || !password) {
      console.log("❌ Missing username or password");
      return res.status(400).json({
        error: "Username dan password harus diisi.",
      });
    }

    const query = `
      SELECT u.*, d.nama_divisi 
      FROM users u 
      LEFT JOIN divisi d ON u.divisi_id = d.id 
      WHERE u.username = ? AND u.is_active = true
    `;
    const [users] = await dbPool.execute(query, [username]);
    const user = users[0];

    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(401).json({
        error: "Username atau password salah.",
      });
    }

    console.log("🔑 Password verification...");
    console.log("   Input password:", password);
    console.log("   Stored password:", user.password);
    console.log("   Password length:", user.password.length);
    console.log("   User active status:", user.is_active);

    // === PERUBAHAN PENTING: Gunakan plain text comparison ===
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // const isPasswordValid = await User.verifyPassword(password, user.password); // COMMENT BARIS INI

    console.log("✅ Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", username);
      return res.status(401).json({
        error: "Username atau password salah.",
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      divisi_id: user.divisi_id,
      nama_lengkap: user.nama_lengkap,
      nama_divisi: user.nama_divisi
    });

    // Response data user (tanpa password)
    const userData = {
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      role: user.role,
      divisi_id: user.divisi_id,
      nama_divisi: user.nama_divisi,
    };

    console.log("🎉 Login successful for:", username);

    res.json({
      message: "Login berhasil",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("💥 Login error:", error);
    res.status(500).json({
      error: "Terjadi kesalahan server. Silahkan coba lagi.",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    // Query dengan JOIN ke divisi
    const query = `
      SELECT 
        u.id, u.username, u.nama_lengkap, u.email, 
        u.role, u.divisi_id, u.is_active, u.created_at,
        d.nama_divisi
      FROM users u 
      LEFT JOIN divisi d ON u.divisi_id = d.id 
      WHERE u.id = ?
    `;
    
    const [users] = await dbPool.execute(query, [req.user.id]);
    const user = users[0];
    
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // Format response
    const userData = {
      id: user.id,
      username: user.username,
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      role: user.role,
      divisi_id: user.divisi_id,
      nama_divisi: user.nama_divisi,
      is_active: user.is_active,
      created_at: user.created_at,
    };
    
    res.json({
      message: "User data berhasil diambil.",
      data: userData,
    });
  } catch (error) {
    console.error("💥 Get current user error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};