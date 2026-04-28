import 'dotenv/config'
import express from 'express'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const app = express()
app.use(express.json())

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

app.get('/questions', async (req, res) => {
  const questions = await prisma.question.findMany({
    include: { options: true },
    take: 10,
  })
  res.json(questions)
})

app.listen(3000, () => console.log('Server running at http://localhost:3000'))
