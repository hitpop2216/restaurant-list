const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const passport = require('passport')
const nodemailer = require('../../config/nodemailer')

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
        .then(user => {
          req.login(user, () => {
            res.redirect('/')
          })
        })
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

// 忘記密碼
router.get('/forget', (req, res) => {
  res.render('forget')
})
router.post('/forget', (req, res) => {
  const {email} = req.body
  User
    .findOne({email})
    .then(user => {
      if(!user) {
        req.flash('warning_msg', '無此使用者。')
        return res.redirect('/users/forget')
      }
      const randomPassword = Math.random().toString(36).slice(-8)
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(randomPassword, salt))
        .then(hash => User.findOneAndUpdate({email}, {password: hash}))
        .then(() => nodemailer(email, randomPassword))
        .then(() => {
          req.flash('success_msg', '新密碼已成功寄出！')
          return res.redirect('/users/login')
        })
        .catch(err => console.log(err))
    })
})

// 修改密碼
router.get('/reset', (req, res) => {
  res.render('reset')
})
router.post('/reset', (req, res) => {
  const {email, oldPassword, newPassword, confirmNewPassword} = req.body
  const errors = []
  if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
    errors.push({ message: '所有欄位必填。' })
  }
  if (newPassword !== confirmNewPassword) {
    errors.push({ message: '新密碼與確認密碼不符。' })
  }
  if (errors.length) {
    return res.render('reset', {
      email,
      oldPassword,
      newPassword,
      confirmNewPassword,
      errors
    })
  }
  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('warning_msg', '無此使用者。')
        return res.render('reset',{email})
      }
      bcrypt
        .compare(oldPassword, user.password)
        .then(isMatch=> {
          if(!isMatch) {
            req.flash('warning_msg', '舊密碼錯誤。')
            return res.redirect('/users/reset')
          }
          return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(newPassword, salt))
            .then(hash => User.findOneAndUpdate({ email }, { password: hash }))
            .then(() => {
              req.flash('success_msg', '密碼更改成功！')
              return res.redirect('/users/login')
            })
            .catch(err => console.log(err))
        })
    })
})
module.exports = router