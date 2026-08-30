const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middleware/auth');

router.get('/', settingController.getSettings);
router.put('/', auth, settingController.updateSetting);

module.exports = router;
