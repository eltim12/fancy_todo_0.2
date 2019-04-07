const Todo = require('../models/todo')
const User = require('../models/user')
const Project = require('../models/project')

module.exports = {

    createByUser(req, res) {
        let newTodo = {}
        newTodo = {
            name: req.body.name,
            description: req.body.description,
            status: 0,
            start_date: new Date(),
            due_date: req.body.due_date,
            userId: req.body.userId,
        }

        Todo
            .create(newTodo)
            .then(created => {
                console.log(created)
                return User.findByIdAndUpdate(req.body.userId, {
                    $push: {
                        todolist: created._id
                    }
                }, { new: true })
            })
            .then(updatedUser => {
                console.log("masuk sini", updatedUser)
                res.status(201).json(updatedUser)
            })
            .catch(err => {
                if (err.errors.name) {
                    res.status(402).json({
                        msg: err.errors.name.message
                    })
                }
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    createByProject(req, res) {
        let newTodo = {}
        newTodo = {
            name: req.body.name,
            description: req.body.description,
            status: 0,
            start_date: new Date(),
            due_date: req.body.due_date,
            userId: req.body.userId,
            projectId: req.body.projectId
        }

        Todo
            .create(newTodo)
            .then(created => {
                console.log(created)
                return Project.findByIdAndUpdate(req.body.projectId, {
                    $push: {
                        todolist: created._id
                    }
                }, { new: true })
            })
            .then(updatedProject => {
                console.log("masuk sini", updatedProject)
                res.status(201).json(updatedProject)
            })
            .catch(err => {
                console.log(err.message)
                if (err.errors.name) {
                    res.status(402).json({
                        msg: err.errors.name.message
                    })
                }
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    findOne(req, res) {
        Todo.findById(req.params.id)
            .then(found => {
                if (found) {
                    res.status(200).json(found)
                } else {
                    res.status(404).json({
                        msg: 'not Found'
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    findAll(req, res) {
        Todo
            .find({})
            .then(allTodo => {
                res.status(200).json(allTodo)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    findByUserId(req, res) {
        Todo
            .find({
                userId: req.params.userId
            })
            .then(todos => {
                res.status(200).json(todos)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    },

    findByProjectId(req, res) {

    },

    update(req, res) {
        Todo
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    delete(req, res) {
        Todo
            .findByIdAndDelete(req.params.id)
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

}