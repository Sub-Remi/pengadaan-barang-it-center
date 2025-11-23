import express from "express";
import { authenticate } from "../middleware/auth.js";
import { requirePemohon } from "../middleware/roleAuth.js";
import {
  createPermintaan,
  getPermintaanByUser,
  getPermintaanDetail,
  updatePermintaan,
  submitPermintaan,
  getPermintaanCountByStatus,
  getPermintaanWithStatusUpdate,
} from "../controller/permintaanController.js";
import {
  addBarangToPermintaan,
  updateBarangInPermintaan,
  deleteBarangFromPermintaan,
} from "../controller/barangPermintaanController.js";

const router = express.Router();

// All routes require pemohon role
router.use(authenticate, requirePemohon);

// Routes untuk permintaan
router.get("/permintaan", getPermintaanByUser);
router.get("/permintaan/count", getPermintaanCountByStatus);
router.get("/permintaan/updates", getPermintaanWithStatusUpdate);
router.get("/permintaan/:id", getPermintaanDetail);
router.post("/permintaan", createPermintaan);
router.put("/permintaan/:id", updatePermintaan);
router.put("/permintaan/:id/submit", submitPermintaan);

// Routes untuk barang dalam permintaan
router.post("/permintaan/:id/barang", addBarangToPermintaan);
router.put("/permintaan/:id/barang/:barangId", updateBarangInPermintaan);
router.delete("/permintaan/:id/barang/:barangId", deleteBarangFromPermintaan);

export default router;
