const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cookieParser = require('cookie-parser')
const db = require('./config/mongoose')

const session = require('express-session')
const passport = require('passport')
const passportGoogle = require('./config/passport-google-stratagy')

const app = express()

//middlewares
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.json())
app.use('/Public', express.static('Public'))

//setting up the view engine
app.set('view engine', 'ejs')
app.set('views', './views')

app.use(session({
    name: 'SESSID',
    secret: process.env.SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100,
        sameSite: 'lax'
    }
}))

app.use(passport.initialize());
app.use(passport.session())

app.use('/', require('./routes/index'))

//starting the server on port 3000
app.listen(process.env.PORT, (err) => {
    if (err)
        return console.log(`Error + ${err.message}`)
    console.log(`Server Started Successfully on PORT ${process.env.PORT}`)
})
