const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json').results

mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection
db.on('error', () => console.log('mongodb error!'))
db.once('open', () => console.log('mongodb connected!'))

const app = express()
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', {restaurantList})
})
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id.toString()
  const restaurant = restaurantList.find(item => item.id.toString() === id)
  res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.filter(item => item.name.trim().toLowerCase().includes(keyword) || item.category.trim().toLowerCase().includes(keyword))
  res.render('index', { restaurantList: restaurants})
})

app.listen(3000, () =>{
  console.log('The app is running on http://localhost:3000')
})

