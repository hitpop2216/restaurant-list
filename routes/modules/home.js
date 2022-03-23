const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 首頁
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant
    .find({userId})
    .lean()
    .then(item => res.render('index', { restaurantList: item }))
    .catch(err => console.log(err))
})

// 搜尋
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const sort = req.query.sort
  let sortingMethod = {}
  switch (sort) {
    case 'A->Z':
      sortingMethod = { name: 'asc' }
      break;
    case 'Z->A':
      sortingMethod = { name: 'desc' }
      break;
    case '類別':
      sortingMethod = { category: 'asc' }
      break;
    case '地區':
      sortingMethod = { location: 'asc' }
      break;
  }
  Restaurant
    .find()
    .lean()
    .sort(sortingMethod)
    .then(items => {
      const restaurants = items.filter(item => item.name.trim().toLowerCase().includes(keyword) || item.category.trim().toLowerCase().includes(keyword))
      res.render('index', { restaurantList: restaurants})
    })
    .catch(err => console.log(err))
})

module.exports = router