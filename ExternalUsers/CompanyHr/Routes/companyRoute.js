import express from 'express';
import { loginCompany } from '../../../../EasyjobBackend/ExternalUsers/CompanyHr/Controllers/loginController.js'; 
import { getCompanyDashboard } from '../../../../EasyjobBackend/ExternalUsers/CompanyHr/Controllers/dashboardController.js'; 
import { authenticateToken } from '../../../../EasyjobBackend/Middleware/verifyToken.js';
import { completeCompanyProfile } from '../../../../EasyjobBackend/ExternalUsers/CompanyHr/Controllers/profileController.js';

const router = express.Router();

// Route to login
router.post('/login', loginCompany);
// Route to dashboard
router.get('/dashboard', authenticateToken, getCompanyDashboard);
// Route to complete profile
router.put('/dashboard/:id/complete-profile',authenticateToken, completeCompanyProfile);

export default router;
