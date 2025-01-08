import bcrypt from 'bcryptjs';
import User from '../../../userModal/Modal/modal.js';

export const addPlatformJrHr = async (req, res) => {
    try {
        const { platformsuperhrid } = req.params; 
        console.log('PlatformSuperHRId from params =>', platformsuperhrid); 

        // Extract user 
        const { name, email, password, userType } = req.body; 

        if (userType !== 'platformJrHr') {
            return res.status(400).json({ message: 'Invalid userType. Only "platformJrHr" can be added.' });
        }

        const platformSuperHR = await User.findById(platformsuperhrid).select('userType');
        if (!platformSuperHR || platformSuperHR.userType !== 'platformSuperHR') {
            return res.status(403).json({ message: 'Access denied. Only PlatformSuperHR can add PlatformJrHr.' });
        }

        const existingJrHR = await User.findOne({ email });
        if (existingJrHR) {
            return res.status(400).json({ message: 'A PlatformJrHr with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const platformJrHR = new User({
            name,
            email,
            password: hashedPassword,
            userType: 'platformJrHr',
            addedBy: platformsuperhrid,  
        });

        await platformJrHR.save();

        // Respond with success message
        res.status(201).json({
            message: 'PlatformJrHr created successfully',
            platformJrHr: {
                id: platformJrHR._id,
                name: platformJrHR.name,
                email: platformJrHR.email,
                userType: platformJrHR.userType
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
