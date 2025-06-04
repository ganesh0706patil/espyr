import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

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
          skill_level: "beginner",
          problem_id: "two-sum",
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 p-6 pt-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <motion.h1
  className="
    text-center
    text-4xl font-extrabold
    bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700
    text-transparent bg-clip-text
    tracking-tight
    py-4 relative
    mb-4
    font-sans
  "
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  Mentor Agent
  <motion.span
    className="
      absolute bottom-2 left-1/2 -translate-x-1/2
      w-24 h-1
      bg-gradient-to-r from-gray-600 to-gray-700
      rounded-full
    "
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay: 0.3, duration: 0.8, ease: "backOut" }}
  />
</motion.h1>
            <p className="text-lg text-gray-600">
              Get personalized guidance from our AI mentor
            </p>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl"
          >
            <div className="space-y-2">
              <label 
                htmlFor="question" 
                className="block text-lg font-medium text-gray-700"
              >
                Your Question
              </label>
              <textarea
                id="question"
                placeholder="Ask anything about data structures and algorithms..."
                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300"
                rows={5}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 px-6 cursor-pointer rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] ${
                loading 
                  ? "bg-orange-400 cursor-not-allowed" 
                  : "bg-orange-600 hover:bg-orange-700"
              } shadow-md hover:shadow-lg`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center ">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Thinking...
                </span>
              ) : (
                "Ask Mentor"
              )}
            </button>
          </form>

          {answer && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-lg transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Mentor's Response</h2>
              </div>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line border-t pt-4 border-gray-100">
                {answer}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add these keyframes to your global CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}