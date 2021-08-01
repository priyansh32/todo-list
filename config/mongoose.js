const mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err.message))

const db = mongoose.connection

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
db.once('open', function () {
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;