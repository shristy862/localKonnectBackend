import { S3 } from '@aws-sdk/client-s3';
import multer from 'multer';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer configuration
const uploadToS3 = multer({
  storage: multer.memoryStorage(), // Store file in memory before uploading to S3
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('govtId');

const uploadFile = async (file) => {
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `govtId/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ACL: 'public-read', // Set this to 'private' if the file should not be public
  };

  const parallelUpload = new Upload({
    client: s3,
    params: uploadParams,
  });

  await parallelUpload.done();
};

export { uploadToS3, uploadFile };
