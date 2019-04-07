require("dotenv").config()

const express = require("express")
const cors = require("cors")
const app = express()
const port = 3000

const mongoose = require("mongoose")
mongoose.set("useFindAndModify", false)

mongoose.connect('mongodb://localhost:27017/fancyTodo', { useNewUrlParser: true })

app.use(express.urlencoded({ extended: false }))

app.use(express.json())

app.use(cors())

const userRoutes = require('./routes/user')
const todoRoutes = require('./routes/todo')
const projectRoutes = require('./routes/project')

app.use('/users', userRoutes)
app.use('/todos', todoRoutes)
app.use('/projects', projectRoutes)

module.exports = app
app.listen(port, () => console.log("listening on port" + port))
