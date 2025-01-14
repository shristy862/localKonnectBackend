import { Router } from 'express';
import { signup, verifyOtp,createPassword,loginUsers } from '../Controllers/auth/authController.js'; 

const router = Router();

// Route for signup
router.post('/signup', signup);
// OTP Verification Route
router.post('/signupverification', verifyOtp);
// Route for creating a password 
router.post('/createpassword', createPassword);
// Super Admin Login Route
router.post('/login', loginUsers);

export default router;
