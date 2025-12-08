import dbPool from "../config/database.js";

const Pemesanan = {
  // Check if table exists
  checkTableExists: async () => {
    try {
      const query = "SHOW TABLES LIKE 'pemesanan'";
      const [rows] = await dbPool.execute(query);
      return rows.length > 0;
    } catch (error) {
      console.error("❌ Error checking table existence:", error);
      return false;
    }
  },

  // Create table if not exists (for development)
  createTableIfNotExists: async () => {
    try {
      const tableExists = await Pemesanan.checkTableExists();
      if (!tableExists) {
        console.log("📦 Creating pemesanan table...");

        const createTableQuery = `
          CREATE TABLE pemesanan (
            id INT PRIMARY KEY AUTO_INCREMENT,
            barang_permintaan_id INT NOT NULL,
            admin_id INT NOT NULL,
            tanggal_pemesanan DATE NOT NULL,
            estimasi_selesai DATE,
            catatan TEXT,
            status ENUM('diproses', 'selesai', 'ditolak') DEFAULT 'diproses',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (barang_permintaan_id) REFERENCES barang_permintaan(id) ON DELETE CASCADE,
            FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `;

        await dbPool.execute(createTableQuery);
        console.log("✅ Pemesanan table created successfully");
        return true;
      }
      return true;
    } catch (error) {
      console.error("❌ Error creating pemesanan table:", error);
      return false;
    }
  },

  // Create new pemesanan record
  create: async (pemesananData) => {
    try {
      // Pastikan tabel ada
      await Pemesanan.createTableIfNotExists();

      const {
        barang_permintaan_id,
        admin_id,
        tanggal_pemesanan,
        estimasi_selesai,
        catatan,
      } = pemesananData;

      const query = `
        INSERT INTO pemesanan 
        (barang_permintaan_id, admin_id, tanggal_pemesanan, estimasi_selesai, catatan, status) 
        VALUES (?, ?, ?, ?, ?, 'diproses')
      `;

      const [result] = await dbPool.execute(query, [
        barang_permintaan_id,
        admin_id,
        tanggal_pemesanan,
        estimasi_selesai || null,
        catatan || "",
      ]);

      console.log("✅ Pemesanan created with ID:", result.insertId);
      return result.insertId;
    } catch (error) {
      console.error("💥 Create pemesanan error in model:", error);
      throw error;
    }
  },

  // Find by barang_permintaan_id
  findByBarangPermintaanId: async (barang_permintaan_id) => {
    try {
      await Pemesanan.createTableIfNotExists();

      const query = `
        SELECT p.*, u.nama_lengkap as admin_nama
        FROM pemesanan p
        LEFT JOIN users u ON p.admin_id = u.id
        WHERE p.barang_permintaan_id = ?
      `;
      const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
      return rows[0];
    } catch (error) {
      console.error("💥 Find by barang_permintaan_id error:", error);
      throw error;
    }
  },

  // Find by ID
  findById: async (id) => {
    try {
      await Pemesanan.createTableIfNotExists();

      const query = `
        SELECT p.*, u.nama_lengkap as admin_nama
        FROM pemesanan p
        LEFT JOIN users u ON p.admin_id = u.id
        WHERE p.id = ?
      `;
      const [rows] = await dbPool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("💥 Find by ID error:", error);
      throw error;
    }
  },

  // Find all for admin with filters
  findAllForAdmin: async (page = 1, limit = 10, filters = {}) => {
    try {
      await Pemesanan.createTableIfNotExists();

      const offset = (page - 1) * limit;
      let query = `
        SELECT 
          pem.*,
          bp.nama_barang,
          bp.jumlah,
          bp.spesifikasi,
          perm.nomor_permintaan,
          user_pemohon.nama_lengkap as pemohon_nama,
          divisi.nama_divisi
        FROM pemesanan pem
        JOIN barang_permintaan bp ON pem.barang_permintaan_id = bp.id
        JOIN permintaan perm ON bp.permintaan_id = perm.id
        JOIN users user_pemohon ON perm.user_id = user_pemohon.id
        JOIN divisi ON user_pemohon.divisi_id = divisi.id
        WHERE 1=1
      `;

      let countQuery = `
        SELECT COUNT(*) as total
        FROM pemesanan pem
        JOIN barang_permintaan bp ON pem.barang_permintaan_id = bp.id
        WHERE 1=1
      `;

      const values = [];
      const countValues = [];

      // Filter by status
      if (filters.status && filters.status !== "semua") {
        query += " AND pem.status = ?";
        countQuery += " AND pem.status = ?";
        values.push(filters.status);
        countValues.push(filters.status);
      }

      // Filter by date range
      if (filters.start_date && filters.end_date) {
        query += " AND DATE(pem.tanggal_pemesanan) BETWEEN ? AND ?";
        countQuery += " AND DATE(pem.tanggal_pemesanan) BETWEEN ? AND ?";
        values.push(filters.start_date, filters.end_date);
        countValues.push(filters.start_date, filters.end_date);
      }

      // Filter by search
      if (filters.search) {
        query += " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ?)";
        countQuery +=
          " AND (bp.nama_barang LIKE ? OR perm.nomor_permintaan LIKE ?)";
        const searchTerm = `%${filters.search}%`;
        values.push(searchTerm, searchTerm);
        countValues.push(searchTerm, searchTerm);
      }

      query += " ORDER BY pem.tanggal_pemesanan DESC";
      query += " LIMIT ? OFFSET ?";
      values.push(limit, offset);

      console.log("🔍 Executing admin pemesanan query...");
      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);

      console.log(`✅ Found ${total} pemesanan records`);

      return {
        data: rows,
        total: total,
        page: page,
        limit: limit,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Find all for admin error:", error);
      // Return empty result instead of throwing error
      return {
        data: [],
        total: 0,
        page: page,
        limit: limit,
        totalPages: 0,
      };
    }
  },

  // Update status pemesanan
  updateStatus: async (id, status) => {
    try {
      await Pemesanan.createTableIfNotExists();

      const query =
        "UPDATE pemesanan SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
      const [result] = await dbPool.execute(query, [status, id]);
      return result.affectedRows;
    } catch (error) {
      console.error("💥 Update status error:", error);
      throw error;
    }
  },
};

export default Pemesanan;
