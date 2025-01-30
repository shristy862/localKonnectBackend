import Role from '../../models/roles/role.js';
import User from '../../models/auth/user.js';
export const createRole = async (req, res) => {
    try {
        const { title, description, userPermissions } = req.body;
        const adminUser = req.user;

        if (!title || !description || !userPermissions || !Array.isArray(userPermissions)) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and userPermissions (as an array) are required.'
            });
        }

        if (adminUser.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only admin can create roles.'
            });
        }

        const newRole = new Role({
            title,
            description,
            userPermissions,
            createdBy: adminUser.id // Store admin ID
        });

        await newRole.save();

        return res.status(201).json({
            success: true,
            message: 'Role created successfully.',
            role: newRole
        });
    } catch (error) {
        console.error('Error creating role:', error.message);
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('createdBy', 'email');
        return res.status(200).json({ success: true, roles });
    } catch (error) {
        console.error('Error fetching roles:', error.message);
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { title, description, userPermissions } = req.body;

        const updatedRole = await Role.findByIdAndUpdate(roleId, {
            title,
            description,
            userPermissions
        }, { new: true });

        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: 'Role not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Role updated successfully.',
            role: updatedRole
        });
    } catch (error) {
        console.error('Error updating role:', error.message);
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const deletedRole = await Role.findByIdAndDelete(roleId);

        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: 'Role not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Role deleted successfully.'
        });
    } catch (error) {
        console.error('Error deleting role:', error.message);
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

export const blockUser = async (req, res) => {
    try {
        const { userId } = req.params; // User to be blocked
        const user = req.user; // Admin user (from token)

        // Step 1: Check if the admin has 'block_users' permission
        if (!user.userPermissions.includes('block_users')) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You do not have permission to block users.'
            });
        }

        // Step 2: Verify the target user exists in the database
        const userToBlock = await User.findById(userId);
        if (!userToBlock) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Step 3: Update the status of the user to 'blocked'
        userToBlock.status = 'blocked'; // Set status as 'blocked'
        await userToBlock.save(); // Save the updated user document

        // Step 4: Return a success response
        return res.status(200).json({
            success: true,
            message: 'User blocked successfully.'
        });
    } catch (error) {
        console.error('Error blocking user:', error.message);
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminUser = req.user;

        if (!adminUser.userPermissions.includes('unblock_users')) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You do not have permission to unblock users.'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.isBlocked = false;
        await user.save();

        return res.status(200).json({ success: true, message: 'User unblocked successfully.' });
    } catch (error) {
        console.error('Error unblocking user:', error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

export const getAllUsers = async (req, res) => {
    try { 

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user found in request."
            });
        }

        // Check if user is an Admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only Admins can access this route."
            });
        }

        if (!req.user.userPermissions || !Array.isArray(req.user.userPermissions)) {
            console.log("User Permissions Issue:", req.user.userPermissions); // Debugging line
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Missing or invalid user permissions."
            });
        }

        if (!req.user.userPermissions.includes('view_users')) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You do not have permission to view users."
            });
        }

        const users = await User.find().select('-password -rawPassword'); // Exclude sensitive fields
        return res.status(200).json({ success: true, users });

    } catch (error) {
        console.error("Error fetching users:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};
