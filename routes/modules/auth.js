const express = require('express')
const router = express.Router()
const passport = require('passport')
const Restaurant = require('../../models/restaurant')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router