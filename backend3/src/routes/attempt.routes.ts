import { Router } from 'express'
import {
  createAttemptController,
  deleteAttemptController,
  getAttemptByIdController,
  getAttemptsController,
} from '../controllers/attempt.controller.js'

const attemptRouter = Router()

attemptRouter.post('/attempts', createAttemptController)
attemptRouter.get('/attempts', getAttemptsController)
attemptRouter.get('/attempts/:id', getAttemptByIdController)
attemptRouter.delete('/attempts/:id', deleteAttemptController)

export { attemptRouter }
