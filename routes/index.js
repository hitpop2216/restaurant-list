const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const home = require('./modules/home')
const {authenticator} = require('../middleware/auth')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router