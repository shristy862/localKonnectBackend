import bcrypt from 'bcryptjs';
import TemporaryUser from '../models/temporaryUserModal.js'; 
import User from '../models/user.js'; 
import { sendEmail } from '../services/emailService.js';
import { generateOtp } from '../services/generateOTP.js';

// Send OTP Controller
export const sendOtp = async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        // Check if the temporary user exists
        const existingTempUser = await TemporaryUser.findOne({ email });
        if (existingTempUser) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // expiry for 5 minutes

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save Temporary User
        const temporaryUser = new TemporaryUser({
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            userType,
        });

        await temporaryUser.save();

        // Send OTP to user's email
        const subject = 'Requested OTP';
        const message = `Hello, your OTP for verification is ${otp}`;
        await sendEmail(email, subject, message);

        res.status(201).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Account Controller
export const createAccount = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve Temporary User
        const temporaryUser = await TemporaryUser.findOne({ email });
        if (!temporaryUser) {
            return res.status(400).json({ message: 'No temporary user found for this email.' });
        }

        // Verify OTP
        if (temporaryUser.otp !== parseInt(otp) || temporaryUser.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Create a New User
        const newUser = new User({
            email,
            password: temporaryUser.password, // Pre-hashed password
            isVerified: true,
            userType: temporaryUser.userType,
        });

        await newUser.save();

        // Remove Temporary User Record
        await TemporaryUser.deleteOne({ email });

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error('Error in createAccount:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
