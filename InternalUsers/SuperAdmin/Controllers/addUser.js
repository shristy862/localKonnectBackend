import bcrypt from 'bcryptjs';
import User from '../../../../EasyjobBackend/userModal/Modal/modal.js';

export const addUser = async (req, res) => {
    try {
        const { adminId } = req.params; // ID of the admin or superadmin adding the user
        const { name, email, password } = req.body;

        // Check if the requesting user is an admin or superadmin
        const admin = await User.findById(adminId).select('userType');
        if (!admin || (admin.userType !== 'admin' && admin.userType !== 'superadmin')) {
            return res.status(403).json({ message: 'Access denied. Only Admin or SuperAdmin can add a user.' });
        }

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userType: 'user', // Default userType is 'user'
            addedBy: adminId,
        });

        await newUser.save();

        // Return success response
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                userType: newUser.userType,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
