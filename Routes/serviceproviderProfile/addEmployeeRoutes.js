import express from 'express';
import { addEmployee } from '../../Controllers/serviceProvider/addEmployee.js';
import { authenticateToken } from '../../middlewares/verifyToken.js'; 

const router = express.Router();

router.post('/add-employee', authenticateToken, addEmployee);

export default router;
