# BITSAT Quiz Platform 🧪

A full-stack, responsive quiz application. This repository contains the **Frontend** (React + Vite).

* **Frontend Deployed:** https://quizapp99.vercel.app/
* **Backend Deployed:**  onrender.com
* **Backend Repository:** [Devakinandan23/quiz-app99-backend](https://github.com/Devakinandan23/quiz-app99-backend)

## Architecture

*   **Frontend**: React + Vite. Features a customizable test dashboard, detailed analytics (Subject Performance, Concept Breakdown, Mistake Patterns), Answer Review mechanics, and Flashcards.
*   **Backend**: Express.js + Prisma ORM. Validates attempts, securely calculates scores on the server, and persists history in PostgreSQL. (See backend repo).

## Getting Started (Frontend)

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Setup

```bash
npm install
npm run dev
```

The frontend is configured to connect to the deployed backend URL by default. If you want to run the backend locally, you can clone the backend repository and set the `VITE_API_BASE_URL` in a `.env.local` file in this frontend directory:
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🛠 Managing Questions Data

The raw quiz questions are stored in `src/data/questions.js`. 
If you need to update questions:

1. Update the objects in `src/data/questions.js`.
2. Copy the updated file or data over to the backend repository.
3. Run the database seed script in the backend repository (`npm run db:seed`) to push the new questions to the PostgreSQL database.
