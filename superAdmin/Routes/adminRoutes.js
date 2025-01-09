// routes/adminRoutes.js
import { Router } from 'express';
import { superAdminLogin } from '../Controllers/loginController.js';
import { superAdminDashboard } from '../Controllers/dashboardControllers.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';

const router = Router();

// Super Admin Login Route
router.post('/login', superAdminLogin);
// Route for Super Admin Dashboard
router.get('/dashboard', authenticateToken, superAdminDashboard);

export default router;
