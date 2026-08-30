const Translation = require('../models/Translation');

exports.getTranslations = async (req, res) => {
  try {
    const translations = await Translation.find();
    const grouped = translations.reduce((acc, t) => {
      if (!acc[t.key]) acc[t.key] = {};
      acc[t.key][t.lang] = t.value;
      return acc;
    }, {});
    res.json({ success: true, data: grouped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getByLang = async (req, res) => {
  try {
    const translations = await Translation.find({ lang: req.params.lang });
    const mapped = translations.reduce((acc, t) => { acc[t.key] = t.value; return acc; }, {});
    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTranslation = async (req, res) => {
  try {
    const { key, lang, value } = req.body;
    const existing = await Translation.findOne({ key, lang });
    if (existing) return res.status(400).json({ message: 'این ترجمه قبلاً ثبت شده' });
    const translation = await Translation.create({ key, lang, value });
    res.status(201).json({ success: true, data: translation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTranslation = async (req, res) => {
  try {
    const translation = await Translation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!translation) return res.status(404).json({ message: 'ترجمه یافت نشد' });
    res.json({ success: true, data: translation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTranslation = async (req, res) => {
  try {
    const translation = await Translation.findByIdAndDelete(req.params.id);
    if (!translation) return res.status(404).json({ message: 'ترجمه یافت نشد' });
    res.json({ success: true, message: 'ترجمه حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
