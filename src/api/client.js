const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "/api");

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = "GET", body, signal, headers } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (typeof data === "object" && data?.message) ||
      (typeof data === "string" && data) ||
      "Request failed";
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const api = {
  getQuizzes: () => request("/quizzes"),
  getQuizQuestions: (quizId, { limit = 100, offset = 0 } = {}) =>
    request(`/quizzes/${quizId}/questions?limit=${limit}&offset=${offset}`),
  submitAttempt: ({ quizId, responses }) =>
    request("/attempts", {
      method: "POST",
      body: { quizId, responses },
    }),
  getAttempts: ({ limit = 20, offset = 0 } = {}) =>
    request(`/attempts?limit=${limit}&offset=${offset}`),
  getAttemptById: (attemptId) => request(`/attempts/${attemptId}`),
};

export { ApiError, API_BASE_URL, request };
