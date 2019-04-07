const mongoose = require('mongoose')
const Schema = mongoose.Schema

let TodoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    status: Boolean,
    start_date: Date,
    due_date: Date,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        default: null
    }
})

const Todo = mongoose.model('Todo', TodoSchema)

module.exports = Todo