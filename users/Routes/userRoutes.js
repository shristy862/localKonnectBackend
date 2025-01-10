// routes/adminRoutes.js
import { Router } from 'express';
import { loginUsers } from '../Controllers/loginController.js';
import { superAdminDashboard } from '../Controllers/dashboardControllers.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';
import { sendOtpForNewUser, verifyOtpForNewUser } from '../../controllers/userController.js';
import { signup } from '../Controllers/signupController.js';
import { verifyOtp } from '../Controllers/signupVerification.js'; 
import { createPassword } from '../Controllers/createPassword.js';

const router = Router();

// Route for signup
router.post('/signup', signup);
// OTP Verification Route
router.post('/signupverification', verifyOtp);
// Route for creating a password 
router.post('/createpassword', createPassword);
// Super Admin Login Route
router.post('/login', loginUsers);
// Route for Super Admin Dashboard
router.get('/dashboard', authenticateToken, superAdminDashboard);

// Route for SuperAdmin to send OTP for creating a new user (Accountant)
router.post('/user/send-otp', authenticateToken, sendOtpForNewUser);

// Route for SuperAdmin to verify OTP and create the user
router.post('/user/verify-otp', authenticateToken, verifyOtpForNewUser);
export default router;
