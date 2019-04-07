const color = require('colors')
const User = require('../models/user')
const Todo = require('../models/todo')
const jwt = require('jsonwebtoken')

module.exports = {

    authenticate: function (req, res, next) {
        console.log('authenticating...'.red)
        try {
            const tokenCheck = jwt.verify(req.headers.token, process.env.SECRET_KEY)
            req.authenticated = tokenCheck
            console.log('user authenticated!'.green.bold)
            next()
        } catch (err) {
            res.status(401).json({
                msg: 'user not authenticated'
            })
        }
    },

    authorization: function (req, res, next) {
        console.log('authorizing...'.red)
        Todo
            .findById(req.params.id)
            .then(found => {
                // console.log(found, 'ini found==========')
                // next()
                if (found.userId.toString() === req.authenticated.userId.toString()) {
                    console.log('user authorized!'.green.bold)
                    next()
                } else {
                    res.status(401).json({
                        msg: 'not allowed!'
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    },

    groupCheck: function (req, res, next) {
        next()
    }

}   