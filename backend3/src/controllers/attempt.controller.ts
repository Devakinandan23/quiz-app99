import type { RequestHandler } from 'express'
import {
  deleteAttempt,
  getAttemptById,
  listAttempts,
  submitAttempt,
} from '../services/attempt.service.js'

type RawResponse = {
  questionId?: unknown
  optionId?: unknown
}

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0

const getSingleString = (value: unknown) => {
  if (typeof value === 'string') {
    return value
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0]
  }

  return undefined
}

export const createAttemptController: RequestHandler = async (req, res, next) => {
  try {
    const { quizId, responses } = req.body as {
      quizId?: unknown
      responses?: unknown
    }

    if (!isPositiveInteger(quizId)) {
      res.status(400).json({ message: 'quizId must be a positive integer.' })
      return
    }

    if (!Array.isArray(responses)) {
      res.status(400).json({ message: 'responses must be an array of answers.' })
      return
    }

    const normalizedResponses: Array<{ questionId: number; optionId: number }> = []
    const seenQuestionIds = new Set<number>()

    for (const item of responses) {
      const response = item as RawResponse

      if (!isPositiveInteger(response?.questionId) || !isPositiveInteger(response?.optionId)) {
        res.status(400).json({
          message: 'Each response must contain positive integer questionId and optionId.',
        })
        return
      }

      if (seenQuestionIds.has(response.questionId)) {
        res.status(400).json({
          message: `Duplicate response for questionId ${response.questionId}.`,
        })
        return
      }

      seenQuestionIds.add(response.questionId)
      normalizedResponses.push({
        questionId: response.questionId,
        optionId: response.optionId,
      })
    }

    const result = await submitAttempt({
      quizId,
      responses: normalizedResponses,
    })

    res.status(201).json({
      score: result.score,
      accuracy: result.accuracy,
      totalQuestions: result.totalQuestions,
      responses: result.evaluations.map((e) => ({
        questionId: e.questionId,
        optionId: e.optionId,
        isCorrect: e.isCorrect,
        correctOptionId: e.correctOptionId,
      })),
      allCorrectOptions: result.allCorrectOptions,
    })
  } catch (error) {
    next(error)
  }
}

export const getAttemptsController: RequestHandler = async (req, res, next) => {
  try {
    const rawLimit = getSingleString(req.query.limit)
    const rawOffset = getSingleString(req.query.offset)

    const limit = rawLimit ? Number.parseInt(rawLimit, 10) : 20
    const offset = rawOffset ? Number.parseInt(rawOffset, 10) : 0

    if (!Number.isInteger(limit) || limit <= 0 || limit > 500) {
      res.status(400).json({ message: 'Invalid limit. Must be an integer between 1 and 500.' })
      return
    }

    if (!Number.isInteger(offset) || offset < 0) {
      res.status(400).json({ message: 'Invalid offset. Must be a non-negative integer.' })
      return
    }

    const result = await listAttempts({ limit, offset })
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export const getAttemptByIdController: RequestHandler = async (req, res, next) => {
  try {
    const rawAttemptId = getSingleString(req.params.id)
    const attemptId = Number.parseInt(rawAttemptId ?? '', 10)

    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      res.status(400).json({ message: 'Invalid id. Must be a positive integer.' })
      return
    }

    const attempt = await getAttemptById(attemptId)
    res.status(200).json(attempt)
  } catch (error) {
    next(error)
  }
}

export const deleteAttemptController: RequestHandler = async (req, res, next) => {
  try {
    const rawAttemptId = getSingleString(req.params.id)
    const attemptId = Number.parseInt(rawAttemptId ?? '', 10)

    if (!Number.isInteger(attemptId) || attemptId <= 0) {
      res.status(400).json({ message: 'Invalid id. Must be a positive integer.' })
      return
    }

    const result = await deleteAttempt(attemptId)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
