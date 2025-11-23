import User from "../models/user.js";
import { generateToken } from "../config/auth.js";

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

    // Cari user
    const user = await User.findByUsername(username);
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
    console.log("   User active status:", user.is_active);

    // === PERUBAHAN PENTING: Gunakan plain text comparison ===
    const isPasswordValid = password === user.password;
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
      divisi_id: user.divisi_id,
      nama_lengkap: user.nama_lengkap,
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
      error: "Terjadi kesalahan server. Silakan coba lagi.",
    });
  }
};
