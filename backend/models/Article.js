const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  metaTitle: String,
  metaDescription: String,
  excerpt: String,
  content: String,
  featuredImage: String,
  category: String,
  tags: [String],
  author: String,
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
