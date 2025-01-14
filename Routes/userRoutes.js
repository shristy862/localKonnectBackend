import express from 'express';
import { userDashboard } from '../Controllers/user/userControllers.js';
import { authenticateToken } from '../middlewares/verifyToken.js';
const router = express.Router();

// Route for Super Admin Dashboard
router.get('/dashboard', authenticateToken, userDashboard);

export default router;
