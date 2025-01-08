import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../userModal/Modal/modal.js';

export const loginHiringManager = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user with the provided email
        const user = await User.findOne({ email });
        
        if (!user || user.userType !== 'HiringManager') {
            return res.status(404).json({ message: 'Hiring Manager not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: '30m' } 
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            userType: user.userType,
            email: user.email,
            hm_id: user._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
