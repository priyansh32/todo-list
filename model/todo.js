const mongoose = require('mongoose');
const { User } = require('./user');

const toDoSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Personal', 'College', 'Home', 'Other']
    },
    date: {
        type: Date,
        required: true
    },
    desc: {
        type: String,
        maxLength: 81,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})
const ToDo = mongoose.model('Todo-Item', toDoSchema)

module.exports = ToDo;