import 'dotenv/config'
import { PrismaClient } from "../generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
// @ts-expect-error Questions source is plain JS in frontend.
import { QUESTIONS } from "../../src/data/questions.js"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const QUIZ_TITLE = "BITSAT Practice Set"
const QUIZ_DESCRIPTION = "80 questions"

type SourceQuestion = {
  id: number
  q: string
  opts: string[]
  ans: number
  exp?: string
  concept?: string
  subject?: string
  ncert?: boolean
  ref?: string
}

const sourceQuestions = QUESTIONS as SourceQuestion[]

async function main() {
  const existingQuiz = await prisma.quiz.findFirst({
    where: {
      title: QUIZ_TITLE,
    },
    select: {
      id: true,
    },
  })

  const quiz =
    existingQuiz ??
    (await prisma.quiz.create({
      data: {
        title: QUIZ_TITLE,
        description: QUIZ_DESCRIPTION,
      },
      select: {
        id: true,
      },
    }))

  const existingQuestionIds = await prisma.question.findMany({
    where: { quizId: quiz.id },
    select: { id: true },
  })

  if (existingQuestionIds.length > 0) {
    const ids = existingQuestionIds.map((row) => row.id)
    await prisma.$transaction([
      prisma.option.deleteMany({
        where: {
          questionId: { in: ids },
        },
      }),
      prisma.question.deleteMany({
        where: {
          quizId: quiz.id,
        },
      }),
    ])
  }

  const createdQuestionsBySourceId = new Map<number, number>()

  for (const item of sourceQuestions) {
    if (!Array.isArray(item.opts) || item.opts.length === 0) {
      throw new Error(`Question ${item.id} has no options.`)
    }

    if (!Number.isInteger(item.ans) || item.ans < 0 || item.ans >= item.opts.length) {
      throw new Error(`Question ${item.id} has invalid ans index ${item.ans}.`)
    }

    const createdQuestion = await prisma.question.create({
      data: {
        quizId: quiz.id,
        question: item.q,
        explanation: item.exp ?? null,
        concept: item.concept ?? null,
        subject: item.subject ?? null,
        ncert: item.ncert ?? false,
        ref: item.ref ?? null,
      },
      select: {
        id: true,
      },
    })

    createdQuestionsBySourceId.set(item.id, createdQuestion.id)
  }

  const optionRows = sourceQuestions.flatMap((item) => {
    const questionId = createdQuestionsBySourceId.get(item.id)
    if (!questionId) {
      throw new Error(`No created question id found for source question ${item.id}.`)
    }

    return item.opts.map((text, optionIndex) => ({
      questionId,
      text,
      isCorrect: optionIndex === item.ans,
    }))
  })

  await prisma.option.createMany({
    data: optionRows,
  })
}

main()
  .then(() => console.log("Seeded quiz, questions, and options successfully."))
  .catch(console.error)
  .finally(() => prisma.$disconnect())