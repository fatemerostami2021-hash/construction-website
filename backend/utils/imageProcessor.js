const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const processImage = async (inputPath, filename) => {
  const id = uuidv4();
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  
  const sizes = {
    thumbnail: { width: 300, height: 200, fit: 'cover' },
    medium: { width: 800, height: 600, fit: 'inside' },
    large: { width: 1600, height: 1200, fit: 'inside' }
  };

  const results = {};

  for (const [sizeName, options] of Object.entries(sizes)) {
    const outputFilename = `${id}_${sizeName}.webp`;
    const outputPath = path.join(uploadDir, outputFilename);
    
    await sharp(inputPath)
      .resize(options.width, options.height, { fit: options.fit, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const metadata = await sharp(outputPath).metadata();
    results[sizeName] = {
      url: `/uploads/${outputFilename}`,
      width: metadata.width,
      height: metadata.height
    };
  }

  // Delete original uploaded file
  await fs.unlink(inputPath);

  return {
    id,
    original: filename,
    ...results
  };
};

module.exports = { processImage };
