/** @format */

const express = require('express');

const { fetchTopics, fetchArticle } = require('./controllers/controller');

const app = express();
app.use(express.json())


app.get('/api/topics', fetchTopics);


app.get('/api/articles/:article_id', fetchArticle)


app.all('/*', (req, res) => {
	res.status(404).send({ msg: '404 - path not found' });
});

module.exports = app;
