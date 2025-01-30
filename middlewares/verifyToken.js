import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        } 

        // Ensure `req.user` contains userPermissions
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            userPermissions: decoded.userPermissions || [] // Default to empty array if undefined
        }
        next();
    });
};
