const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 新增
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/', (req, res) => {
  const userId = req.user._id
  const data = req.body
  data.userId = userId
  Restaurant
    .create(data)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 瀏覽
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant
    .findOne({_id, userId})
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(err => console.log(err))
})

// 修改
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant
    .findOne({ _id, userId })
    .lean()
    .then(item => res.render('edit', { restaurant: item }))
    .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const data = req.body
  Restaurant
    .findOneAndUpdate({ _id, userId }, data)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant
    .findOneAndRemove({_id, userId})
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router