import Permintaan from "../models/permintaan.js";
import BarangPermintaan from "../models/barang_permintaan.js";
import dbPool from "../config/database.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get laporan dengan filter
export const getLaporan = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filters
    const filters = {
      status: req.query.status,
      divisi_id: req.query.divisi_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      search: req.query.search,
    };

    console.log("📊 Getting laporan with filters:", filters);

    const result = await Permintaan.findAllWithFilters(filters, page, limit);

    res.json({
      message: "Laporan berhasil diambil.",
      data: result.data,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
        itemsPerPage: result.limit,
      },
    });
  } catch (error) {
    console.error("💥 Get laporan error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Get statistik untuk dashboard
export const getStatistik = async (req, res) => {
  try {
    const { start_date, end_date, divisi_id } = req.query;

    let query = `
      SELECT 
        COUNT(*) as total_permintaan,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses,
        SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as menunggu,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM permintaan p
      WHERE p.status != 'draft'
    `;

    const params = [];

    if (start_date && end_date) {
      query += " AND DATE(p.created_at) BETWEEN ? AND ?";
      params.push(start_date, end_date);
    }

    if (divisi_id) {
      query += ` AND p.user_id IN (SELECT id FROM users WHERE divisi_id = ?)`;
      params.push(divisi_id);
    }

    const [stats] = await dbPool.execute(query, params);

    // Get total barang yang diminta
    const barangQuery = `
      SELECT 
        COUNT(*) as total_barang,
        SUM(jumlah) as total_jumlah
      FROM barang_permintaan bp
      JOIN permintaan p ON bp.permintaan_id = p.id
      WHERE p.status != 'draft'
      ${start_date && end_date ? "AND DATE(p.created_at) BETWEEN ? AND ?" : ""}
    `;

    const barangParams = [];
    if (start_date && end_date) {
      barangParams.push(start_date, end_date);
    }

    const [barangStats] = await dbPool.execute(barangQuery, barangParams);

    res.json({
      message: "Statistik berhasil diambil.",
      data: {
        ...stats[0],
        total_barang: barangStats[0].total_barang || 0,
        total_jumlah: barangStats[0].total_jumlah || 0,
      },
    });
  } catch (error) {
    console.error("💥 Get statistik error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};

// Export ke Excel
export const exportExcel = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      divisi_id: req.query.divisi_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      search: req.query.search,
    };

    console.log("📤 Export Excel dengan filter:", filters);

    // Get all data tanpa pagination untuk export
    const data = await Permintaan.findAllWithFiltersForExport(filters);

    // Buat workbook baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Permintaan");

    // Styling header
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nomor Permintaan", key: "nomor_permintaan", width: 20 },
      { header: "Tanggal", key: "tanggal", width: 15 },
      { header: "Divisi", key: "divisi", width: 20 },
      { header: "Pemohon", key: "pemohon", width: 20 },
      { header: "Tanggal Kebutuhan", key: "tanggal_kebutuhan", width: 15 },
      { header: "Jumlah Barang", key: "jumlah_barang", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Catatan", key: "catatan", width: 30 },
    ];

    // Header styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };

    // Tambahkan data
    data.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        nomor_permintaan: item.nomor_permintaan,
        tanggal: new Date(item.created_at).toLocaleDateString("id-ID"),
        divisi: item.nama_divisi,
        pemohon: item.nama_lengkap,
        tanggal_kebutuhan: new Date(item.tanggal_kebutuhan).toLocaleDateString("id-ID"),
        jumlah_barang: item.jumlah_barang || 0,
        status: item.status,
        catatan: item.catatan || "-",
      });
    });

    // Format status dengan warna
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const statusCell = row.getCell("status");
        const status = statusCell.value;

        switch (status) {
          case "selesai":
            statusCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFC6EFCE" },
            };
            break;
          case "diproses":
            statusCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFEB9C" },
            };
            break;
          case "menunggu":
            statusCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFC7CE" },
            };
            break;
          case "ditolak":
            statusCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFC9C9C9" },
            };
            break;
        }
      }
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=laporan_permintaan_${Date.now()}.xlsx`
    );

    // Kirim file
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("💥 Export Excel error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat export Excel." });
  }
};

// Export ke PDF
export const exportPDF = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      divisi_id: req.query.divisi_id,
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      search: req.query.search,
    };

    console.log("📤 Export PDF dengan filter:", filters);

    // Get all data tanpa pagination untuk export
    const data = await Permintaan.findAllWithFiltersForExport(filters);

    // Get statistik
    const [stats] = await dbPool.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses,
        SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as menunggu,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM permintaan
      WHERE status != 'draft'
    `);

    // Buat dokumen PDF
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=laporan_permintaan_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(20)
      .text("LAPORAN PERMINTAAN BARANG", { align: "center" })
      .moveDown();

    // Informasi laporan
    doc.fontSize(10).text(`Tanggal Export: ${new Date().toLocaleDateString("id-ID")}`);
    if (filters.start_date && filters.end_date) {
      doc.text(`Periode: ${filters.start_date} s/d ${filters.end_date}`);
    }
    doc.moveDown();

    // Statistik
    doc
      .fontSize(12)
      .text("STATISTIK", { underline: true })
      .moveDown(0.5);

    doc.fontSize(10);
    doc.text(`Total Permintaan: ${stats[0].total || 0}`);
    doc.text(`Selesai: ${stats[0].selesai || 0}`);
    doc.text(`Diproses: ${stats[0].diproses || 0}`);
    doc.text(`Menunggu: ${stats[0].menunggu || 0}`);
    doc.text(`Ditolak: ${stats[0].ditolak || 0}`);
    doc.moveDown();

    // Tabel header
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidth = 100;
    const rowHeight = 25;

    // Header tabel
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("No", tableLeft, tableTop)
      .text("Nomor Permintaan", tableLeft + 30, tableTop)
      .text("Divisi", tableLeft + 150, tableTop)
      .text("Tanggal", tableLeft + 250, tableTop)
      .text("Status", tableLeft + 350, tableTop);

    // Garis header
    doc
      .moveTo(tableLeft, tableTop + 15)
      .lineTo(tableLeft + 450, tableTop + 15)
      .stroke();

    // Data tabel
    let y = tableTop + rowHeight;
    doc.font("Helvetica");

    data.forEach((item, index) => {
      if (y > 700) {
        // Jika halaman hampir penuh, buat halaman baru
        doc.addPage();
        y = 50;
      }

      doc
        .fontSize(9)
        .text(index + 1, tableLeft, y)
        .text(item.nomor_permintaan, tableLeft + 30, y, { width: 120 })
        .text(item.nama_divisi, tableLeft + 150, y, { width: 100 })
        .text(new Date(item.created_at).toLocaleDateString("id-ID"), tableLeft + 250, y)
        .text(item.status, tableLeft + 350, y);

      // Garis pemisah
      doc
        .moveTo(tableLeft, y + 15)
        .lineTo(tableLeft + 450, y + 15)
        .stroke();

      y += rowHeight;
    });

    // Footer
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .text(
          `Halaman ${i + 1} dari ${totalPages}`,
          50,
          doc.page.height - 50,
          { align: "center" }
        );
      doc
        .text(
          `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
          50,
          doc.page.height - 35,
          { align: "center" }
        );
    }

    doc.end();
  } catch (error) {
    console.error("💥 Export PDF error:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat export PDF." });
  }
};

export default {
  getLaporan,
  getStatistik,
  exportExcel,
  exportPDF,
};