/** @format */

const articleRouter = require('express').Router();
const {
	fetchArticles,
	fetchArticleById,
	updateArticle,
    fetchCommentsByArticle,
    sendComment,
} = require('../controllers/controller');

articleRouter.route('/:article_id/comments').get(fetchCommentsByArticle).post(sendComment);

articleRouter.route('/').get(fetchArticles);
articleRouter.route('/:article_id').get(fetchArticleById).patch(updateArticle);

module.exports = articleRouter;
