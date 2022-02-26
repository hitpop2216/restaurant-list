const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const routes = require('./routes')

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
app.use(routes)

app.listen(3000, () =>{
  console.log('The app is running on http://localhost:3000')
})

