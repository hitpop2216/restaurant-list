const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')
const passport = require('passport')

// 註冊
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  const errors = []
  if (!email|| !password|| !confirmPassword) {
    errors.push({ message: '除名字外，其他欄位必填。'})
  }
  if(password!==confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if(errors.length) {
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword,
      errors
    })
  }
  User
    .findOne({email})
    .then(user => {
      if(user) {
        errors.push({ message: '使用者已存在。' })
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
          errors
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/users/login'))
        .catch(err => console.log(err))
    })
})

// 登入
router.get('/login', (req, res) => {
  res.render('login')
})
router.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureMessage: true,
  failureFlash: true
}))

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '成功登出！')
  res.redirect('/users/login')
})
module.exports = router