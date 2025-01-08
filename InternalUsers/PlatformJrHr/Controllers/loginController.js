import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../models/user.js';

export const loginPlatformJrHr = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.userType !== 'platformJrHr') {
            return res.status(403).json({ message: 'Access denied. Only PlatformJrHr users can log in.' });
        }

        // Compare the password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, userType: user.userType, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '30m' } 
        );

        // Send the response 
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
