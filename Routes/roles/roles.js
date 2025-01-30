import express from 'express';
import { authenticateToken } from '../../middlewares/verifyToken.js';
import { createRole, getAllRoles, updateRole, deleteRole, blockUser, unblockUser, getAllUsers } from '../../Controllers/roles/roles.js';
import {createTeam} from '../../Controllers/roles/createTeam.js'

const router = express.Router();

// Create a new role
router.post('/', authenticateToken, createRole);

// Get all roles
router.get('/', authenticateToken, getAllRoles);

// Update a role by ID
router.put('/:roleId', authenticateToken, updateRole);

// Delete a role by ID
router.delete('/:roleId', authenticateToken, deleteRole);

// Block a user by ID (if role has block_users permission)
router.put('/:userId/block', authenticateToken, blockUser);

// Unblock a user by ID (if role has unblock_users permission)
router.put('/:userId/unblock', authenticateToken, unblockUser);

// Get all users (if role has view_users permission)
router.get('/users', authenticateToken, getAllUsers);

// create a team
router.post('/create-team', authenticateToken ,createTeam);
export default router;
