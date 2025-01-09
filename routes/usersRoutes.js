import { Router } from 'express';
import { loginUser } from '../controllers/authControllers.js';
import { getDashboardData } from '../controllers/dashboardController.js';
import {  authenticateToken} from '../middlewares/verifyToken.js';
const router = Router();

// User Login Route
router.post('/login', loginUser);

//dashboard route
router.get('/dashboard', authenticateToken, getDashboardData);
export default router;
