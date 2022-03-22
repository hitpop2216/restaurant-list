const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')
const passport = require('passport')
const { rawListeners } = require('../../models/user')

// 註冊
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  if (!name|| !email|| !password|| !confirmPassword) {
    console.log('所有欄位必填')
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword
    })
  }
  if(password!==confirmPassword) {
    console.log('密碼與確認密碼不相符！')
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword
    })
  }
  User
    .findOne({email})
    .then(user => {
      if(user) {
        console.log('使用者已存在。')
        return res.redirect('/users/register')
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
  failureRedirect: '/users/login'
}))

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  res.render('login')
})
module.exports = router