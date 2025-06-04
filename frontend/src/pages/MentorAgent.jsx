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
          skill_level: "beginner", // can be dynamic later
          problem_id: "two-sum",   // example, change as needed
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-slate-800 mb-6">
        Mentor Agent
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Ask a question..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="mt-6 bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Answer:</h2>
          <p className="text-gray-800 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}
