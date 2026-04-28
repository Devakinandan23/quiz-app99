import { Router } from 'express'
import {
  getQuizQuestionsController,
  getQuizzesController,
} from '../controllers/quiz.controller.js'

const quizRouter = Router()

quizRouter.get('/quizzes', getQuizzesController)
quizRouter.get('/quizzes/:quizId/questions', getQuizQuestionsController)

export { quizRouter }
