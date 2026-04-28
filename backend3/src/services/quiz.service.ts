import { prisma } from '../db.js'

export const listQuizzes = async () => {
  return prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      description: true,
    },
    orderBy: {
      id: 'asc',
    },
  })
}

type ListQuizQuestionsInput = {
  quizId: number
  limit: number
  offset: number
}

const notFoundError = (message: string) => {
  const error = new Error(message) as Error & { status: number }
  error.status = 404
  return error
}

export const listQuizQuestions = async ({
  quizId,
  limit,
  offset,
}: ListQuizQuestionsInput) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: { id: true },
  })

  if (!quiz) {
    throw notFoundError('Quiz not found.')
  }

  const [total, items] = await prisma.$transaction([
    prisma.question.count({
      where: {
        quizId,
      },
    }),
    prisma.question.findMany({
      where: {
        quizId,
      },
      skip: offset,
      take: limit,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        question: true,
        explanation: true,
        concept: true,
        subject: true,
        ncert: true,
        ref: true,
        options: {
          select: {
            id: true,
            text: true,
          },
          orderBy: {
            id: 'asc',
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
