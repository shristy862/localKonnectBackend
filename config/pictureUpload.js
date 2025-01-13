import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();


// Configure AWS S3 credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Log to verify the bucket name
console.log('S3 Bucket Name:', process.env.AWS_S3_BUCKET_NAME);

// Set up multer storage engine with S3 (no ACL since your bucket doesn't allow them)
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Unique filename in S3
      cb(null, `profile-pics/${Date.now().toString()}-${file.originalname}`);
    },
  }),
});
export default upload;