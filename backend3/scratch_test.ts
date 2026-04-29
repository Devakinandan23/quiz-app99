import { submitAttempt } from './src/services/attempt.service.js'

async function run() {
  try {
    const res = await submitAttempt({
      quizId: 1,
      responses: [{ questionId: 1, optionId: 1 }]
    })
    console.log(res)
  } catch (err) {
    console.error(err)
  }
}
run()
