/** @format */

const commentRouter = require('express').Router();
const {
	fetchCommentsByArticle,
	sendComment,
	removeComment,
} = require('../controllers/controller');

commentRouter.delete('/:comment_id', removeComment);

module.exports = commentRouter;
