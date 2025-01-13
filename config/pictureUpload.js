import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

// Configure AWS S3 credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Set up multer storage engine with S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read', // The file will be publicly accessible
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      // Unique filename in S3
      cb(null, `profile-pics/${Date.now().toString()}-${file.originalname}`);
    },
  }),
});
