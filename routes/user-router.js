const userRouter = require('express').Router()

const {fetchUsers} = require('../controllers/controller')

userRouter.get('/', fetchUsers)

module.exports = userRouter