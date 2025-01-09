// routes/adminRoutes.js
import { Router } from 'express';
import { superAdminLogin } from '../Controllers/loginController.js';
import { superAdminDashboard } from '../Controllers/dashboardControllers.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';
import { sendOtpForNewUser, verifyOtpForNewUser } from '../../controllers/userController.js';

const router = Router();

// Super Admin Login Route
router.post('/login', superAdminLogin);
// Route for Super Admin Dashboard
router.get('/dashboard', authenticateToken, superAdminDashboard);

// Route for SuperAdmin to send OTP for creating a new user (Accountant)
router.post('/user/send-otp', authenticateToken, sendOtpForNewUser);

// Route for SuperAdmin to verify OTP and create the user
router.post('/user/verify-otp', authenticateToken, verifyOtpForNewUser);
export default router;
