# BITSAT Quiz Platform 🧪

A responsive, multi-quiz React application built with Vite. It features a customizable catalog of tests, comprehensive analytics, answer review mechanics, and persistent progress tracking via `localStorage`.

## Features
- **Multi-Quiz Architecture**: Supports housing multiple independent tests within a single app.
- **Persistent History**: Saves all attempt records (scores, accuracy, time taken) automatically to namespaced local storage.
- **Detailed Analytics & Feedback**: Breaks down your performance by test topics, tracks unanswered/marked questions, and categorizes mistakes.
- **Focus Modes**: Built-in Flashcards and "Retry Wrong Questions" modes.

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛠 How to Add a New Quiz using AI

If you have a set of questions (from a pdf, text file, etc.) and you want to convert them into a new quiz in this app, you can use the prompt below with any AI (like ChatGPT, Claude, etc.) to do the heavy lifting for you.

### Step 1: Copy this prompt and give it to an AI

```text
I want to add a new quiz to my React quiz app. 

Here is my raw list of questions and answers:
[PASTE YOUR QUESTIONS HERE]

Please convert these questions into an array of Javascript objects that perfectly matches my app's existing format. 

Follow these strict rules:
1. The output should be a new exported array `export const NEW_QUIZ_QUESTIONS = [ ... ];`
2. Each question object must have this exact shape:
  {
    id: 1, // Please increment this for each question sequentially
    q: "The question text",
    opts: ["Option 1", "Option 2", "Option 3", "Option 4"],
    ans: 0, // The index of the correct option (0-3)
    exp: "Explanation of why the answer is correct",
    concept: "Primary Concept Name", // e.g., "Chemical Bonding"
    subject: "Chemistry", // Must match the subject domain
    ncert: true, // Boolean (guess based on whether it is standard curriculum)
    ref: "Chapter or Topic Name"
  }
3. Generate the correct `ans` index based on the answers provided in my raw text.
4. If an explanation is missing from my text, please generate a concise, accurate educational explanation for the `exp` property.
5. Group the questions cleanly.
6. After generating the array, please provide the exact code block I need to add to my `QUIZ_CATALOG` object to register this quiz, using a URL-safe ID like `"biology-mock-1"`.
```

### Step 2: Implement the AI's Output

Once the AI replies with your parsed code:

1. Open `src/data/questions.js`.
2. Paste the parsed `const NEW_QUIZ_QUESTIONS = [...]` array anywhere near the top or bottom of the file (outside of existing arrays/objects).
3. Scroll down to the `QUIZ_CATALOG` object at the very bottom of the file.
4. Add the new dictionary entry provided by the AI into the `QUIZ_CATALOG`. For example:

```javascript
export const QUIZ_CATALOG = {
  // ... your existing quizzes ...

  "my-new-quiz": {
    id: "my-new-quiz",
    title: "My Awesome New Quiz",
    description: "Covers important topics",
    questions: NEW_QUIZ_QUESTIONS  // ← Point this to the array you just pasted
  }
};
```
5. Save the file, and your new quiz will automatically appear on the app's home screen!
