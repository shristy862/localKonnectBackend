import { upload, uploadToS3 } from '../config/idUpload.js';
import Image from './image.js';

export const uploadImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided!' });
    }

    try {
      // Upload file to S3
      const s3Url = await uploadToS3(req.file, req.file.originalname);

      // Save URL to the database
      const image = new Image({ url: s3Url });
      await image.save();

      return res.status(201).json({
        message: 'Image uploaded successfully!',
        imageUrl: s3Url,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to upload image to S3.' });
    }
  });
};
