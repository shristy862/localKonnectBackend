import { Router } from 'express';
import { loginCandidate } from '../Controllers/loginController.js';
import { getCandidateDashboard } from '../Controllers/dashboardController.js';
import { authenticateToken } from '../../../Middleware/verifyToken.js';
import  personalDetailsRoutes from './personalDetailsRoutes.js'; 
import educationRoutes from './educationDetailsRoute.js';
import careerObjectiveRoutes from './careerObjectiveRoutes.js'; 
import workExperienceRoutes from './workExpRoutes.js';

const router = Router();

// Route for login 
router.post('/login' , loginCandidate);

// Route for dashboard
router.get('/dashboard', authenticateToken, getCandidateDashboard);

// Personal details route
router.use('/complete-profile', personalDetailsRoutes);

// Education details route
router.use('/complete-profile', educationRoutes);

// CareerObjective  route
router.use('/complete-profile', careerObjectiveRoutes);

router.use('/complete-profile', workExperienceRoutes);

export default router;
