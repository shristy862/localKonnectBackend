import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import TemporaryUser from '../models/temporaryUserModal.js';
import  {sendEmail}  from '../services/emailService.js';
import { generateOtp } from '../services/generateOTP.js';
import { ROLES } from '../models/role.js';

// Send OTP for creating a new user (Accountant)
export const sendOtpForNewUser = async (req, res) => {
    const { email, userType } = req.body;

    try {
        // Check if the userType is valid
        if (!Object.values(ROLES).includes(userType)) {
            return res.status(400).json({ message: 'Invalid userType.' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // expiry for 5 minutes

        // Save the temporary user data with OTP
        const temporaryUser = new TemporaryUser({
            email,
            otp,
            otpExpiry,
            userType,
        });

        await temporaryUser.save();

        // Send OTP to the email
        const subject = 'Requested OTP for User Creation';
        const message = `Hello, your OTP for creating a new account is ${otp}`;
        await sendEmail(email, subject, message);

        res.status(201).json({ message: 'OTP sent to the email. Please verify to complete signup.' });
    } catch (error) {
        console.error(error);
        // Send the actual error message in the response
        res.status(500).json({ message: `Server error: ${error.message || error}` });
    }
};

// Verify OTP and complete the user signup
export const verifyOtpForNewUser = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        // Retrieve the temporary user data
        const temporaryUser = await TemporaryUser.findOne({ email });
        if (!temporaryUser) {
            return res.status(400).json({ message: 'No temporary user found for this email.' });
        }

        // Verify OTP and expiry
        if (temporaryUser.otp !== parseInt(otp) || temporaryUser.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            rawPassword: password,
            userType: temporaryUser.userType,
            isVerified: true,
            createdBy: req.user._id, // SuperAdmin's ID (assumed the SuperAdmin is logged in)
        });

        await newUser.save();

        // Remove the temporary user record
        await TemporaryUser.deleteOne({ email });

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        console.error(error);
        // Send the actual error message in the response
        res.status(500).json({ message: `Server error: ${error.message || error}` });
    }
};
