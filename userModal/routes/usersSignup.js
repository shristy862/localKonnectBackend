import { Router } from 'express';
import { sendOtp, createAccount } from '../Controllers/userController.js';
const router = Router();

// Route for sending OTP for verifing email
router.post('/signup', sendOtp);

// Route for creating a user's account after OTP verification
router.post('/create-account', createAccount);

export default router;