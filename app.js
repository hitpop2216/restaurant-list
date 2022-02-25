const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(3000, () =>{
  console.log('The app is running on http://localhost:3000')
})

