/** @format */

const express = require('express');

const { fetchTopics } = require('./controllers/controller');

const app = express();

app.get('/api/topics', fetchTopics);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: '404 - path not found' });
});

module.exports = app;
