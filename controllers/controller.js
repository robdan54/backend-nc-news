/** @format */

const {
	selectTopics,
	selectArticleById,
	patchArticle,
} = require('../models/model.js');

exports.fetchTopics = (req, res, next) => {
	selectTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};

exports.fetchArticle = (req, res, next) => {
	const articleId = req.params.article_id;

	selectArticleById(articleId).then((article) => {
		res.status(200).send({ article });
	});
};

exports.updateArticle = (req, res, next) => {
	const { inc_votes } = req.body;
    const articleId = req.params.article_id;
    

	patchArticle(inc_votes, articleId).then((article) => {
		res.status(200).send({ article });
	}).catch(next);
};
