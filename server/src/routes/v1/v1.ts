import { Router } from 'express'
import Controller from '../../controllers/controllers'
import UserController from '../../controllers/users.controllers'
import NotesController from '../../controllers/notes.controllers'

const router = Router()

router.post('/register/guest', UserController.createGuestUser)
router.get('/notes', NotesController.list)
router.use(Controller.notFound)

export default router