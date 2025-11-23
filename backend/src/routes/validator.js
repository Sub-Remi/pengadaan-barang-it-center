import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireValidator } from '../middleware/roleAuth.js';
import { getPermintaanForValidation, validateBarang } from '../controller/validatorController.js';

const router = express.Router();

// All routes require validator role
router.use(authenticate, requireValidator);

router.get('/permintaan', getPermintaanForValidation);
router.put('/permintaan/:id/validate', validateBarang);
// ... tambahkan routes validator lainnya

export default router;

/*
GET    /api/validator/permintaan
GET    /api/validator/permintaan/:id
PUT    /api/validator/barang/:id/validasi
GET    /api/validator/riwayat
GET    /api/validator/penerimaan-barang
*/