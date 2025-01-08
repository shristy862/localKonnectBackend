import express from 'express';
import { loginPlatformSuperHR } from '../Controllers/LoginController.js';
import { platformSuperHRDashboard } from '../Controllers/dashboardController.js'
import { addPlatformJrHr } from '../Controllers/addJrPaltformHRController.js';
import { authenticateToken } from '../../../middlewares/verifyToken.js';

const router = express.Router();

// PlatformSuperHR login route
router.post('/login', loginPlatformSuperHR);

// PlatformSuperHR dashboard route
router.get('/dashboard', authenticateToken, platformSuperHRDashboard);

// Route for PlatformSuperHR to add PlatformJrHr
router.post('/:platformsuperhrid/addplatformjrHR', authenticateToken, addPlatformJrHr);

export default router;
