
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../users/models/user.js';

// Login User Controller
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified. Please verify your email.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with the token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,  
                userType: user.userType,
                isVerified: user.isVerified,
            } // Send the token back to the client
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
