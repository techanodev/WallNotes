import { Router } from 'express'
import Controller from '../../controllers/controllers'
import UserController from '../../controllers/users.controllers'

const router = Router()

router.post('/register/guest', UserController.createGuestUser)
router.use(Controller.notFound)

export default router