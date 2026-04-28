# Quiz Platform Backend

Express + Prisma backend for the quiz app.  
It serves quizzes/questions, evaluates submissions server-side, and stores attempt history in PostgreSQL.

## Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon adapter supported)
- TypeScript

## Architecture

Layered flow:

`Routes -> Controllers -> Services -> Prisma -> PostgreSQL`

- **Routes**: endpoint wiring only
- **Controllers**: request parsing + response codes
- **Services**: validation, scoring, DB logic
- **Stateless API**: no in-memory session state

## Project Structure

```text
src/
  controllers/
  routes/
  services/
  db.ts
  index.ts
prisma/
  schema.prisma
```

## Data Model (Prisma)

- `Quiz`
- `Question` (belongs to quiz)
- `Option` (belongs to question, contains `isCorrect`)
- `Attempt` (quiz submission summary)
- `Response` (per-question selected option for an attempt)

Important integrity and performance features:

- indexed foreign keys (`quizId`, `questionId`, `attemptId`, `optionId`)
- unique attempt submission hash (`submissionHash`) to prevent duplicates
- unique response per question per attempt (`@@unique([attemptId, questionId])`)

## API Endpoints

### `GET /quizzes`

Returns all quizzes (minimal payload):

```json
[
  { "id": 1, "title": "JEE Mock Test 1", "description": "..." }
]
```

### `GET /quizzes/:quizId/questions?limit=20&offset=0`

Returns paginated questions for a quiz, with options.

- validates `quizId`, `limit`, `offset`
- never exposes `Option.isCorrect`

Response:

```json
{
  "total": 80,
  "limit": 20,
  "offset": 0,
  "items": [
    {
      "id": 1,
      "question": "...",
      "explanation": "...",
      "concept": "...",
      "subject": "...",
      "ncert": false,
      "ref": "...",
      "options": [{ "id": 10, "text": "..." }]
    }
  ]
}
```

### `POST /attempts`

Submits a completed quiz attempt.

Request:

```json
{
  "quizId": 1,
  "responses": [
    { "questionId": 101, "optionId": 1001 },
    { "questionId": 102, "optionId": 1007 }
  ]
}
```

Behavior:

- strict input validation
- verifies each `questionId` belongs to the quiz
- verifies each `optionId` belongs to the provided question
- enforces completed submission (all questions answered)
- computes score on server only
- stores `Attempt` + `Response[]` in one Prisma transaction
- duplicate submissions return `409`

Response:

```json
{
  "score": 62,
  "accuracy": 77.5,
  "totalQuestions": 80
}
```

### `GET /attempts?limit=20&offset=0`

Returns paginated attempt history:

```json
{
  "total": 12,
  "limit": 20,
  "offset": 0,
  "items": [
    {
      "id": 9,
      "quizId": 1,
      "score": 62,
      "accuracy": 77.5,
      "totalQuestions": 80,
      "createdAt": "2026-04-28T18:00:00.000Z",
      "quiz": { "title": "JEE Mock Test 1", "description": "..." }
    }
  ]
}
```

### `GET /attempts/:id`

Returns detailed attempt data for review, including:

- submitted responses
- question text + explanation
- options for each question

## Validation & Security

- validate all params/query/body before DB operations
- server-side scoring only (frontend is never trusted)
- `isCorrect` is never returned in GET responses
- global error handler returns safe messages

## Query Efficiency

- nested `select`/`include` used to avoid N+1 query patterns
- pagination supported for list endpoints
- selective field projection to avoid over-fetching

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (`.env`):

```bash
DATABASE_URL=postgres://...
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run backend:

```bash
npm run dev
```

## Frontend Integration Notes

- Set frontend API base URL via `VITE_API_BASE_URL`
- If frontend/backend run on different origins, enable CORS in backend
- Frontend should:
  - fetch quiz list and questions from API
  - submit attempts via `POST /attempts`
  - treat backend response as source of truth for scoring
