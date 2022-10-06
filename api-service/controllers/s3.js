const fs = require('fs');

const asyncHandler = require('../middleware/async');

const s3Service = require('../services/s3.service');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

// @desc     Upload File to S3
// @route    GET /api/v1/s3/get
// @route    POST /api/v1/s3/get
// @access   Private
exports.getFile = asyncHandler(async (req, res, next) => {
  const { path } = req.query;

  let data = {};
  if (path) {
    data = await s3Service.getFile({ key: path });
  }

  res.status(200).json({
    success: true,
    data,
  });
});

// @desc     Upload File to S3
// @route    POST /api/v1/s3/upload
// @access   Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  const { folder } = req.body;
  const temp = req.file;
  const { originalname, path, filename, size } = temp;
  const arrName = originalname.split('.');
  const ext = arrName[arrName.length - 1];
  let response = {
    success: false,
  };

  // * allow upload files lesser than or equal to 5MB
  if (size <= process.env.S3_LIMIT_SIZE) {
    try {
      const body = fs.readFileSync(path);
      const key = `${folder}/${filename}.${ext}`;

      await s3Service.uploadFile({
        key,
        body,
      });

      response = {
        success: true,
        data: {
          originalName: originalname,
          fileName: `${filename}.${ext}`,
        },
      };
    } catch (err) {
      response.error = err;
    }
  } else {
    response.error = 'Maximum size allowed: 5MB';
  }

  res.status(200).json(response);
});

// @desc     Delete File on S3
// @route    POST /api/v1/s3/delete
// @access   Private
exports.deleteFile = asyncHandler(async (req, res, next) => {
  const { path } = req.query;

  let response = { success: false };

  if (path) {
    await s3Service.deleteFile({ key: path });
    response.success = true;
  }

  res.status(200).json(response);
});
