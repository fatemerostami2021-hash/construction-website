const Unit = require('../models/Unit');

exports.getUnits = async (req, res) => {
  try {
    const { project, minPrice, maxPrice, status } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const units = await Unit.find(filter).populate('project', 'title slug').sort({ createdAt: -1 });
    res.json({ success: true, count: units.length, data: units });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUnitBySlug = async (req, res) => {
  try {
    const unit = await Unit.findOne({ slug: req.params.slug }).populate('project', 'title slug location');
    if (!unit) return res.status(404).json({ message: 'واحد یافت نشد' });
    res.json({ success: true, data: unit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUnit = async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json({ success: true, data: unit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!unit) return res.status(404).json({ message: 'واحد یافت نشد' });
    res.json({ success: true, data: unit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) return res.status(404).json({ message: 'واحد یافت نشد' });
    res.json({ success: true, message: 'واحد حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
