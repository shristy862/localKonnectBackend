import bcrypt from 'bcryptjs';
import User from '../../../../EasyjobBackend/userModal/Modal/modal.js';

export const addHR = async (req, res) => {
    try {
        const { superAdminId } = req.params;
        console.log('SuperAdminId from params =>', superAdminId); // Debugging line
        const { name, email, password } = req.body; 

        // Check if the requesting user is a superadmin
        const superAdmin = await User.findById(superAdminId).select('userType');
        if (!superAdmin || superAdmin.userType !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Only SuperAdmin can add PlatformHR.' });
        }

        // Check if a PlatformHR already exists 
        const existingHR = await User.findOne({ email });
        if (existingHR) {
            return res.status(400).json({ message: 'A PlatformSuperHR with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const hr = new User({
            name,
            email,
            password: hashedPassword,
            rawPassword: password, // Save the raw password temporarily
            userType: 'HR',
            addedBy: superAdminId,
        });

        await hr.save();

        res.status(201).json({
            message: 'HR created successfully',
            platformHR: {
                id: hr._id,
                name: hr.name,
                email: hr.email,
                userType: hr.userType,
                rawPassword: hr.rawPassword, // Return the raw password in the response
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
