const cloudinary = require('cloudinary').v2;

const processImage = async (fileBuffer, mimetype, originalName) => {
  const dataUri = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'construction-website',
    resource_type: 'image',
  });

  const publicId = result.public_id;

  const buildUrl = (width, height, crop) =>
    cloudinary.url(publicId, {
      width,
      height,
      crop,
      fetch_format: 'auto',
      quality: 'auto',
      secure: true,
    });

  return {
    id: publicId,
    original: originalName,
    thumbnail: { url: buildUrl(300, 200, 'fill'), width: 300, height: 200 },
    medium: { url: buildUrl(800, 600, 'limit'), width: 800, height: 600 },
    large: { url: buildUrl(1600, 1200, 'limit'), width: 1600, height: 1200 },
  };
};

module.exports = { processImage };
