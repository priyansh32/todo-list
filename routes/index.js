const express = require('express');

const router = express.Router();

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

router.get('/login', (req, res) => {
    return res.render('login')
})

router.use('/auth', require('./auth'))

router.get('/', checkAuthentication, (req, res) => {
    return res.render('home')
})

router.use('/data', checkAuthentication, require('./data'))

module.exports = router