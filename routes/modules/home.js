const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 首頁
router.get('/', (req, res) => {
  Restaurant
    .find()
    .lean()
    .then(item => res.render('index', { restaurantList: item }))
    .catch(err => console.log(err))
})

// 搜尋
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.filter(item => item.name.trim().toLowerCase().includes(keyword) || item.category.trim().toLowerCase().includes(keyword))
  res.render('index', { restaurantList: restaurants })
})

module.exports = router