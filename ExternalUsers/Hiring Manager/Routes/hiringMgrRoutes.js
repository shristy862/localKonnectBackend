import express from 'express';
import { addHiringManager } from '../../../../EasyjobBackend/ExternalUsers/Hiring Manager/Controllers/addHiringManagerController.js';
import { loginHiringManager } from '../../../../EasyjobBackend/ExternalUsers/Hiring Manager/Controllers/LoginControllers.js';
import { getDashboard } from '../../../../EasyjobBackend/ExternalUsers/Hiring Manager/Controllers/DashboardControllers.js';  
import { authenticateToken } from '../../../../EasyjobBackend/Middleware/verifyToken.js';
import { postJob } from '../../../../EasyjobBackend/ExternalUsers/Hiring Manager/Controllers/JobController.js';

const router = express.Router();

// Route for adding HM
router.post('/:companyId/add', authenticateToken, addHiringManager);
// Route for HM login
router.post('/login', loginHiringManager);
// Route forDashboard
router.get('/dashboard', authenticateToken, getDashboard); 
// Route for post Jobs
router.post('/:id/jobs', authenticateToken, postJob);
export default router;
