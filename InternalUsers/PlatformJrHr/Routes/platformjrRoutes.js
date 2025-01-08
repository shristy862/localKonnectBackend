import express from 'express';
import { loginPlatformJrHr } from '../../../../EasyjobBackend/InternalUsers/PlatformJrHr/Controllers/loginController.js';
import { authenticateToken } from '../../../../EasyjobBackend/Middleware/verifyToken.js';
import { platformJrHrDashboard } from '../../../../EasyjobBackend/InternalUsers/PlatformJrHr/Controllers/dashboardController.js';
const router = express.Router();

// Route for PlatformJrHr login
router.post('/login', loginPlatformJrHr);
// Route for PlatformJrHr dashboard (with authentication)
router.get('/dashboard', authenticateToken, platformJrHrDashboard);

export default router;
