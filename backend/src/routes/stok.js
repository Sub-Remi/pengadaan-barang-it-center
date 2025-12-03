import express from 'express';
import { 
  getAllStok, 
  getStokDetail, 
  createStok, 
  updateStok, 
  tambahStok, 
  deleteStok 
} from '../controllers/stokController.js';

const router = express.Router();

router.get('/', getAllStok);
router.get('/:id', getStokDetail);
router.post('/', createStok);
router.put('/:id', updateStok);
router.put('/:id/tambah', tambahStok);
router.delete('/:id', deleteStok);

export default router;