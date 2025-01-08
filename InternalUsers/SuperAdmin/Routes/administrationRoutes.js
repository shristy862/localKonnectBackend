import express from 'express';
import { createSuperAdmin } from '../Controllers/createSuperAdmin.js';
import { verifySecurityCode } from '../../../Middleware/verifySecurityCode.js';
import { loginSuperAdmin } from '../Controllers/loginController.js';
import { authenticateToken } from '../../../Middleware/verifyToken.js';
import { superAdminDashboard } from '../Controllers/dashboardController.js';
import { addHR } from '../Controllers/addplatformHRController.js';
import { addAccountant } from '../Controllers/addAccountant.js';
import { addUser } from '../Controllers/addUser.js';
const router = express.Router();
// Route for creating superAdmin
router.post('/create-superadmin', verifySecurityCode, createSuperAdmin);
// Route for SuperAdmin login 
router.post('/login-superadmin', loginSuperAdmin);
// Route for SuperAdmin Dashboard
router.get('/superadmin/dashboard', authenticateToken, superAdminDashboard);
//  Route for adding platformSuperHr
router.post('/:superAdminId/addHR', authenticateToken, addHR);
// Route for adding an accountant by superadmin
router.post('/:superAdminId/addAccountant', authenticateToken, addAccountant);
// Route for adding a user by admin or superadmin
router.post('/:adminId/addUser', authenticateToken, addUser);

export default router;
