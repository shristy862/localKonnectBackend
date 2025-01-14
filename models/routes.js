import express from 'express';
import { uploadImage } from './uploadimage.js';

const router = express.Router();

// Route for uploading an image
router.post('/', uploadImage);

export default router;
