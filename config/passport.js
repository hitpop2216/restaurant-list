const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, (req, email, password, done)=>{
    User
      .findOne({email})
      .then(user => {
        if (!user) done(null, false, req.flash('warning_msg', '無此使用者'))
        return bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return done(null, false, req.flash('warning_msg', '帳號或密碼錯誤。'))
            return done(null, user)
          })
      })
      .catch(err => done(err, false))
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    const {name, email} = profile._json
    User
      .findOne({email, name})
      .then(user => {
        if(user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }
  ))

  passport.use(new GoogleStrategy({
    clientID: '465998649430-ntsn5p5v2avjl3jp1rngiajjfv77rpcc.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/auth/google/callback",
    profileFields: ['displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const { name, email } = profile._json
    User
      .findOne({ email, name })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User
      .findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}