const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  lang: { type: String, required: true, enum: ['fa', 'en', 'ar', 'tr'] },
  value: { type: String, required: true }
}, { timestamps: true });

translationSchema.index({ key: 1, lang: 1 }, { unique: true });

module.exports = mongoose.model('Translation', translationSchema);
