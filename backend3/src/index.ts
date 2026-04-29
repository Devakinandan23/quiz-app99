import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { attemptRouter } from './routes/attempt.routes.js'
import { quizRouter } from './routes/quiz.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use(quizRouter)
app.use(attemptRouter)

app.use((error: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error handler caught]:', error)
  const status = error.status ?? 500
  const message = status >= 500 ? 'Internal server error.' : error.message
  res.status(status).json({ message })
})

app.listen(3000, () => console.log('Server running at http://localhost:3000'))
