const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('../helpers/bcrypt')

let userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    todolist: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ],
    projectlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Project"
        }
    ]
})

userSchema.pre('save', function (next) {
    this.password = bcrypt.encrypt(this.password)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User