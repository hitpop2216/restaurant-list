const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 新增
router.get('/restaurants/new', (req, res) => {
  res.render('new')
})
router.post('/restaurants', (req, res) => {
  Restaurant
    .create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 瀏覽
router.get('/:id', (req, res) => {
  const id = req.params.id
  Restaurant
    .findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(err => console.log(err))
})

// 修改
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant
    .findById(id)
    .lean()
    .then(item => res.render('edit', { restaurant: item }))
    .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const id = req.params.id
  Restaurant
    .findById(id)
    .then(item => {
      for (let i in req.body) {
        item[i] = req.body[i]
      }
      return item.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const id = req.params.id
  Restaurant
    .findById(id)
    .then(item => item.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router