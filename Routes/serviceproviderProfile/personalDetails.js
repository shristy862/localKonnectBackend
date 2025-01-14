import express from 'express';
import { addPersonalDetails, editPersonalDetails , getPersonalDetails, deletePersonalDetails} from '../../Controllers/serviceProviderProfile/personalDetailsController.js';

import {authenticateToken} from '../../middlewares/verifyToken.js';
const router = express.Router();

// Route to add personal details with file upload to S3
router.post('/add', authenticateToken, addPersonalDetails);

// Route to edit personal details
router.put('/edit', authenticateToken, editPersonalDetails);

// Route to get personal details
router.get('/view', authenticateToken, getPersonalDetails);

// Route to delete personal details
router.delete('/delete', authenticateToken, deletePersonalDetails);

export default router;
