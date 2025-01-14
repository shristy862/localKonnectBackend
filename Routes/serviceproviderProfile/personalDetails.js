import express from 'express';
import { addPersonalDetails, editPersonalDetails } from '../../Controllers/serviceProviderProfile/personalDetailsController.js';

import {authenticateToken} from '../../middlewares/verifyToken.js';
const router = express.Router();

// Route to add personal details with file upload to S3
router.post('/add', authenticateToken, addPersonalDetails);

// Route to edit personal details
router.put('/edit', authenticateToken, editPersonalDetails);
export default router;
