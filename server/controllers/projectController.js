const Project = require('../models/project')
const User = require('../models/user')

module.exports = {

    create(req, res) {
        let newProject = {}
        Project
            .create({
                owner: req.body.ownerId,
                name: req.body.name,
            })
            .then(created => {
                newProject = created
                return Project.findByIdAndUpdate(created._id, {
                    $push: {
                        users: req.body.ownerId
                    }
                })
            })
            .then(addedOwnerToUser => {
                return User.findByIdAndUpdate(req.body.ownerId, {
                    $push: {
                        projectlist: newProject._id
                    }
                })
            })
            .then(updatedUser => {
                res.status(201).json(updatedUser)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    msg: 'internal server error.'
                })
            })
    },

    findAll(req, res) {
        Project
            .find({})
            .populate('owner')
            .then(all => {
                res.status(200).json(all)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    findOne(req, res) {
        Project
            .findById(req.params.id)
            .then(found => {
                res.status(200).json(found)
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'internal server error.'
                })
            })
    },

    invite(req, res) {
        User.findOne({
            email: req.body.email
        })
            .then(foundUser => {
                return Project
                    .findByIdAndUpdate(req.params.id, {
                        $push: {
                            pendinglist: foundUser._id
                        },
                    }, { new: true })

            })
            .then(updated => {
                res.status(200).json(updated)
            })
            .catch(err => {
                res.status(500).json(err)
            })

    },

    acceptInvite(req, res) {
        Project
            .findByIdAndUpdate(req.params.id, {
                $pull: {
                    pendinglist: req.body.userId
                }
            })
            .then(pulled => {
                return Project.findByIdAndUpdate(req.params.id, {
                    $push: {
                        users: req.body.userId
                    }
                })

            })
            .then(addedUser => {
                res.status(200).json(addedUser)
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'internal server error'
                })
            })
    },

    declineInvite(req, res) {
        Project
            .findByIdAndUpdate(req.params.id, {
                $pull: {
                    pendinglist: req.body.userId
                }
            })
            .then(pulled => {
                res.status(200).json(pulled)
            })
            .catch(err => {
                res.status(500).json({
                    msg: 'internall server error'
                })
            })
    }
}