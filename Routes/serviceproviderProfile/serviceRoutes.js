// routes/serviceRoutes.js
import express from 'express';
import { getServices, getServiceById, createService, updateService, deleteService } from '../../Controllers/serviceProvider/serviceController.js';
import {authenticateToken} from '../../middlewares/verifyToken.js';

const router = express.Router();

// Get all services
router.get('/', authenticateToken, getServices);

// Get a single service by ID
router.get('/:id', authenticateToken, getServiceById);

// Create a new service
router.post('/', authenticateToken, createService);

// Update a service by ID
router.put('/:id', authenticateToken, updateService);

// Delete a service by ID
router.delete('/:id', authenticateToken, deleteService);

export default router;
