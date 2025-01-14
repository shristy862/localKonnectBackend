import express from 'express';
import { addPersonalDetails,getImage, editPersonalDetails , getPersonalDetails, deletePersonalDetails} from '../../Controllers/serviceProvider/personalDetailsController.js';
import { upload } from '../../config/idUpload.js';
import {authenticateToken} from '../../middlewares/verifyToken.js';

const router = express.Router();

// Route to add personal details with file upload to S3
router.post('/add', authenticateToken,upload, addPersonalDetails);

// Route to edit personal details
router.put('/edit', authenticateToken,  upload, editPersonalDetails);

// Route to get personal details
router.get('/view', authenticateToken, getPersonalDetails);

// Route to fetch the image by userId
router.get('/fetch-image', authenticateToken,getImage);

// Route to delete personal details
router.delete('/delete', authenticateToken, deletePersonalDetails);

export default router;
