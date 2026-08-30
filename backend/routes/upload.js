const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'فایلی آپلود نشد' });
  const url = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url,
    thumbnail: { url, width: 300, height: 200 },
    medium: { url, width: 800, height: 600 },
    large: { url, width: 1200, height: 800 }
  });
});

module.exports = router;
