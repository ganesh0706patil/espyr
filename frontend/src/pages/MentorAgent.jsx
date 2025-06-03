import React, { useState } from "react";

export default function MentorAgent() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setAnswer(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/mentor-agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: question,
          skill_level: "beginner",   // can be dynamic later
          problem_id: "two-sum",     // example, change as needed
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      setAnswer(data.message || "No answer from agent.");
    } catch (error) {
      setAnswer("Failed to get answer. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Mentor Agent</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          placeholder="Ask a question..."
          className="w-full p-3 border border-gray-300 rounded"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
      {answer && (
        <div className="bg-gray-100 p-4 rounded border border-gray-300">
          <h2 className="font-semibold mb-2">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
