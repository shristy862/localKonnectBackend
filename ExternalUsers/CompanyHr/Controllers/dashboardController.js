import User from '../../../userModal/Modal/modal.js';

export const getCompanyDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('email userType'); 

        if (!user || user.userType !== 'company') {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({
            message: `Welcome ${user.userType}!`,
            company: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
