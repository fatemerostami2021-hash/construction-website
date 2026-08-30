const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  metaTitle: String,
  metaDescription: String,
  summary: String,
  description: String,
  location: String,
  status: { type: String, enum: ['foundation', 'skeleton', 'finishing', 'delivered'], default: 'foundation' },
  type: { type: String, enum: ['residential', 'commercial', 'industrial'], default: 'residential' },
  propertyType: { type: String, enum: ['villa', 'apartment'], default: 'apartment' },
  featuredImage: String,
  phases: [{
    title: String,
    description: String,
    images: [{ url: String, alt: String, width: Number, height: Number }],
    videos: [{ url: String, thumbnail: String }],
    date: Date,
    order: Number
  }],
  units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }],
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
