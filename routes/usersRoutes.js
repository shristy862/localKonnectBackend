
import { Router } from 'express';
import { sendOtp, createAccount } from '../controllers/userController.js';

const router = Router();

// Route for sending OTP
router.post('/signup', sendOtp);

// Route for verifying OTP and creating an account
router.post('/create-account', createAccount);

export default router;
