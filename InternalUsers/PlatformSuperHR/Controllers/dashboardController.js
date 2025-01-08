import User from '../../../userModal/Modal/modal.js';

export const platformSuperHRDashboard = async (req, res) => {
    try {
        // Extract user data from the verified token
        const { id, userType, email } = req.user;

        // Verify the userType 
        if (userType !== 'platformSuperHR') {
            return res.status(403).json({ message: 'Access denied. Not authorized as PlatformSuperHR.' });
        }

        const user = await User.findById(id).select('email userType');
        if (!user) {
            return res.status(404).json({ message: 'PlatformSuperHR user not found' });
        }
        
        res.status(200).json({
            message: `Welcome, ${user.userType}!`,
            credentials: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
