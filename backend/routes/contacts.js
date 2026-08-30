const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/auth');

router.post('/', contactController.createMessage);
router.get('/', auth, contactController.getMessages);
router.put('/:id/read', auth, contactController.markAsRead);
router.delete('/:id', auth, contactController.deleteMessage);

module.exports = router;
