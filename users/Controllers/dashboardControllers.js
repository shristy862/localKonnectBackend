export const superAdminDashboard = (req, res) => {
    const { email, userType } = req.user; 

    if (userType !== 'SuperAdmin') {
        return res.status(403).json({ message: 'Access denied. Only Super Admins are allowed.' });
    }

    res.status(200).json({
        message: 'Welcome to the Super Admin Dashboard',
        adminInfo: {
            email,
            userType,
        },
    });
};