import express from 'express';
import { userDashboard ,uploadProfilePicture } from '../Controllers/userControllers.js';
import { authenticateToken } from '../middlewares/verifyToken.js';

const router = express.Router();
// Route for Super Admin Dashboard
router.get('/dashboard', authenticateToken, userDashboard);
// Define the route for uploading the profile picture
router.post('/upload-profile-picture', uploadProfilePicture);

export default router;
