const mongoose = require('mongoose')
const Schema = mongoose.Schema

let projectSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pendinglist: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    todolist: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project