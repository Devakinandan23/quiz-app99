import { prisma } from '../db.js'
import { randomUUID } from 'node:crypto'

type AttemptInput = {
  quizId: number
  responses: Array<{
    questionId: number
    optionId: number
  }>
}

type ListAttemptsInput = {
  limit: number
  offset: number
}

const httpError = (status: number, message: string) => {
  const error = new Error(message) as Error & { status: number }
  error.status = status
  return error
}

export const submitAttempt = async ({ quizId, responses }: AttemptInput) => {
  const normalizedForHash = [...responses]
    .sort((a, b) => a.questionId - b.questionId)
    .map((item) => `${item.questionId}:${item.optionId}`)
    .join('|')

  const submissionHash = randomUUID()

  try {
    const attempt = await prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        select: {
          id: true,
          questions: {
            select: {
              id: true,
              options: {
                select: {
                  id: true,
                  isCorrect: true,
                },
              },
            },
          },
        },
      })

      if (!quiz) {
        throw httpError(404, 'Quiz not found.')
      }

      if (quiz.questions.length === 0) {
        throw httpError(400, 'Quiz has no questions.')
      }

      const totalQuestions = quiz.questions.length

      const questionMap = new Map(
        quiz.questions.map((question) => [question.id, question]),
      )

      for (const response of responses) {
        const question = questionMap.get(response.questionId)
        if (!question) {
          throw httpError(
            400,
            `Question ${response.questionId} does not belong to quiz ${quizId}.`,
          )
        }

        const option = question.options.find((item) => item.id === response.optionId)
        if (!option) {
          throw httpError(
            400,
            `Option ${response.optionId} does not belong to question ${response.questionId}.`,
          )
        }
      }

      let score = 0

      for (const response of responses) {
        const question = questionMap.get(response.questionId)!
        const correctOptions = question.options.filter((option) => option.isCorrect)

        if (correctOptions.length !== 1) {
          throw httpError(
            500,
            `Question ${response.questionId} must have exactly one correct option.`,
          )
        }

        const correctOption = correctOptions[0]!

        if (correctOption.id === response.optionId) {
          score += 1
        }
      }

      const accuracy = Number(((score / totalQuestions) * 100).toFixed(2))

      const createdAttempt = await tx.attempt.create({
        data: {
          quizId,
          submissionHash,
          score,
          accuracy,
          totalQuestions,
        },
        select: {
          id: true,
        },
      })

      await tx.response.createMany({
        data: responses.map((response) => ({
          attemptId: createdAttempt.id,
          questionId: response.questionId,
          optionId: response.optionId,
        })),
      })

      return {
        attemptId: createdAttempt.id,
        score,
        accuracy,
        totalQuestions,
        evaluations: responses.map((response) => {
          const question = questionMap.get(response.questionId)!
          const correctOption = question.options.find((o) => o.isCorrect)!
          return {
            questionId: response.questionId,
            optionId: response.optionId,
            isCorrect: correctOption.id === response.optionId,
            correctOptionId: correctOption.id,
          }
        }),
        // correctOptionId for EVERY question in the quiz (including unanswered)
        allCorrectOptions: Object.fromEntries(
          quiz.questions.map((question) => {
            const correctOption = question.options.find((o) => o.isCorrect)
            return [question.id, correctOption?.id ?? null]
          }),
        ),
      }
    })

    return attempt
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      throw httpError(409, 'Duplicate submission detected.')
    }

    throw error
  }
}

export const deleteAttempt = async (attemptId: number) => {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    select: { id: true },
  })

  if (!attempt) {
    throw httpError(404, 'Attempt not found.')
  }

  await prisma.$transaction([
    prisma.response.deleteMany({ where: { attemptId } }),
    prisma.attempt.delete({ where: { id: attemptId } }),
  ])

  return { deleted: true, attemptId }
}

export const listAttempts = async ({ limit, offset }: ListAttemptsInput) => {
  const [total, items] = await prisma.$transaction([
    prisma.attempt.count(),
    prisma.attempt.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        quizId: true,
        score: true,
        accuracy: true,
        totalQuestions: true,
        createdAt: true,
        quiz: {
          select: {
            title: true,
            description: true,
          },
        },
      },
    }),
  ])

  return {
    total,
    limit,
    offset,
    items,
  }
}

export const getAttemptById = async (attemptId: number) => {
  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    select: {
      id: true,
      quizId: true,
      score: true,
      accuracy: true,
      totalQuestions: true,
      createdAt: true,
      quiz: {
        select: {
          title: true,
          description: true,
        },
      },
      responses: {
        orderBy: {
          questionId: 'asc',
        },
        select: {
          questionId: true,
          optionId: true,
          question: {
            select: {
              question: true,
              explanation: true,
              concept: true,
              subject: true,
              ncert: true,
              options: {
                orderBy: {
                  id: 'asc',
                },
                select: {
                  id: true,
                  text: true,
                  isCorrect: true,
                },
              },
            },
          },
          option: {
            select: {
              text: true,
            },
          },
        },
      },
    },
  })

  if (!attempt) {
    throw httpError(404, 'Attempt not found.')
  }

  return attempt
}
