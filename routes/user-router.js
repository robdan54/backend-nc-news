const userRouter = require('express').Router()

const { fetchUsers, fetchUserByUsername } = require('../controllers/controller');

userRouter.get('/', fetchUsers)

userRouter.get('/:username', fetchUserByUsername)

module.exports = userRouter