const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const {authenticator} = require('../middleware/auth')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')

router.use('/users', users)
router.use('/auth', auth)
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)

module.exports = router