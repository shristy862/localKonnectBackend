import express from 'express';
import { authenticateToken } from '../../middlewares/verifyToken.js';
import {createTeam} from '../../Controllers/team/createTeam.js';

const router = express.Router();
// create a team
router.post('/create-team', authenticateToken ,createTeam);
export default router;
