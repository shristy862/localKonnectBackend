import express from 'express';
import { createPaymentMode, getAllPaymentModes, getPaymentModeById, updatePaymentMode, deletePaymentMode } from '../../Controllers/serviceProvider/paymentModes.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';
const router = express.Router();

// Create a new payment mode
router.post('/', authenticateToken,createPaymentMode);

// Get all payment modes
router.get('/', authenticateToken,getAllPaymentModes);

// Get payment mode by ID
router.get('/:id', authenticateToken,getPaymentModeById);

// Update payment mode by ID
router.put('/:id',authenticateToken, updatePaymentMode);

// Delete payment mode by ID
router.delete('/:id', authenticateToken,deletePaymentMode);

export default router;
