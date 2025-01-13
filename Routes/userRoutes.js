import express from 'express';
import { userDashboard ,uploadProfilePicture } from '../Controllers/userControllers.js';
import { authenticateToken } from '../middlewares/verifyToken.js';
import upload from '../config/pictureUpload.js';
const router = express.Router();

// Route for Super Admin Dashboard
router.get('/dashboard', authenticateToken, userDashboard);

//Route for uploading the profile picture
router.post('/upload-picture', upload.single('profilePic'),authenticateToken, uploadProfilePicture);

export default router;
