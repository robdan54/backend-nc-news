/** @format */

const topicRouter = require('express').Router();

const { fetchTopics } = require('../controllers/controller');

topicRouter.get('/', fetchTopics)

module.exports = topicRouter