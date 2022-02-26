const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results
const Restaurant = require('../restaurant')
db.once('open', () => {
  Restaurant.create(restaurantList)
  console.log('done!')
})