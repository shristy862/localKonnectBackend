import express from 'express';
import { addMultipleServices, editService, viewServices ,deleteService } from '../../Controllers/serviceProvider/serviceController.js';
import { authenticateToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add-multiple', authenticateToken, addMultipleServices);

// Edit a service by service ID
router.put('/editService', authenticateToken,editService);

// Route to view services
router.get('/viewServices', authenticateToken, viewServices);

// Route to delete services
router.delete('/deleteServices/:serviceId', authenticateToken, deleteService);

export default router;
