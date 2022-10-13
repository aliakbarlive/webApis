const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const parseDataUri = require('parse-data-uri');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

const getPropertyFromDataUri = (propertyName, dataUri) => {
  const header = dataUri.substring(0, dataUri.indexOf(','));
  const part = header.split(';').find((p) => p.startsWith(`${propertyName}=`));

  return part
    ? decodeURIComponent(part.substring(propertyName.length + 1))
    : null;
};

const parseDataUriWithName = (dataUri) => {
  const file = parseDataUri(dataUri);
  file.name = getPropertyFromDataUri('name', dataUri) || 'unnamed';
  return file;
};

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

const getInstance = () => {
  const {
    AWS_ACCESS_KEY_ID: accessKeyId,
    AWS_SECRET_ACCESS_KEY: secretAccessKey,
    AWS_REGION: region,
  } = process.env;

  const s3Configuration = {
    credentials: { accessKeyId, secretAccessKey },
    region,
  };

  return new S3Client(s3Configuration);
};

const getFile = async ({ key }) => {
  const s3 = getInstance();
  const bucket = process.env.AWS_BUCKET;
  try {
    // Create the presigned URL.
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      {
        expiresIn: 300, // 5 minutes per generated path for the file
      }
    );
    return signedUrl;
  } catch (err) {
    console.log('Error getting the object: ', err);
  }
};

const uploadFile = async ({ key, body }) => {
  const s3 = getInstance();
  const bucket = process.env.AWS_BUCKET;
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
      })
    );
  } catch (err) {
    console.log('Error putting object: ', err);
  }
};

const deleteFile = async ({ key }) => {
  const s3 = getInstance();
  const bucket = process.env.AWS_BUCKET;
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
  } catch (err) {
    console.log('Error deleting object: ', err);
  }
};

module.exports = {
  getFile,
  uploadFile,
  deleteFile,
  parseDataUriWithName,
};
