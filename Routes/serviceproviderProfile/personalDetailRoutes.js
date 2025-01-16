import express from 'express';
import { upload } from '../../config/idProofUpload.js'; 
import {
  addPersonalDetails,
  editPersonalDetails,
  getPersonalDetails,
  deletePersonalDetailsById
} from '../../Controllers/serviceProvider/personalDetails.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';
const router = express.Router();

// Route to add personal details with file upload
router.post('/', upload,authenticateToken, addPersonalDetails);

// Route to edit personal details by ID with optional file upload
router.put('/:id', upload,authenticateToken, editPersonalDetails);

// Route to get personal details 
router.get('/', authenticateToken,getPersonalDetails);

// Route to delete personal details by ID
router.delete('/:id',authenticateToken, deletePersonalDetailsById);


export default router;
