import express from 'express';
import {uploadProfilePicture, getProfilePicture, editProfilePicture , deleteProfilePicture } from '../../Controllers/serviceProvider/profilePicController.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';
import {upload} from '../../config/pictureUpload.js';

const router = express.Router();

// Route for uploading the profile picture
router.post('/upload-picture', authenticateToken, upload, uploadProfilePicture);

// Route to get the profile picture of a user
router.get('/get-picture/:pictureId', authenticateToken, getProfilePicture);

// Route for editing profile picture
router.put('/edit-picture', authenticateToken, upload, editProfilePicture);

// Route to delete the profile picture from the database
router.delete('/delete-picture', authenticateToken, deleteProfilePicture);

export default router;