const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const auth = require('../middleware/auth');

router.get('/', unitController.getUnits);
router.get('/:slug', unitController.getUnitBySlug);
router.post('/', auth, unitController.createUnit);
router.put('/:id', auth, unitController.updateUnit);
router.delete('/:id', auth, unitController.deleteUnit);

module.exports = router;
