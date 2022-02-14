/** @format */

const express = require('express');

const {
	fetchTopics,
	fetchArticle,
	updateArticle,
} = require('./controllers/controller');

const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
} = require('./Errors/error-handling.js');

const app = express();
app.use(express.json());

app.get('/api/topics', fetchTopics);

app.get('/api/articles/:article_id', fetchArticle);
app.patch('/api/articles/:article_id', updateArticle);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: '404 - path not found' });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
