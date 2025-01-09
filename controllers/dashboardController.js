import User from  '../models/user.js'

export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the dashboard data
        res.status(200).json({
            message: 'Dashboard data fetched successfully',
            user: {
                id: user._id,
                email: user.email,
                userType: user.userType,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};
