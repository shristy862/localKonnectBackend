import express from 'express';
import { dashboard } from '../../Controllers/user/userControllers.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';
const router = express.Router();

// Route for Admin Dashboard
router.get('/dashboard', authenticateToken, dashboard);

export default router;
