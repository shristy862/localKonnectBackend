import User from '../../../../EasyjobBackend/userModal/Modal/modal.js';

export const superAdminDashboard = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User ID is missing in the request' });
        }

        const user = await User.findById(req.user.id).select('email userType name'); 

        if (!user || user.userType !== 'superadmin') {
            return res.status(404).json({ message: 'SuperAdmin not found or invalid user type' });
        }

        res.status(200).json({
            message: `Welcome, ${user.userType}!`,
            credentials: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
