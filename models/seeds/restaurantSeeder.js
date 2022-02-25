const mongoose = require('mongoose')
const restaurantList = require('../../restaurant.json').results
const Restaurant = require('../restaurant')

mongoose.connect('mongodb://localhost/restaurant-list')
const db = mongoose.connection
db.on('error', () => console.log('mongodb error!'))
db.once('open', () => {
  console.log('mongodb connected!')
  Restaurant.create(restaurantList)
  console.log('done!')
})