import { Router } from 'express';
import { signup, verifyOtp,createPassword,loginUsers, logout } from '../../Controllers/auth/authController.js'; 
import { authenticateToken } from '../../middlewares/verifyToken.js';

const router = Router();

// Route for signup
router.post('/signup', signup);

// OTP Verification Route
router.post('/signupverification', verifyOtp);

// Route for creating a password 
router.post('/createpassword', createPassword);

//Login Route
router.post('/login', loginUsers);

// logout
router.post('/logout', authenticateToken, logout)

export default router;
