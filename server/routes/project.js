const router = require('express').Router()
const projectController = require('../controllers/projectController')
const { authenticate, authorization } = require('../middlewares/verify')

router.get('/', projectController.findAll)

router.get('/:id', projectController.findOne)

router.post('/invite/:id', projectController.invite)

router.patch('/acceptInvite/:id', projectController.acceptInvite)

router.patch('/declineInvite/:id', projectController.declineInvite)

router.post('/', authenticate, projectController.create)


module.exports = router