const Article = require('../models/Article');

exports.getArticles = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10, published } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (published !== undefined) filter.published = published === 'true';
    
    const skip = (Number(page) - 1) * Number(limit);
    const [articles, total] = await Promise.all([
      Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Article.countDocuments(filter)
    ]);
    
    res.json({ success: true, data: articles, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true });
    if (!article) return res.status(404).json({ message: 'مقاله یافت نشد' });
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ message: 'مقاله یافت نشد' });
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'مقاله یافت نشد' });
    res.json({ success: true, message: 'مقاله حذف شد' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
