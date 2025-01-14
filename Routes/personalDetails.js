import express from 'express';
import { addPersonalDetails, editPersonalDetails, viewPersonalDetails, deletePersonalDetails } from '../Controllers/profile/personalDetailsController.js';
import {authenticateToken} from '../middlewares/verifyToken.js';
import multer from 'multer'; 

const upload = multer({ dest: 'uploads/' }); 
const router = express.Router();

// Route to add personal details
router.post('/add', upload.single('govtId'),authenticateToken, addPersonalDetails);

// Route to edit personal details
router.put('/edit', upload.single('govtId'), authenticateToken,editPersonalDetails);

router.get('/get', authenticateToken,viewPersonalDetails);

router.delete('/delete',authenticateToken, deletePersonalDetails);

export default router;
