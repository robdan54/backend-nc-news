/** @format */

const res = require('express/lib/response');
const {
	selectTopics,
	selectArticleById,
	selectUsers,
	patchArticle,
	selectArticles,
	doesResourceExist,
	selectCommentsByArticle,
	postComment,
	deleteComment,
} = require('../models/model.js');

exports.fetchTopics = (req, res, next) => {
	selectTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};

exports.fetchArticles = (req, res, next) => {
	const { sort_by, order, topic } = req.query;
	selectArticles(sort_by, order, topic)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.fetchArticleById = (req, res, next) => {
	const articleId = req.params.article_id;
	Promise.all([
		selectArticleById(articleId),
		doesResourceExist('articles', 'article_id', articleId),
	])
		.then(([article]) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.fetchUsers = (req, res, next) => {
	selectUsers().then((users) => {
		res.status(200).send({ users });
	});
};

exports.updateArticle = (req, res, next) => {
	const { inc_votes } = req.body;
	const articleId = req.params.article_id;

	patchArticle(inc_votes, articleId)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.fetchCommentsByArticle = (req, res, next) => {
	const articleId = req.params.article_id;
	Promise.all([
		selectCommentsByArticle(articleId),
		doesResourceExist('articles', 'article_id', articleId),
	])
		.then(([comments]) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.sendComment = (req, res, next) => {
	const articleId = req.params.article_id;
	const { body } = req;

	doesResourceExist('articles', 'article_id', articleId) //need to check if resource exists before trying to post as otherwise violates foreign key constraint in comments table
		.then(() => {
			return postComment(body, articleId);
		})
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

exports.removeComment = (req, res, next) => {
	const commentId = req.params.comment_id;

	Promise.all([deleteComment(commentId), doesResourceExist('comments', 'comment_id', commentId)]).then(() => {
		res.status(204).send();
	}).catch(next)

	
};
