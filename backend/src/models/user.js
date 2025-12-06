import dbPool from "../config/database.js";
import bcrypt from "bcryptjs";

const User = {
  // Find user by username for login
  findByUsername: async (username) => {
    const query = `
      SELECT u.*, d.nama_divisi 
      FROM users u 
      LEFT JOIN divisi d ON u.divisi_id = d.id 
      WHERE u.username = ? AND u.is_active = true
    `;
    const [rows] = await dbPool.execute(query, [username]);
    return rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const query = `
      SELECT u.*, d.nama_divisi 
      FROM users u 
      LEFT JOIN divisi d ON u.divisi_id = d.id 
      WHERE u.id = ? AND u.is_active = true
    `;
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Verify password
  verifyPassword: async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Hash password
  hashPassword: async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },

  // Update last login
  updateLastLogin: async (userId) => {
    const query = "UPDATE users SET last_login = NOW() WHERE id = ?";
    await dbPool.execute(query, [userId]);
  },

  // Get users by role (for admin)
  findByRole: async (role) => {
    const query = `
      SELECT u.id, u.username, u.nama_lengkap, u.email, u.role, 
             d.nama_divisi, u.is_active, u.created_at
      FROM users u 
      LEFT JOIN divisi d ON u.divisi_id = d.id 
      WHERE u.role = ? AND u.is_active = true
      ORDER BY u.nama_lengkap
    `;
    const [rows] = await dbPool.execute(query, [role]);
    return rows;
  },

  findAllWithPagination: async (page = 1, limit = 10, filters = {}) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    let query = `
    SELECT 
      u.id, u.username, u.nama_lengkap, u.email, u.role, 
      u.divisi_id, u.is_active, u.created_at, u.last_login,
      d.nama_divisi
    FROM users u 
    LEFT JOIN divisi d ON u.divisi_id = d.id 
    WHERE 1=1
  `;

    let countQuery = `
    SELECT COUNT(*) as total 
    FROM users u 
    WHERE 1=1
  `;

    const values = [];
    const countValues = [];

    // Filter by role - hanya jika ada nilai
    if (filters.role) {
      query += " AND u.role = ?";
      countQuery += " AND u.role = ?";
      values.push(filters.role);
      countValues.push(filters.role);
    }

    // Filter by divisi - hanya jika ada nilai
    if (filters.divisi_id) {
      query += " AND u.divisi_id = ?";
      countQuery += " AND u.divisi_id = ?";
      values.push(filters.divisi_id);
      countValues.push(filters.divisi_id);
    }

    // DIPERBAIKI: Filter by status aktif - hanya jika ada nilai spesifik
    if (filters.is_active !== undefined) {
      query += " AND u.is_active = ?";
      countQuery += " AND u.is_active = ?";
      const isActiveValue = filters.is_active === "true" ? 1 : 0;
      values.push(isActiveValue);
      countValues.push(isActiveValue);
    }

    // Search by username, nama_lengkap, atau email
    if (filters.search) {
      query +=
        " AND (u.username LIKE ? OR u.nama_lengkap LIKE ? OR u.email LIKE ?)";
      countQuery +=
        " AND (u.username LIKE ? OR u.nama_lengkap LIKE ? OR u.email LIKE ?)";
      const searchTerm = `%${filters.search}%`;
      values.push(searchTerm, searchTerm, searchTerm);
      countValues.push(searchTerm, searchTerm, searchTerm);
    }

    // DIPERBAIKI: Default filter untuk menampilkan user aktif saja
    // Jika tidak ada filter is_active, tampilkan semua user
    if (filters.is_active === undefined) {
      query += " AND u.is_active = 1";
      countQuery += " AND u.is_active = 1";
    }

    query += " ORDER BY u.nama_lengkap ASC";
    query += ` LIMIT ${limitNum} OFFSET ${offsetNum}`;

    console.log("🔍 SQL Query:", query);
    console.log("🔍 Values:", values);

    try {
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      console.log("📊 Found", rows.length, "users, total:", total);

      return {
        data: rows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 User find all error:", error);
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    const { username, password, role, divisi_id, email, nama_lengkap } =
      userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users 
      (username, password, role, divisi_id, email, nama_lengkap) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await dbPool.execute(query, [
      username,
      hashedPassword,
      role,
      divisi_id,
      email,
      nama_lengkap,
    ]);
    return result.insertId;
  },

  // Update user
  update: async (id, userData) => {
    const { username, role, divisi_id, email, nama_lengkap, is_active } =
      userData;

    let query = `
      UPDATE users 
      SET username = ?, role = ?, divisi_id = ?, email = ?, nama_lengkap = ?, is_active = ?
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      username,
      role,
      divisi_id,
      email,
      nama_lengkap,
      is_active,
      id,
    ]);
    return result.affectedRows;
  },

  // Update user password
  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = "UPDATE users SET password = ? WHERE id = ?";
    const [result] = await dbPool.execute(query, [hashedPassword, id]);
    return result.affectedRows;
  },

  // Delete user (soft delete - set is_active = false)
  softDelete: async (id) => {
    const query = "UPDATE users SET is_active = false WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  },

  // Hard delete user (permanent)
  hardDelete: async (id) => {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  },

  // Check if username already exists (for create/update validation)
  findByUsernameExcludeId: async (username, excludeId = null) => {
    let query = "SELECT * FROM users WHERE username = ?";
    const values = [username];

    if (excludeId) {
      query += " AND id != ?";
      values.push(excludeId);
    }

    const [rows] = await dbPool.execute(query, values);
    return rows[0];
  },

  // Get user statistics
  getStats: async () => {
    const query = `
      SELECT 
        role,
        COUNT(*) as total,
        SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive
      FROM users 
      GROUP BY role
      ORDER BY role
    `;
    const [rows] = await dbPool.execute(query);
    return rows;
  },

  // Get users by divisi for statistics
  getUsersByDivisi: async () => {
    const query = `
      SELECT 
        d.nama_divisi,
        COUNT(u.id) as total_users,
        SUM(CASE WHEN u.is_active = true THEN 1 ELSE 0 END) as active_users
      FROM divisi d
      LEFT JOIN users u ON d.id = u.divisi_id
      GROUP BY d.id, d.nama_divisi
      ORDER BY d.nama_divisi
    `;
    const [rows] = await dbPool.execute(query);
    return rows;
  },
};

export default User;
