import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Log to verify the bucket name
console.log('S3 Bucket Name:', process.env.AWS_S3_BUCKET_NAME);

// Set up multer storage engine with S3 using custom function
const storage = multer.memoryStorage(); 
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
}).single('govtId');

// Upload to S3 manually using AWS SDK v3
const uploadToS3 = async (file, fileName) => {
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `id/${Date.now().toString()}-${fileName}`, 
    Body: file.buffer, 
    ContentType: file.mimetype, 
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command); 

  // Return the S3 URL
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
};

// Export multer and S3 upload function
export { upload, uploadToS3 };
