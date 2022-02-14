/** @format */

const { selectTopics } = require('../models/model.js');

exports.fetchTopics = (req, res, next) => {
	selectTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};
