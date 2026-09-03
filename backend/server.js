const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const authController = require('./controllers/authController');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/units', require('./routes/units'));
app.use('/api/translations', require('./routes/translations'));
app.use('/api/upload', require('./routes/upload'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/construction-website')
  .then(() => {
    console.log('✅ MongoDB Connected');
    authController.seedAdmin();
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'خطای سرور' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
