import jwt from 'jsonwebtoken';

export const loginUsers = (req, res) => {
    const { email, password, userType } = req.body;

    // Hardcoded credentials for Super Admin
    const superAdminEmail = 'admin@example.com';
    const superAdminPassword = 'admin1234';
    const requiredUserType = 'SuperAdmin';

    // Validate credentials
    if (email === superAdminEmail && password === superAdminPassword && userType === requiredUserType) {
        // Generate JWT token
        const token = jwt.sign(
            { email, userType }, // Payload
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiration
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
        });
    }

    return res.status(401).json({ message: 'Invalid credentials or unauthorized user type' });
};
