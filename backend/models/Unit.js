const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  area: Number,
  price: Number,
  rooms: Number,
  floor: Number,
  description: String,
  features: [String],
  images: [{ url: String, alt: String }],
  status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
  published: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);
