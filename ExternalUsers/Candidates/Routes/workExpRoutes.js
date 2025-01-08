import { Router } from 'express';
import { addWorkExperience } from '../Controllers/workExperience/addWorkExp.js';
import { authenticateToken } from '../../../Middleware/verifyToken.js';
import { getWorkExperience } from '../Controllers/workExperience/getWorkExperience.js';
import { updateWorkExperience } from '../Controllers/workExperience/updateWorkExp.js';
import { deleteWorkExperience } from '../Controllers/workExperience/deleteWorkExp.js';
const router = Router();

// Route for adding work experience
router.post('/:candidateId/work-experience/add', authenticateToken, addWorkExperience);
// Route for viewing work experience
router.get('/:candidateId/work-experience/view', authenticateToken, getWorkExperience);
// Route to update work experience
router.put('/:candidateId/work-experience/update', authenticateToken, updateWorkExperience); 
// Delete work experience route
router.delete('/:candidateId/work-experience/delete', authenticateToken, deleteWorkExperience);
export default router;
