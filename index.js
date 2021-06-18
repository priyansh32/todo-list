const express = require('express')
const db = require('./config/mongoose')


const app = express()
const PORT = 3000

//setting up the view engine
app.set('view engine', 'ejs')
app.set('views', './views')

//middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/Public', express.static('Public'))

app.use('/', require('./routes/index'))

//starting the server on port 3000
app.listen(PORT, (err) => {
    if (err)
        return console.log(`Error + ${err.message}`)
    console.log(`Server Started Successfully on PORT ${PORT}`)
})
