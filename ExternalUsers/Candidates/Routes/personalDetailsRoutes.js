import { Router } from 'express';
import { updatePersonalDetails } from '../Controllers/personalDetailsOperations/updatePersonalDetails.js';
import {getPersonalDetails} from '../Controllers/personalDetailsOperations/getPersonalDetails.js'
import { deletePersonalDetails} from '../Controllers/personalDetailsOperations/deletePersonalDetails.js'
import { authenticateToken } from '../../../Middleware/verifyToken.js';
import { upload } from '../../../Connections/uploadConfig.js';

const router = Router();

// Route for updating personal details
router.post(
    '/:id/personalDetails', 
    upload, 
    authenticateToken,
    updatePersonalDetails 
);
// Route for getting personal details
router.get('/:id/personal-details/view', authenticateToken, getPersonalDetails);

// Route for deleting personal details
router.delete('/:id/personal-details/delete', authenticateToken, deletePersonalDetails);

export default router;
