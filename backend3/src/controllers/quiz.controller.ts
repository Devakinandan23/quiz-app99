import type { RequestHandler } from 'express'
import { listQuizQuestions, listQuizzes } from '../services/quiz.service.js'

const getSingleString = (value: unknown) => {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return undefined
}

export const getQuizzesController: RequestHandler = async (_req, res, next) => {
  try {
    const quizzes = await listQuizzes()
    res.status(200).json(quizzes)
  } catch (error) {
    next(error)
  }
}

export const getQuizQuestionsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const quizId = Number.parseInt(getSingleString(req.params.quizId) ?? '', 10)

    if (!Number.isInteger(quizId) || quizId <= 0) {
      res.status(400).json({ message: 'Invalid quizId. Must be a positive integer.' })
      return
    }

    const rawLimit = getSingleString(req.query.limit)
    const rawOffset = getSingleString(req.query.offset)

    const limit = rawLimit ? Number.parseInt(rawLimit, 10) : 20
    const offset = rawOffset ? Number.parseInt(rawOffset, 10) : 0

    if (!Number.isInteger(limit) || limit <= 0 || limit > 500) {
      res
        .status(400)
        .json({ message: 'Invalid limit. Must be an integer between 1 and 500.' })
      return
    }

    if (!Number.isInteger(offset) || offset < 0) {
      res.status(400).json({ message: 'Invalid offset. Must be a non-negative integer.' })
      return
    }

    const result = await listQuizQuestions({ quizId, limit, offset })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
