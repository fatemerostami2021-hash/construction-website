const { processImage } = require('../utils/imageProcessor');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await processImage(req.file.buffer, req.file.mimetype, req.file.originalname);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};
