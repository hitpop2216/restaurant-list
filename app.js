const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')

mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection
db.on('error', () => console.log('mongodb error!'))
db.once('open', () => console.log('mongodb connected!'))

const app = express()
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// 首頁
app.get('/', (req, res) => {
  Restaurant
    .find()
    .lean()
    .then(item => res.render('index', { restaurantList: item }))
    .catch(err => console.log(err))
})

// 新增
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})
app.post('/restaurants', (req, res) => {
  Restaurant
    .create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 瀏覽
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant
    .findById(id)
    .lean()
    .then(restaurant => res.render('detail', { restaurant }))
    .catch(err => console.log(err))
})

// 修改
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant
    .findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.log(err))
})
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const restaurantData = req.body
  Restaurant
    .findById(id)
    .then(restaurant =>{
      for (let item in restaurantData) {
        restaurant[item] = restaurantData[item]
      }
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))
})

// 搜尋
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.filter(item => item.name.trim().toLowerCase().includes(keyword) || item.category.trim().toLowerCase().includes(keyword))
  res.render('index', { restaurantList: restaurants})
})

app.listen(3000, () =>{
  console.log('The app is running on http://localhost:3000')
})

