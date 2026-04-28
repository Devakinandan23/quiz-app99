import 'dotenv/config'
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

async function main() {
  // 1. create quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "BITSAT Practice Set",
      description: "80 questions",
    },
  });

  // 2. create ONE question (test first)
  const question = await prisma.question.create({
    data: {
      quizId: quiz.id,
      question: "A concave mirror has focal length 15 cm...",
      explanation: "Using mirror formula...",
      concept: "Mirror Formula",
      subject: "Physics",
      ncert: true,
      ref: "Ray Optics",
    },
  });

  // 3. create options
  await prisma.option.createMany({
    data: [
      { questionId: question.id, text: "Real", isCorrect: false },
      { questionId: question.id, text: "Virtual", isCorrect: true },
      { questionId: question.id, text: "Real erect", isCorrect: false },
      { questionId: question.id, text: "Virtual inverted", isCorrect: false },
    ],
  });
}

main()
  .then(() => console.log("Seeded"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());