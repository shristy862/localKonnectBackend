import { Router } from 'express';
import { addCareerObjective } from '../Controllers/careerObjective/addCareerObjective.js';
import { authenticateToken } from '../../../Middleware/verifyToken.js';
import {getCareerObjective} from '../Controllers/careerObjective/getCareerObjective.js'
import { deleteCareerObjective } from '../Controllers/careerObjective/deleteCareerObjective.js';
import { updateCareerObjective } from '../Controllers/careerObjective/updateCareerObjective.js';

const router = Router();

// Route for updating career objective
router.put(
    '/:id/career-objective',
    authenticateToken,
    addCareerObjective
);
//  Route for viewing career objective
router.get(
    '/:id/career-objective/view',
    authenticateToken,
    getCareerObjective
);
// Route for deleting career objective
router.delete(
    '/:id/career-objective/delete',
    authenticateToken,
    deleteCareerObjective
);
// Route for updating career objective
router.put(
    '/:id/career-objective/update',
    authenticateToken,
    updateCareerObjective
);

export default router;
