const Contact = require('../models/Contact');

exports.createMessage = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    const contact = await Contact.create({ fullName, email, phone, subject, message });
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!message) return res.status(404).json({ message: 'پیام یافت نشد' });
    res.json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'پیام یافت نشد' });
    res.json({ success: true, message: 'پیام حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
