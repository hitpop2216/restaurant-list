const db = require('../../config/mongoose')
const restaurantList = require('../../restaurant.json').results
const Restaurant = require('../restaurant')
const User = require('../user')
const bcrypt = require('bcryptjs')
const SEED_USER =[
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(0, 3)
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(3, 6)
  }
]
db.once('open', () => {
  Promise.all(Array.from(SEED_USER, seed_user => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seed_user.password, salt))
      .then(hash => User.create({
        name: seed_user.name,
        email: seed_user.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        seed_user.restaurants.forEach(item => {
          item.userId = userId
        })
        return Restaurant.create(seed_user.restaurants)
      })
  }))
  .then(() => {
    console.log('done!')
    process.exit()
  })
  .catch(err => console.log(err))
})
