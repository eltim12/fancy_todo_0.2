const User = require('../models/user')
const Project = require('../models/project')
const bcrypt = require('../helpers/bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    create(req, res) {
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
            .then(created => {
                res.status(201).json(created)
            })
            .catch(err => {
                res.status(500).json({
                    msg: err.message
                })
            })
    },

    findAll(req, res) {
        User
            .find({})
            .then(found => {
                res.status(200).json(found)
            })
            .catch(err => {
                res.status(500).json({
                    msg: "internal server error"
                })
            })
    },

    find(req, res) {
        User
            .findById(req.params.id)
            .populate('todolist')
            .populate('projectlist')
            .populate({
                path: 'projectlist',
                populate: {
                    path: 'users'
                }
            })
            .populate({
                path: 'projectlist',
                populate: {
                    path: 'owner'
                }
            })
            .populate({
                path: 'projectlist',
                populate: {
                    path: 'todolist'
                }
            })
            .then(found => {
                if (!found) {
                    res.status(404).json({
                        msg: 'not Found.'
                    })
                } else {
                    res.status(200).json(found)
                }
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    update(req, res) {
        User
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
        console.log('masok controlller --=-=--=-=-==--')
        User
            .findByIdAndDelete(req.params.id)
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    login(req, res) {
        User.findOne({
            email: req.body.email,
        })
            .then(found => {
                if (!found) {
                    // res.status(403).json({
                    //     msg: 'username/password wrong.'
                    // })
                    throw new Error()
                } else {
                    if (bcrypt.compare(req.body.password, found.password) === true) {
                        let jwtData = {
                            email: found.email,
                            userId: found._id
                        }
                        let token = jwt.sign(jwtData, process.env.SECRET_KEY)
                        res.status(200).json({
                            token,
                            userId: found._id
                        })
                    } else {
                        throw new Error()
                    }
                }
            })
            .catch(err => {
                // console.log(err)
                res.status(403).json({
                    msg: 'internal server error'
                })
            })
    },

    googleLogin(req, res) {
        User
            .findOne({
                email: req.body.email
            })
            .then(user => {
                if (!user) {
                    return User
                        .create({
                            name: req.body.name,
                            email: req.body.email,
                            password: 'google'
                        })

                } else {
                    return user
                }
            })
            .then(user => {
                let jwtData = {
                    email: user.email,
                    userId: user._id
                }
                let token = jwt.sign(jwtData, process.env.SECRET_KEY)
                res.status(200).json({
                    token,
                    email: user.email,
                    userId: user.id
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    checkInvited(req, res) {
        // console.log(req.authenticated, 'dalem controller=====')
        Project.find({
            pendinglist: req.authenticated.userId
        })
        .populate('owner')
            .then(result => {
                console.log(result)
                res.status(200).json(result)
            })
            .catch(err => {
                console.log(err)
            })
    }
}