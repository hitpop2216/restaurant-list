const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const routes = require('./routes')
const session = require('express-session')
const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
  secret: 'Tang',
  resave: false,
  saveUninitialized: true
}))
app.use((req, res, next)=>{
  next()
})
usePassport(app)
app.use(routes)

app.listen(3000, () =>{
  console.log('The app is running on http://localhost:3000')
})

