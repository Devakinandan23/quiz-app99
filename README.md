# BITSAT Quiz Platform 🧪

A full-stack, responsive quiz application. It features a React frontend (built with Vite) and a powerful Express.js + Prisma backend connected to a PostgreSQL database (Neon DB). It supports multiple quizzes, detailed analytics, mistake pattern recognition, and robust persistent attempt tracking.

## Architecture

*   **Frontend (`/src`)**: React + Vite. Features a customizable test dashboard, detailed analytics (Subject Performance, Concept Breakdown, Mistake Patterns), Answer Review mechanics, and Flashcards.
*   **Backend (`/backend3`)**: Express.js + Prisma ORM. Validates attempts, securely calculates scores on the server, and persists history in PostgreSQL.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.
*   A PostgreSQL database (e.g., [Neon DB](https://neon.tech/)).

### Installation & Setup

You will need to run both the frontend and backend servers simultaneously.

**1. Set up the Backend**
```bash
cd backend3
npm install
```
*   Create a `.env` file in the `backend3/` directory and add your database URL:
    ```
    DATABASE_URL="postgres://user:password@host/dbname"
    ```
*   Initialize the database and seed the initial questions:
    ```bash
    npx prisma db push
    npm run db:seed
    ```
*   Start the backend server (runs on port 3000 by default):
    ```bash
    npm run dev
    ```

**2. Set up the Frontend**
Open a new terminal window at the project root:
```bash
npm install
npm run dev
```

---

## 🛠 Contributing: How to Add New Questions

The database seed script (`backend3/prisma/seed.ts`) automatically populates the PostgreSQL database by reading the raw questions from `src/data/questions.js`.

To update or add new questions to the database:

### Step 1: Update the Raw Data

1. Open `src/data/questions.js`.
2. Add your new question objects to the `QUESTIONS` array. Each question object must perfectly match this exact shape:

```javascript
  {
    id: 1, // Sequential ID
    q: "The question text",
    opts: ["Option 1", "Option 2", "Option 3", "Option 4"],
    ans: 0, // The index of the correct option (0-3)
    exp: "Explanation of why the answer is correct",
    concept: "Primary Concept Name", // e.g., "Chemical Bonding"
    subject: "Chemistry", // Must match the subject domain (e.g., Physics, Chemistry, Maths, English, Logical Reasoning)
    ncert: true, // Boolean
    ref: "Chapter or Topic Name"
  }
```

*Tip: You can use an AI like ChatGPT or Claude to format raw text into these JSON objects.*

### Step 2: Seed the Database

Once `src/data/questions.js` is updated, you need to push these changes to your PostgreSQL database.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend3
   ```
2. Run the seed script:
   ```bash
   npm run db:seed
   ```
This script will read the updated array, reset the quiz questions in the database, and insert the new ones. Your new questions will immediately be available in the app!
