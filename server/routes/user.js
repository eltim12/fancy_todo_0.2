const router = require('express').Router()
const userController = require('../controllers/userController')
const googleEncrypt = require('../helpers/googleEncrypt')
const { authenticate, authorization } = require('../middlewares/verify')


// ──[create new user]─────────────────────
router.post('/', userController.create)

// ──[user login]─────────────────────
router.post('/login', userController.login)

// ──[check invited]─────────────────────
router.get('/checkInvited', authenticate, userController.checkInvited)

// ──[user login with google]─────────────────
router.post('/g-sign', googleEncrypt, userController.googleLogin)

// ──[find all users]─────────────────────
router.get('/', userController.findAll)

// ──[find a users]─────────────────────
router.get('/:id', userController.find)

// ──[update a users]─────────────────────
router.put('/:id', userController.update)

// ──[delete a users]─────────────────────
router.delete('/:id', userController.delete)

module.exports = router