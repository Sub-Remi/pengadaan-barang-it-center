import dbPool from "../config/database.js";

const DokumenPembelian = {
  // Create new dokumen pembelian - SIMPLIFIED
  create: async (dokumenData) => {
    const {
      barang_permintaan_id,
      jenis_dokumen,
      file_url,
      original_name,
      file_size,
      uploaded_by,
    } = dokumenData;

    const query = `
      INSERT INTO dokumen_pembelian 
      (barang_permintaan_id, jenis_dokumen, nama_file, file_path, original_name, file_size, uploaded_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.execute(query, [
      barang_permintaan_id,
      jenis_dokumen,
      original_name, // sebagai nama_file di database
      file_url, // sebagai file_path di database
      original_name,
      file_size,
      uploaded_by,
    ]);

    return result.insertId;
  },

  // Find by ID - SIMPLIFIED
  findById: async (id) => {
    const query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        p.nomor_permintaan,
        u.nama_lengkap as uploader_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      JOIN permintaan p ON bp.permintaan_id = p.id
      LEFT JOIN users u ON dp.uploaded_by = u.id
      WHERE dp.id = ?
    `;
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Find by barang_permintaan_id - SIMPLIFIED
  findByBarangPermintaanId: async (barang_permintaan_id) => {
    const query = `
      SELECT 
        dp.*,
        u.nama_lengkap as uploader_name
      FROM dokumen_pembelian dp
      LEFT JOIN users u ON dp.uploaded_by = u.id
      WHERE dp.barang_permintaan_id = ?
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
    return rows;
  },

  // Find by permintaan_id - SIMPLIFIED
  findByPermintaanId: async (permintaan_id) => {
    const query = `
      SELECT 
        dp.*,
        bp.nama_barang,
        bp.spesifikasi,
        u.nama_lengkap as uploader_name
      FROM dokumen_pembelian dp
      JOIN barang_permintaan bp ON dp.barang_permintaan_id = bp.id
      LEFT JOIN users u ON dp.uploaded_by = u.id
      WHERE bp.permintaan_id = ?
      ORDER BY dp.created_at DESC
    `;
    const [rows] = await dbPool.execute(query, [permintaan_id]);
    return rows;
  },

  // Delete dokumen - SIMPLIFIED
  delete: async (id) => {
    // First get file path to delete physical file
    const dokumen = await DokumenPembelian.findById(id);

    const query = "DELETE FROM dokumen_pembelian WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);

    // Return both affectedRows and file path for cleanup
    return {
      affectedRows: result.affectedRows,
      filePath: dokumen ? dokumen.file_path : null,
    };
  },

  // Get dokumen statistics - SIMPLIFIED
  getStats: async () => {
    const query = `
      SELECT 
        jenis_dokumen,
        COUNT(*) as total
      FROM dokumen_pembelian 
      GROUP BY jenis_dokumen
    `;
    const [rows] = await dbPool.execute(query);
    return rows;
  },
};

export default DokumenPembelian;
