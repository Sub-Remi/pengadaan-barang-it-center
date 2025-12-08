import dbPool from "../config/database.js";

const BarangPermintaan = {
  // Create new barang in permintaan
  create: async (barangData) => {
    const {
      permintaan_id,
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
      stok_barang_id,
    } = barangData;

    const query = `
      INSERT INTO barang_permintaan 
      (permintaan_id, kategori_barang, nama_barang, spesifikasi, jumlah, keterangan, stok_barang_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbPool.execute(query, [
      permintaan_id,
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
      stok_barang_id,
    ]);

    return result.insertId;
  },

  // Find barang by ID
  findById: async (id) => {
    const query = "SELECT * FROM barang_permintaan WHERE id = ?";
    const [rows] = await dbPool.execute(query, [id]);
    return rows[0];
  },

  // Get all barang by permintaan_id
  findByPermintaanId: async (permintaanId) => {
    const query =
      "SELECT * FROM barang_permintaan WHERE permintaan_id = ? ORDER BY created_at DESC";
    const [rows] = await dbPool.execute(query, [permintaanId]);
    return rows;
  },

  // Get barang by ID and permintaan_id
  findByIdAndPermintaanId: async (id, permintaanId) => {
    const query =
      "SELECT * FROM barang_permintaan WHERE id = ? AND permintaan_id = ?";
    const [rows] = await dbPool.execute(query, [id, permintaanId]);
    return rows[0];
  },

  // Update barang
  update: async (id, barangData) => {
    const { kategori_barang, nama_barang, spesifikasi, jumlah, keterangan } =
      barangData;
    const query = `
      UPDATE barang_permintaan 
      SET kategori_barang = ?, nama_barang = ?, spesifikasi = ?, jumlah = ?, keterangan = ? 
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
      id,
    ]);
    return result.affectedRows;
  },

  // Delete barang
  delete: async (id) => {
    const query = "DELETE FROM barang_permintaan WHERE id = ?";
    const [result] = await dbPool.execute(query, [id]);
    return result.affectedRows;
  },

  // Get all barang by permintaan_id dengan pagination - DENGAN JOIN stok_barang
  findByPermintaanIdWithPagination: async (
    permintaanId,
    page = 1,
    limit = 5
  ) => {
    const offset = (page - 1) * limit;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    console.log("📦 Pagination barang params:", {
      permintaanId,
      pageNum,
      limitNum,
      offsetNum,
    });

    // Query dengan LEFT JOIN ke stok_barang
    const query = `
    SELECT 
      bp.*,
      sb.kategori_barang_id as stok_kategori_id,
      sb.nama_barang as stok_nama_barang,
      sb.spesifikasi as stok_spesifikasi,
      sb.satuan_barang_id as stok_satuan_id,
      sb.stok as stok_jumlah,
      sb.stok_minimum as stok_minimum,
      kb.nama_kategori as stok_nama_kategori,
      sbu.nama_satuan as stok_nama_satuan
    FROM barang_permintaan bp
    LEFT JOIN stok_barang sb ON bp.stok_barang_id = sb.id
    LEFT JOIN kategori_barang kb ON sb.kategori_barang_id = kb.id
    LEFT JOIN satuan_barang sbu ON sb.satuan_barang_id = sbu.id
    WHERE bp.permintaan_id = ? 
    ORDER BY bp.created_at DESC
    LIMIT ${limitNum} OFFSET ${offsetNum}
  `;

    const countQuery = `
    SELECT COUNT(*) as total 
    FROM barang_permintaan 
    WHERE permintaan_id = ?
  `;

    try {
      console.log("🔍 Executing barang query dengan JOIN:", query);
      const [rows] = await dbPool.execute(query, [permintaanId]);
      const [countRows] = await dbPool.execute(countQuery, [permintaanId]);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limitNum);

      console.log(
        "✅ Barang query successful. Total:",
        total,
        "Total pages:",
        totalPages
      );

      // Format data agar lebih mudah di frontend
      const formattedRows = rows.map((row) => {
        const barang = {
          id: row.id,
          permintaan_id: row.permintaan_id,
          kategori_barang: row.kategori_barang,
          nama_barang: row.nama_barang,
          spesifikasi: row.spesifikasi,
          jumlah: row.jumlah,
          keterangan: row.keterangan,
          status: row.status,
          stok_barang_id: row.stok_barang_id,
          stok_available: row.stok_available,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };

        // Jika ada data dari stok_barang
        if (row.stok_barang_id) {
          barang.stok_barang = {
            id: row.stok_barang_id,
            kategori_barang_id: row.stok_kategori_id,
            nama_barang: row.stok_nama_barang,
            spesifikasi: row.stok_spesifikasi,
            satuan_barang_id: row.stok_satuan_id,
            stok: row.stok_jumlah,
            stok_minimum: row.stok_minimum,
            nama_kategori: row.stok_nama_kategori,
            nama_satuan: row.stok_nama_satuan,
          };
        }

        return barang;
      });

      return {
        data: formattedRows,
        total: total,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      };
    } catch (error) {
      console.error("💥 Barang database query error:", error);
      throw error;
    }
  },

  // Update status barang
  updateStatus: async (id, status, catatan_admin = null) => {
    let query =
      "UPDATE barang_permintaan SET status = ?, updated_at = CURRENT_TIMESTAMP";
    const values = [status];

    if (catatan_admin) {
      query += ", catatan_admin = ?";
      values.push(catatan_admin);
    }

    query += " WHERE id = ?";
    values.push(id);

    const [result] = await dbPool.execute(query, values);
    return result.affectedRows;
  },

  updateStatusWithStok: async (
    id,
    status,
    catatan_admin = null,
    userId = null
  ) => {
    const connection = await dbPool.getConnection();

    try {
      await connection.beginTransaction();

      console.log(
        `🔄 Memulai transaction untuk barang ${id}, status: ${status}`
      );

      // 1. Ambil data barang terlebih dahulu
      const getQuery = `
      SELECT bp.*, sb.id as stok_id, sb.stok 
      FROM barang_permintaan bp
      LEFT JOIN stok_barang sb ON bp.stok_barang_id = sb.id
      WHERE bp.id = ?
    `;

      const [barangRows] = await connection.execute(getQuery, [id]);
      const barang = barangRows[0];

      if (!barang) {
        throw new Error("Barang tidak ditemukan");
      }

      const permintaanId = barang.permintaan_id;
      const namaBarang = barang.nama_barang;
      const jumlahBarang = barang.jumlah;
      const previousStatus = barang.status; // Status sebelumnya

      console.log(
        `📦 Data barang ditemukan: ${namaBarang}, Jumlah: ${jumlahBarang}, Status sebelumnya: ${previousStatus}`
      );

      // 2. Update status barang
      let updateQuery = `
      UPDATE barang_permintaan 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
    `;

      const updateValues = [status];

      if (catatan_admin) {
        updateQuery += ", catatan_admin = ?";
        updateValues.push(catatan_admin);
      }

      updateQuery += " WHERE id = ?";
      updateValues.push(id);

      console.log(`📝 Update query: ${updateQuery}`);

      const [updateResult] = await connection.execute(
        updateQuery,
        updateValues
      );

      console.log(
        `✅ Barang ${id} diupdate. Affected rows: ${updateResult.affectedRows}`
      );

      // 3. Jika status = 'selesai' dan ada stok_barang_id, kurangi stok
      let stokUpdated = false;
      let stokBaru = 0;

      // PERBAIKAN: Tambahkan validasi ekstra untuk mencegah pengurangan ganda
      if (
        status === "selesai" &&
        previousStatus !== "selesai" &&
        barang.stok_barang_id
      ) {
        const jumlahPermintaan = parseInt(barang.jumlah) || 0;

        if (jumlahPermintaan <= 0) {
          console.log(`⚠️ Jumlah permintaan invalid: ${jumlahPermintaan}`);
        } else {
          // Cek stok terlebih dahulu
          const checkStokQuery = `SELECT stok FROM stok_barang WHERE id = ?`;
          const [stokRows] = await connection.execute(checkStokQuery, [
            barang.stok_barang_id,
          ]);

          if (stokRows.length > 0) {
            const stokSekarang = parseInt(stokRows[0].stok) || 0;

            console.log(
              `📊 Stok saat ini: ${stokSekarang}, Jumlah permintaan: ${jumlahPermintaan}`
            );

            if (stokSekarang >= jumlahPermintaan) {
              // PERBAIKAN: Kurangi stok dengan jumlah yang benar
              stokBaru = stokSekarang - jumlahPermintaan;

              // PERBAIKAN: Tambahkan log untuk tracking
              console.log(
                `🔧 Mengurangi stok: ${stokSekarang} - ${jumlahPermintaan} = ${stokBaru}`
              );

              const updateStokQuery = `
          UPDATE stok_barang 
          SET stok = ?, updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `;

              await connection.execute(updateStokQuery, [
                stokBaru,
                barang.stok_barang_id,
              ]);
              stokUpdated = true;
              console.log(
                `✅ Stok dikurangi: dari ${stokSekarang} ke ${stokBaru}`
              );
            } else {
              console.warn(
                `⚠️ Stok tidak cukup: ${stokSekarang} < ${jumlahPermintaan}`
              );
            }
          } else {
            console.warn(
              `⚠️ Data stok tidak ditemukan untuk ID: ${barang.stok_barang_id}`
            );
          }
        }
      } else if (status === "selesai" && previousStatus === "selesai") {
        console.log(
          `ℹ️ Status sudah 'selesai', tidak perlu mengurangi stok lagi.`
        );
      }

      // 4. Update status permintaan berdasarkan LOGIKA BARU yang BENAR
      // 4. Update status permintaan berdasarkan LOGIKA BARU yang BENAR
      const checkBarangQuery = `
  SELECT 
    COUNT(*) as total,
    COALESCE(SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END), 0) as selesai,
    COALESCE(SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END), 0) as ditolak,
    COALESCE(SUM(CASE WHEN status IN ('menunggu validasi', 'diproses', 'dalam pemesanan') THEN 1 ELSE 0 END), 0) as dalam_proses
  FROM barang_permintaan 
  WHERE permintaan_id = ?
`;

      const [statusRows] = await connection.execute(checkBarangQuery, [
        permintaanId,
      ]);
      const statusData = statusRows[0];

      console.log(`📊 Status data permintaan ${permintaanId}:`, statusData);

      // LOGIKA STATUS PERMINTAAN yang DIPERBAIKI
      // Konversi data ke number dengan benar
      const totalBarang = parseInt(statusData.total) || 0;
      const jumlahSelesai = parseInt(statusData.selesai) || 0;
      const jumlahDitolak = parseInt(statusData.ditolak) || 0;
      const jumlahDalamProses = parseInt(statusData.dalam_proses) || 0;

      console.log(`🔢 Jumlah setelah parsing (NUMBER):`);
      console.log(`   Total: ${totalBarang} (tipe: ${typeof totalBarang})`);
      console.log(
        `   Selesai: ${jumlahSelesai} (tipe: ${typeof jumlahSelesai})`
      );
      console.log(
        `   Ditolak: ${jumlahDitolak} (tipe: ${typeof jumlahDitolak})`
      );
      console.log(
        `   Dalam Proses: ${jumlahDalamProses} (tipe: ${typeof jumlahDalamProses})`
      );

      // LOGIKA STATUS PERMINTAAN YANG BENAR:
      let statusPermintaan = "diproses"; // default

      // 1. Jika SEMUA barang DITOLAK → Permintaan DITOLAK
      if (jumlahDitolak === totalBarang && totalBarang > 0) {
        statusPermintaan = "ditolak";
        console.log(
          `✅ LOGIKA 1: Semua ${jumlahDitolak}/${totalBarang} barang ditolak → Permintaan DITOLAK`
        );
      }
      // 2. Jika SEMUA barang SELESAI → Permintaan SELESAI
      else if (jumlahSelesai === totalBarang && totalBarang > 0) {
        statusPermintaan = "selesai";
        console.log(
          `✅ LOGIKA 2: Semua ${jumlahSelesai}/${totalBarang} barang selesai → Permintaan SELESAI`
        );
      }
      // 3. Jika TIDAK ADA yang dalam proses DAN ada barang (selesai/ditolak) → SELESAI
      else if (
        jumlahDalamProses === 0 &&
        totalBarang > 0 &&
        (jumlahSelesai > 0 || jumlahDitolak > 0)
      ) {
        statusPermintaan = "selesai";
        console.log(
          `✅ LOGIKA 3: ${jumlahSelesai} selesai, ${jumlahDitolak} ditolak, ${jumlahDalamProses} dalam proses → Permintaan SELESAI`
        );
      }
      // 4. Jika masih ada yang dalam proses → DIPROSES
      else if (jumlahDalamProses > 0) {
        statusPermintaan = "diproses";
        console.log(
          `✅ LOGIKA 4: Masih ${jumlahDalamProses} barang dalam proses → Permintaan DIPROSES`
        );
      }
      // 5. Default
      else {
        statusPermintaan = "diproses";
        console.log(`✅ LOGIKA 5: Default → Permintaan DIPROSES`);
      }

      // Update status permintaan jika berubah
      const currentPermintaanQuery = `SELECT status FROM permintaan WHERE id = ?`;
      const [currentPermintaanRows] = await connection.execute(
        currentPermintaanQuery,
        [permintaanId]
      );
      const currentStatus = currentPermintaanRows[0]?.status;

      if (currentStatus !== statusPermintaan) {
        const updatePermintaanQuery = `
    UPDATE permintaan 
    SET status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;

        await connection.execute(updatePermintaanQuery, [
          statusPermintaan,
          permintaanId,
        ]);
        console.log(
          `📊 Status permintaan ${permintaanId} diupdate dari '${currentStatus}' ke: '${statusPermintaan}'`
        );
      } else {
        console.log(
          `📊 Status permintaan ${permintaanId} tetap: '${statusPermintaan}'`
        );
      }

      await connection.commit();

      console.log(`✅ Transaction berhasil untuk barang ${id}`);

      // Kembalikan semua data yang diperlukan
      return {
        success: true,
        affectedRows: updateResult.affectedRows,
        permintaanStatus: statusPermintaan,
        stokUpdated: stokUpdated,
        stokNew: stokBaru,
        barangData: {
          id: id,
          nama_barang: namaBarang,
          jumlah: jumlahBarang,
          status: status,
          catatan_admin: catatan_admin || null,
        },
      };
    } catch (error) {
      await connection.rollback();
      console.error("💥 Transaction error:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Gagal update status barang: ${error.message}`);
    } finally {
      if (connection) {
        connection.release();
        console.log(`🔓 Connection released untuk barang ${id}`);
      }
    }
  },

  // Mark barang as received
  markAsReceived: async (id, penerimaan_barang_id) => {
    const query = `
      UPDATE barang_permintaan 
      SET sudah_diterima = TRUE, penerimaan_barang_id = ?, status = 'selesai'
      WHERE id = ?
    `;
    const [result] = await dbPool.execute(query, [penerimaan_barang_id, id]);
    return result.affectedRows;
  },

  // Di file models/barang_permintaan.js - perbaiki fungsi updateStatusAfterValidation
  updateStatusAfterValidation: async (
    barang_permintaan_id,
    status,
    catatan = null
  ) => {
    try {
      let query, values;

      if (catatan) {
        query =
          "UPDATE barang_permintaan SET status = ?, catatan_validator = ?, updated_at = NOW() WHERE id = ?";
        values = [status, catatan, barang_permintaan_id]; // Urutan yang benar
      } else {
        query =
          "UPDATE barang_permintaan SET status = ?, updated_at = NOW() WHERE id = ?";
        values = [status, barang_permintaan_id];
      }

      console.log("📝 Executing query:", { query, values });

      const [result] = await dbPool.execute(query, values);

      // Log status perubahan
      console.log(
        `📝 Status barang ${barang_permintaan_id} diubah menjadi ${status}`
      );

      return result.affectedRows;
    } catch (error) {
      console.error("💥 Update status after validation error:", error);
      throw error;
    }
  },
  // Cek apakah semua dokumen untuk barang sudah divalidasi
  checkAllDokumenValidated: async (barang_permintaan_id) => {
    const query = `
      SELECT 
        COUNT(*) as total_dokumen,
        SUM(CASE WHEN is_valid = 1 THEN 1 ELSE 0 END) as validated_count,
        SUM(CASE WHEN is_valid = 0 THEN 1 ELSE 0 END) as rejected_count,
        SUM(CASE WHEN is_valid IS NULL THEN 1 ELSE 0 END) as pending_count
      FROM dokumen_pembelian 
      WHERE barang_permintaan_id = ?
    `;
    const [rows] = await dbPool.execute(query, [barang_permintaan_id]);
    return rows[0];
  },

  // Fungsi untuk menghapus semua barang berdasarkan permintaan_id
  deleteAllByPermintaanId: async (permintaanId) => {
    const query = "DELETE FROM barang_permintaan WHERE permintaan_id = ?";
    const [result] = await dbPool.execute(query, [permintaanId]);
    return result.affectedRows;
  },

  // Fungsi untuk membuat barang dengan koneksi transaction
  createWithTransaction: async (connection, barangData) => {
    const {
      permintaan_id,
      kategori_barang,
      nama_barang,
      spesifikasi,
      jumlah,
      keterangan,
      stok_barang_id,
    } = barangData;

    const query = `
      INSERT INTO barang_permintaan 
      (permintaan_id, kategori_barang, nama_barang, spesifikasi, jumlah, keterangan, stok_barang_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      permintaan_id,
      kategori_barang,
      nama_barang,
      spesifikasi || "",
      jumlah,
      keterangan || "",
      stok_barang_id || null,
    ]);

    return result.insertId;
  },
};

export default BarangPermintaan;
