// routes/adminRoutes.js
import { Router } from 'express';
import { userDashboard } from '../users/Controllers/dashboardControllers.js';
import { authenticateToken } from '../middlewares/verifyToken.js';
import { signup, verifyOtp,createPassword,loginUsers } from '../Controllers/authController.js'; 

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
router.get('/dashboard', authenticateToken, userDashboard);

export default router;
