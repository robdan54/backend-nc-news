/** @format */

const express = require('express');

const {
	fetchTopics,
	fetchArticles,
	fetchUsers,
	updateArticle,
	fetchArticleById,
} = require('./controllers/controller');

const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrors,
} = require('./Errors/error-handling.js');

const app = express();
app.use(express.json());

//topics

app.get('/api/topics', fetchTopics);

//articles

app.get('/api/articles', fetchArticles);
app.get('/api/articles/:article_id', fetchArticleById);
app.patch('/api/articles/:article_id', updateArticle);

//users

app.get('/api/users', fetchUsers);

//errors

app.all('/*', (req, res) => {
	res.status(404).send({ msg: '404 - path not found' });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
