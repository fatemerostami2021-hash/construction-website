const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
