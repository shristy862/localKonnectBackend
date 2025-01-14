import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3 = new S3Client({ region: 'your-region' });

export const uploadToS3 = async (file, fileName, folder) => {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: 'your-bucket-name',
      Key: `${folder}/${fileName}`,
      Body: file.buffer, // Make sure you're passing the file's buffer here
      ContentType: file.mimetype,
    },
  });

  try {
    const result = await upload.done();
    return result.Location; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
