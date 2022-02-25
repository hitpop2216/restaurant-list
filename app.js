const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results

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

app.listen(3000, () =>{
  console.log('The app is running on http://localhost:3000')
})

