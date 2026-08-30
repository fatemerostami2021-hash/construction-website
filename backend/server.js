const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const authController = require('./controllers/authController');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/units', require('./routes/units'));
app.use('/api/translations', require('./routes/translations'));
app.use('/api/upload', require('./routes/upload'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/construction-website')
  .then(() => {
    console.log('✅ MongoDB Connected');
    authController.seedAdmin();
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'خطای سرور' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
