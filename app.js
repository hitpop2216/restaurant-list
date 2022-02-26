const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const methodOverride = require('method-override')

mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection
db.on('error', () => console.log('mongodb error!'))
db.once('open', () => console.log('mongodb connected!'))

const app = express()
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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
     .then(item => res.render('edit', { restaurant: item }))
     .catch(err => console.log(err))
})
app.put('/restaurants/:id', (req, res) => {
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
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant
    .findById(id)
    .then(item => item.remove())
    .then(() => res.redirect('/'))
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

