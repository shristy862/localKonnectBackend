import express from 'express';
import { userDashboard ,uploadProfilePicture, getProfilePicture, editProfilePicture , deleteProfilePicture } from '../Controllers/userControllers.js';
import { authenticateToken } from '../middlewares/verifyToken.js';
import {upload} from '../config/pictureUpload.js';
const router = express.Router();

// Route for Super Admin Dashboard
router.get('/dashboard', authenticateToken, userDashboard);

// Route for uploading the profile picture
router.post('/upload-picture', authenticateToken, upload, uploadProfilePicture);

// Route to get the profile picture of a user
router.get('/get-picture', authenticateToken, getProfilePicture);

// Route for editing profile picture
router.put('/edit-picture', authenticateToken, upload, editProfilePicture);

// Route to delete the profile picture from the database
router.delete('/delete-picture', authenticateToken, deleteProfilePicture);

export default router;
