const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
  try {
    const { status, type, location, page = 1, limit = 10, published } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, 'i');
    if (published !== undefined) filter.published = published === 'true';
    
    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('units', 'title slug area price status'),
      Project.countDocuments(filter)
    ]);
    
    res.json({ success: true, data: projects, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate('units', 'title slug area price status');
    if (!project) return res.status(404).json({ message: 'پروژه یافت نشد' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: 'پروژه یافت نشد' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'پروژه یافت نشد' });
    res.json({ success: true, message: 'پروژه حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
