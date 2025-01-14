import express from 'express';
import { addMultipleServices } from '../Controllers/serviceController.js';
import { authenticateToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add-multiple', authenticateToken, addMultipleServices);

export default router;
