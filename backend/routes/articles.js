const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middleware/auth');

router.get('/', articleController.getArticles);
router.get('/:slug', articleController.getArticleBySlug);
router.post('/', auth, articleController.createArticle);
router.put('/:id', auth, articleController.updateArticle);
router.delete('/:id', auth, articleController.deleteArticle);

module.exports = router;
