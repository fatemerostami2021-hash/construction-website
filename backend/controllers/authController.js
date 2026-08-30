const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
    
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.seedAdmin = async () => {
  try {
    const exists = await User.findOne({ username: 'fatemeh' });
    if (!exists) {
      await User.create({ username: 'fatemeh', password: 'pass987', role: 'admin' });
      console.log('✅ Admin user created: fatemeh / pass987');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};
