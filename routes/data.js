const express = require('express');
const ToDo = require('../model/todo')
const User = require('../model/user')
const router = express.Router();
const fetch = require('node-fetch');

router.post('/create', async (req, res) => {
    let todo = new ToDo({
        title: req.body.title,
        category: req.body.category,
        date: req.body.date,
        desc: req.body.desc,
        done: false,
        user: req.user._id
    })
    try {
        await todo.save()
        return res.status(200).send(todo);
    }
    catch (err) {
        return res.status(400).send({ error: err.message })
    }
})
router.get('/getTodos', async (req, res) => {
    User.findOne({ email: req.user.email }, (err, user) => {
        if (err) {
            return console.log(err);
        }
        if (user) {
            ToDo.find({ user: user._id }, (err, todos) => {
                if (err) {
                    return console.log(err);
                }
                if (todos) {
                    return res.json(todos);
                }
            });
        }
    });
})
router.delete('/delete/:id', async (req, res) => {
    let delItem = await ToDo.findByIdAndDelete(req.params['id'])
    res.send(delItem)
})
router.put('/done/:id', async (req, res) => {
    let updatedItem = await ToDo.findByIdAndUpdate(req.params['id'], { done: true }, { new: true })
    res.send(updatedItem)
})

router.get('/getQuote', async (req, res) => {
    let url = `https://www.stands4.com/services/v2/quotes.php?uid=${process.env.STANDS4API_uid}&tokenid=${process.env.STANDS4API_tokenid}&searchtype=RANDOM&format=json`
    let quote = await fetch(url)
    quote = await quote.json()
    res.send(quote)
})

module.exports = router