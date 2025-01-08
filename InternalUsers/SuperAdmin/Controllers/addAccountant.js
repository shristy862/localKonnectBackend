import bcrypt from 'bcryptjs';
import User from '../../../../EasyjobBackend/userModal/Modal/modal.js';

export const addAccountant = async (req, res) => {
    try {
        const { superAdminId } = req.params;
        const { name, email, password } = req.body;

        // Check if the requesting user is a superadmin
        const superAdmin = await User.findById(superAdminId).select('userType');
        if (!superAdmin || superAdmin.userType !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Only SuperAdmin can add an Accountant.' });
        }

        // Check if an accountant with the given email already exists
        const existingAccountant = await User.findOne({ email });
        if (existingAccountant) {
            return res.status(400).json({ message: 'An accountant with this email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the accountant
        const accountant = new User({
            name,
            email,
            password: hashedPassword,
            rawPassword: password, // Save the raw password temporarily
            userType: 'accountant',
            addedBy: superAdminId,
        });

        await accountant.save();

        // Return success response
        res.status(201).json({
            message: 'Accountant created successfully',
            accountant: {
                id: accountant._id,
                name: accountant.name,
                email: accountant.email,
                userType: accountant.userType,
                rawPassword: accountant.rawPassword, // Return the raw password in the response
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
