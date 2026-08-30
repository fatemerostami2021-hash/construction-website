const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json(result);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value, group } = req.body;
    const setting = await Setting.findOneAndUpdate({ key }, { key, value, group }, { upsert: true, new: true });
    res.json(setting);
  } catch (error) { res.status(400).json({ message: error.message }); }
};
