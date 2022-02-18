/** @format */

const apiRouter = require('express').Router();
const articleRouter = require('./article-router');
const commentRouter = require('./comment-router');
const userRouter = require('./user-router');
const topicRouter = require('./topic-router')

const { fetchEndpoints } = require('../controllers/controller');

apiRouter.get('/', fetchEndpoints);

apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/topics', topicRouter);

module.exports = apiRouter;
