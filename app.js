/** @format */

const express = require('express');
const apiRouter = require('./routes/api-router')

const {
	fetchTopics,
	fetchArticles,
	fetchUsers,
	updateArticle,
	fetchArticleById,
	fetchCommentsByArticle,
	sendComment,
	removeComment,
	fetchEndpoints,
} = require('./controllers/controller');

const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
} = require('./Errors/error-handling.js');

const app = express();
app.use(express.json());

app.use('/api', apiRouter)


//errors

app.all('/*', (req, res) => {
	res.status(404).send({ msg: '404 - path not found' });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
