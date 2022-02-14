/** @format */

const { selectTopics, selectArticleById } = require('../models/model.js');

exports.fetchTopics = (req, res, next) => {
	selectTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};

exports.fetchArticle = (req, res, next) => {

    const articleId = req.params.article_id

    selectArticleById(articleId).then((article) => {
			res.status(200).send({ article });
		});
};
