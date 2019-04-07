const router = require('express').Router()
const todoController = require('../controllers/todoController')
const { authenticate, authorization } = require('../middlewares/verify')

router.post('/byProject', todoController.createByProject)

router.get('/:id', todoController.findOne)

router.post('/', authenticate, todoController.createByUser)

router.get('/', todoController.findAll)

router.get('/:userId', authenticate, todoController.findByUserId)

router.get('/:projectId', todoController.findByProjectId)

router.patch('/:id', authenticate, authorization, todoController.update)

router.delete('/:id', authenticate, authorization, todoController.delete)

module.exports = router