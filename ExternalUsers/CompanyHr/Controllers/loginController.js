import bcrypt from 'bcryptjs';
import User from '../../../userModal/Modal/modal.js';  
import jwt from 'jsonwebtoken';

export const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user || user.userType !== 'company') {
            return res.status(404).json({ message: 'Company not found' });
        }

        // console.log('Received Password:', password);
        // console.log('Stored Hashed Password:', user.password);
        
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
