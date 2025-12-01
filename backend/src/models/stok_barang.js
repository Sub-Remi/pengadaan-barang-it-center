import dbPool from "../config/database.js";

const StokBarang = {
findAllWithPagination: async (page = 1, limit = 10, search = "", kategori_id = "", satuan_id = "") => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;
  
  let query = `
    SELECT 
      sb.*, 
      kb.nama_kategori,
      sbu.nama_satuan
    FROM stok_barang sb
    LEFT JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
    LEFT JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
    WHERE 1=1
  `;
  
  let countQuery = `
    SELECT COUNT(*) as total 
    FROM stok_barang sb
    WHERE 1=1
  `;
  
  const values = [];
  const countValues = [];
  
  if (search) {
    query += " AND (sb.nama_barang LIKE ? OR sb.kode_barang LIKE ?)";
    countQuery += " AND (sb.nama_barang LIKE ? OR sb.kode_barang LIKE ?)";
    const searchTerm = `%${search}%`;
    values.push(searchTerm, searchTerm);
    countValues.push(searchTerm, searchTerm);
  }
  
  if (kategori_id && kategori_id !== "semua") {
    query += " AND sb.kategori_barang_id = ?";
    countQuery += " AND sb.kategori_barang_id = ?";
    values.push(kategori_id);
    countValues.push(kategori_id);
  }
  
  if (satuan_id && satuan_id !== "semua") {
    query += " AND sb.satuan_barang_id = ?";
    countQuery += " AND sb.satuan_barang_id = ?";
    values.push(satuan_id);
    countValues.push(satuan_id);
  }
  
  query += " ORDER BY sb.nama_barang ASC";
  
  // ✅ PERBAIKAN: Tambahkan langsung ke query string
  query += ` LIMIT ${limitNum} OFFSET ${offset}`;
  
  try {
    const [rows] = values.length > 0
      ? await dbPool.execute(query, values)
      : await dbPool.execute(query);
    
    const [countRows] = countValues.length > 0
      ? await dbPool.execute(countQuery, countValues)
      : await dbPool.execute(countQuery);
    
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limitNum);
    
    return {
      data: rows,
      total: total,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages
    };
  } catch (error) {
    console.error("💥 Stok find all error:", error);
    throw error;
  }
},

  // Find by ID dengan join
  findById: async (id) => {
    const query = `
      SELECT 
        sb.*, 
        kb.nama_kategori,
        sbu.nama_satuan
      FROM stok_barang sb
      LEFT JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
      LEFT JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
      WHERE sb.id = ?
    `;
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Create new stok - AUTO GENERATE KODE BARANG
  create: async (stokData) => {
    const {
      kategori_barang_id,
      nama_barang,
      spesifikasi,
      satuan_barang_id,
      stok,
      stok_minimum
    } = stokData;
    
    // Generate kode barang: BRG-{timestamp}
    const kode_barang = `BRG-${Date.now()}`;
    
    const query = `
      INSERT INTO stok_barang 
      (kode_barang, kategori_barang_id, nama_barang, spesifikasi, satuan_barang_id, stok, stok_minimum) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await dbPool.execute(query, [
      kode_barang,
      kategori_barang_id,
      nama_barang,
      spesifikasi || "",
      satuan_barang_id,
      stok || 0,
      stok_minimum || 0
    ]);
    return result.insertId;
  },

  // Update stok (kode_barang tidak bisa diubah)
  update: async (id, stokData) => {
    const {
      kategori_barang_id,
      nama_barang,
      spesifikasi,
      satuan_barang_id,
      stok_minimum
    } = stokData;
    
    const query = `
      UPDATE stok_barang 
      SET kategori_barang_id = ?, nama_barang = ?, spesifikasi = ?, 
          satuan_barang_id = ?, stok_minimum = ?
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      kategori_barang_id,
      nama_barang,
      spesifikasi || "",
      satuan_barang_id,
      stok_minimum || 0,
      id
    ]);
    return result.affectedRows;
  },

  // Update stok quantity (tambah stok)
  updateStokQuantity: async (id, tambah_stok) => {
    // Get current stok
    const currentQuery = "SELECT stok FROM stok_barang WHERE id = ?";
    const [currentRows] = await dbPool.execute(currentQuery, [id]);
    
    if (currentRows.length === 0) {
      throw new Error("Barang tidak ditemukan");
    }
    
    const currentStok = currentRows[0].stok;
    const newStok = currentStok + parseInt(tambah_stok);
    
    const query = "UPDATE stok_barang SET stok = ? WHERE id = ?";
    const [result] = await dbPool.execute(query, [newStok, id]);
    return { affectedRows: result.affectedRows, newStok };
  },

  // Delete stok
  delete: async (id) => {
    const query = "DELETE FROM stok_barang WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  }
};

export default StokBarang;