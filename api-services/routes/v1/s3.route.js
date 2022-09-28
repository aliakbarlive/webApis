const express = require('express');
const router = express.Router();
const os = require('os');

const multer = require('multer');
const upload = multer({ dest: os.tmpdir() });

const { getFile, uploadFile, deleteFile } = require('../../controllers/s3');

const { protect } = require('../../middleware/auth.js');

router.get('/files', protect, getFile);
router.post('/files', protect, upload.single('file'), uploadFile);
router.delete('/files', protect, deleteFile);

module.exports = router;
