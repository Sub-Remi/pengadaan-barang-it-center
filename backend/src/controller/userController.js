import User from "../models/user.js";

// Get all users dengan pagination dan filter untuk admin
// Get all users dengan pagination dan filter untuk admin
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filters - DIPERBAIKI: Hanya tambahkan filter jika ada nilai
    const filters = {};

    // Hanya tambahkan filter jika nilainya valid
    if (req.query.role && req.query.role !== "semua") {
      filters.role = req.query.role;
    }

    if (req.query.divisi_id && req.query.divisi_id !== "semua") {
      filters.divisi_id = req.query.divisi_id;
    }

    // DIPERBAIKI: Filter is_active hanya jika ada nilai "true" atau "false"
    if (req.query.is_active === "true" || req.query.is_active === "false") {
      filters.is_active = req.query.is_active;
    }

    if (req.query.search && req.query.search.trim() !== "") {
      filters.search = req.query.search.trim();
    }

    console.log("👥 Admin getting all users with filters:", filters);

    const result = await User.findAllWithPagination(page, limit, filters);

    res.json({
      message: "Daftar user berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get all users error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get user detail
export const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Getting user detail:", id);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // Jangan kirim password
    const { password, ...userData } = user;

    res.json({
      message: "Detail user berhasil diambil.",
      data: userData,
    });
  } catch (error) {
    console.error("💥 Get user detail error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, password, role, divisi_id, email, nama_lengkap } =
      req.body;

    console.log("🆕 Creating new user:", { username, role, nama_lengkap });

    // Validasi input
    if (!username || !password || !role || !nama_lengkap) {
      return res.status(400).json({
        error: "Username, password, role, dan nama lengkap harus diisi.",
      });
    }

    // Validasi role
    const validRoles = ["pemohon", "admin", "validator"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Role tidak valid." });
    }

    // Cek apakah username sudah ada
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username sudah digunakan." });
    }

    // Validasi email jika diisi
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format email tidak valid." });
      }
    }

    const userId = await User.create({
      username: username.trim(),
      password: password,
      role,
      divisi_id: divisi_id || null,
      email: email ? email.trim() : null,
      nama_lengkap: nama_lengkap.trim(),
    });

    console.log("✅ User created with ID:", userId);

    res.status(201).json({
      message: "User berhasil dibuat.",
      data: { id: userId },
    });
  } catch (error) {
    console.error("💥 Create user error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, divisi_id, email, nama_lengkap, is_active } =
      req.body;

    console.log("✏️ Updating user:", { id, username, role });

    // Validasi input
    if (!username || !role || !nama_lengkap) {
      return res.status(400).json({
        error: "Username, role, dan nama lengkap harus diisi.",
      });
    }

    // Validasi role
    const validRoles = ["pemohon", "admin", "validator"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Role tidak valid." });
    }

    // Cek apakah user ada
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // Cek apakah username sudah digunakan (oleh user lain)
    const userWithSameUsername = await User.findByUsernameExcludeId(
      username,
      id
    );
    if (userWithSameUsername) {
      return res.status(400).json({ error: "Username sudah digunakan." });
    }

    // Validasi email jika diisi
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Format email tidak valid." });
      }
    }

    const affectedRows = await User.update(id, {
      username: username.trim(),
      role,
      divisi_id: divisi_id || null,
      email: email ? email.trim() : null,
      nama_lengkap: nama_lengkap.trim(),
      is_active: is_active !== undefined ? is_active : existingUser.is_active,
    });

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal mengupdate user." });
    }

    res.json({
      message: "User berhasil diupdate.",
    });
  } catch (error) {
    console.error("💥 Update user error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Update user password
export const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_password } = req.body;

    console.log("🔑 Updating user password:", id);

    // Validasi input
    if (!new_password) {
      return res.status(400).json({ error: "Password baru harus diisi." });
    }

    if (new_password.length < 3) {
      return res.status(400).json({ error: "Password minimal 3 karakter." });
    }

    // Cek apakah user ada
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    const affectedRows = await User.updatePassword(id, new_password);

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal mengupdate password." });
    }

    res.json({
      message: "Password user berhasil diupdate.",
    });
  } catch (error) {
    console.error("💥 Update user password error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Reset user password to default
export const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔄 Resetting user password:", id);

    // Cek apakah user ada
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // Reset ke password default
    const defaultPassword = "password123";
    const affectedRows = await User.updatePassword(id, defaultPassword);

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal reset password." });
    }

    res.json({
      message: "Password user berhasil direset ke default.",
      data: { default_password: defaultPassword },
    });
  } catch (error) {
    console.error("💥 Reset user password error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Delete user (soft delete)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting user:", id);

    // Cek apakah user ada
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // Cek apakah user mencoba menghapus diri sendiri
    if (parseInt(id) === req.user.id) {
      return res
        .status(400)
        .json({ error: "Tidak dapat menghapus akun sendiri." });
    }

    const affectedRows = await User.softDelete(id);

    if (affectedRows === 0) {
      return res.status(400).json({ error: "Gagal menghapus user." });
    }

    res.json({
      message: "User berhasil dihapus (non-aktif).",
    });
  } catch (error) {
    console.error("💥 Delete user error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    console.log("📊 Getting user statistics");

    const stats = await User.getStats();
    const usersByDivisi = await User.getUsersByDivisi();

    res.json({
      message: "Statistik user berhasil diambil.",
      data: {
        by_role: stats,
        by_divisi: usersByDivisi,
      },
    });
  } catch (error) {
    console.error("💥 Get user stats error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

export default {
  getAllUsers,
  getUserDetail,
  createUser,
  updateUser,
  updateUserPassword,
  resetUserPassword,
  deleteUser,
  getUserStats,
};
