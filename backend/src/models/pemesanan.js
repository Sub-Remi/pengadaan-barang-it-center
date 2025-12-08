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

      // Konversi ke integer untuk memastikan tipe data benar
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      console.log("📊 Pagination params:", {
        pageNum,
        limitNum,
        offset,
        filters,
      });

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
      JOIN permintaan perm ON bp.permintaan_id = perm.id
      JOIN users user_pemohon ON perm.user_id = user_pemohon.id
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

      // PERBAIKAN PENTING: Gunakan template literal untuk LIMIT dan OFFSET
      // Jangan gunakan placeholder untuk LIMIT/OFFSET
      query += ` LIMIT ${limitNum} OFFSET ${offset}`;

      console.log("🔍 Executing admin pemesanan query...");
      console.log("📝 Query:", query);
      console.log("📊 Values:", values);
      console.log("📝 Count Query:", countQuery);
      console.log("📊 Count Values:", countValues);

      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0]?.total || 0;
      const totalPages = Math.ceil(total / limitNum);

      console.log(`✅ Found ${total} pemesanan records`);

      return {
        data: rows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Find all for admin error:", error);
      console.error("💥 Error details:", {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage,
        sql: error.sql,
      });
      // Return empty result instead of throwing error
      return {
        data: [],
        total: 0,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        totalPages: 0,
      };
    }
  },

  // Di file pemesanan.js, tambahkan fungsi ini setelah findAllForAdmin
  findAllForValidator: async (page = 1, limit = 10, filters = {}) => {
    try {
      await Pemesanan.createTableIfNotExists();

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const offset = (pageNum - 1) * limitNum;

      console.log("📋 Validator getting pemesanan with filters:", filters);

      let query = `
      SELECT 
        pem.*,
        bp.nama_barang,
        bp.jumlah,
        bp.spesifikasi,
        perm.nomor_permintaan,
        user_pemohon.nama_lengkap as pemohon_nama,
        divisi.nama_divisi,
        dp.jenis_dokumen,
        dp.is_valid,
        dp.created_at as dokumen_created_at
      FROM pemesanan pem
      JOIN barang_permintaan bp ON pem.barang_permintaan_id = bp.id
      JOIN permintaan perm ON bp.permintaan_id = perm.id
      JOIN users user_pemohon ON perm.user_id = user_pemohon.id
      JOIN divisi ON user_pemohon.divisi_id = divisi.id
      LEFT JOIN dokumen_pembelian dp ON pem.barang_permintaan_id = dp.barang_permintaan_id
      WHERE bp.status = 'dalam pemesanan'
      AND (dp.is_valid IS NULL OR dp.is_valid = 0)  -- Dokumen belum divalidasi atau ditolak
    `;

      let countQuery = `
      SELECT COUNT(DISTINCT pem.id) as total
      FROM pemesanan pem
      JOIN barang_permintaan bp ON pem.barang_permintaan_id = bp.id
      LEFT JOIN dokumen_pembelian dp ON pem.barang_permintaan_id = dp.barang_permintaan_id
      WHERE bp.status = 'dalam pemesanan'
      AND (dp.is_valid IS NULL OR dp.is_valid = 0)
    `;

      const values = [];
      const countValues = [];

      // Filter by jenis dokumen
      if (filters.jenis_dokumen && filters.jenis_dokumen !== "semua") {
        query += " AND dp.jenis_dokumen = ?";
        countQuery += " AND dp.jenis_dokumen = ?";
        values.push(filters.jenis_dokumen);
        countValues.push(filters.jenis_dokumen);
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
      query += ` LIMIT ${limitNum} OFFSET ${offset}`;

      console.log("🔍 Executing validator pemesanan query:", query);
      console.log("📊 Query values:", values);

      const [rows] = await dbPool.execute(query, values);
      const [countRows] = await dbPool.execute(countQuery, countValues);

      const total = countRows[0]?.total || 0;
      const totalPages = Math.ceil(total / limitNum);

      console.log(`✅ Found ${total} pemesanan records for validator`);

      return {
        data: rows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Find all for validator error:", error);
      return {
        data: [],
        total: 0,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
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
