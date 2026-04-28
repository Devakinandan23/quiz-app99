import { Router } from 'express'
import {
  createAttemptController,
  getAttemptByIdController,
  getAttemptsController,
} from '../controllers/attempt.controller.js'

const attemptRouter = Router()

attemptRouter.post('/attempts', createAttemptController)
attemptRouter.get('/attempts', getAttemptsController)
attemptRouter.get('/attempts/:id', getAttemptByIdController)

export { attemptRouter }
