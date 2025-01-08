import User from '../../../userModal/Modal/modal.js';
import jwt from 'jsonwebtoken';

export const getDashboard = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by decoded ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with user data
        res.status(200).json({
            message: 'Welcome to your Dashboard',
            userType: user.userType,
            email: user.email,
            userId: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token or not authorized' });
    }
};
