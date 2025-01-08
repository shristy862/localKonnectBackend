import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import User from '../../../userModal/Modal/modal.js';

export const loginCandidate = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user || user.userType !== 'candidate') {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token 
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: '30m' } 
        );

        res.status(200).json({
            message: 'Login Successful',
            token,
            userId: user._id,
            userType: user.userType
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};