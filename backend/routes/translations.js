const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');
const auth = require('../middleware/auth');

router.get('/', translationController.getTranslations);
router.get('/:lang', translationController.getByLang);
router.post('/', auth, translationController.createTranslation);
router.put('/:id', auth, translationController.updateTranslation);
router.delete('/:id', auth, translationController.deleteTranslation);

module.exports = router;
