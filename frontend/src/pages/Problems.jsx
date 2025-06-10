import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Problems() {
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    import("../data/questions.json")
      .then((module) => {
        setQuestions(module.default);
      })
      .catch((err) => console.error("Failed to load questions:", err));
  }, []);

  const handleCodeClick = (index, questionId) => {
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 1000);
    navigate(`/practice/${questionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 p-4 pt-6">
        <div className="text-center mb-4">
          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-transparent bg-clip-text tracking-tight py-3 relative mb-3 font-sans"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            Problem Set
            <motion.span
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
            />
          </motion.h2>
        </div>

        <div className="h-full border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="flex h-full">
            {/* Questions List */}
            <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  onClick={() => setSelectedIndex(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`mb-3 p-3 rounded-lg transition-all duration-200 cursor-pointer flex flex-col gap-2 relative
                    ${selectedIndex === i 
                      ? "bg-orange-50 border-2 border-orange-500" 
                      : "bg-white border border-gray-200"}
                    ${hoveredIndex === i && selectedIndex !== i ? "border-orange-300 shadow-md" : ""}`}
                >
                  <div>
                    <strong className="block text-gray-800">{q.title}</strong>
                    <div className={`text-sm mt-1 ${
                      q.difficulty === "Easy" ? "text-green-600" :
                      q.difficulty === "Medium" ? "text-yellow-600" :
                      "text-red-600"
                    }`}>
                      {q.difficulty}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCodeClick(i, q.id);
                      }}
                      className="flex-1 px-3 py-1 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 
                        focus:outline-none transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      Solve
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mentor/${q.id}`);
                      }}
                      className="flex-1 px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 
                        focus:outline-none transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      Mentor
                    </button>
                  </div>

                  {clickedIndex === i && (
                    <div className="absolute -bottom-2 left-0 right-0 mx-auto w-max px-3 py-1 bg-orange-100 text-orange-800 rounded-md font-medium text-xs shadow-sm">
                      Loading editor...
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Problem Details */}
            <div className="flex-1 p-6 overflow-y-auto">
              {selectedIndex !== null ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {questions[selectedIndex].title}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      questions[selectedIndex].difficulty === "Easy" ? "bg-green-100 text-green-800" :
                      questions[selectedIndex].difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {questions[selectedIndex].difficulty}
                    </span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {questions[selectedIndex].description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium text-gray-600 mb-2">
                    Select a problem to view details
                  </h2>
                  <p className="text-gray-500 max-w-md">
                    Choose a problem from the list to see its description and start solving it.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
