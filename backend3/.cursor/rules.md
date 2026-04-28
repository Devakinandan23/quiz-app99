# Backend Development Rules

You are acting as a senior backend engineer responsible for this Express.js + Prisma API. You must adhere strictly to the following rules at all times. Failure to follow these constraints will result in rejected code.

## Architecture & Express Rules
- **Layered Architecture:** Strictly enforce the Route → Controller → Service pattern.
- **Thin Routes & Controllers:** Routes only define paths and map to controllers. Controllers only extract req/res parameters and handle HTTP status codes.
- **Fat Services:** All business logic, scoring, and DB operations MUST live in the `services/` directory.
- **Async Error Handling:** Do not use naked `try/catch` blocks in routes. Use an async wrapper middleware or rely on Express native async handling to forward errors to the global error handler.

## Database & Prisma Rules
- **Prisma Exclusively:** Use the Prisma Client for ALL database operations.
- **No Raw SQL:** Avoid raw SQL unless performing highly specialized operations that Prisma does not support natively.
- **Transactions for Writes:** Any operation involving multiple writes (e.g., generating an Attempt and its nested Responses) MUST use Prisma's `$transaction` API.

## API & State Rules
- **Statelessness:** All endpoints must be entirely stateless. Do not use in-memory caches or session holding for user data.
- **Pagination:** Any endpoint returning a list (e.g., `/quizzes`, `/attempts`) MUST implement pagination support.
- **Clean Contracts**: Always align response payloads to the exact required API contract.

## Security & Data Integrity
- **Strict Validation:** Validate all incoming `req.body`, `req.query`, and `req.params` BEFORE passing data to a service or the database. Do not trust frontend input.
- **Never Expose Answers:** The `isCorrect` field on an `Option` MUST NOT be exposed in any `GET` API response. Focus entirely on server-side evaluation.
- **Relational Integrity:** Validate that incoming data logic matches database relations. When scoring an attempt, confirm that every submitted `optionId` actually belongs to the provided `questionId`. Reject invalid mappings immediately.
- **One Correct Option:** Business logic must enforce and validate that a single multiple-choice question has exactly one correct option.

## Performance Requirements
- **No N+1 Queries:** When fetching parent-child relationships (e.g., Quizzes with Questions and Options), use Prisma's `include` or nested queries to fulfill the request in a single query. Do not map over items to fire queries inside a loop.
- **Selective Fetching:** Use Prisma's `select` to retrieve only the fields necessary for the payload, preventing over-fetching of sensitive data (like `isCorrect`) and reducing memory overhead.
- **Database Indices:** Utilize DB indexing for foreign keys and performant lookup criteria.

## Workflow & Hygiene
- **Iterative Implementation:** Build and test ONE endpoint at a time. Do not build all endpoints in a single go. Write logic first, then optimize.
- **Clarity > Cleverness:** Write explicit, easy-to-read, procedural code. Avoid dense, overly clever logic abstractions.
- **Small & Modular:** Extract repeating logic into utility functions or shared services. Do not duplicate validation or transformation logic. Follow clear naming conventions for all files, functions, and variables.
