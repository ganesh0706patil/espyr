import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Problems() {
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
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
    <div className="flex h-[80vh] border border-gray-300 rounded-lg overflow-hidden shadow-md">
      <div className="w-72 border-r border-gray-300 bg-gray-50 p-4 overflow-y-auto">
        {questions.map((q, i) => (
          <div
            key={q.id}
            onClick={() => setSelectedIndex(i)}
            className={`mb-4 p-2 bg-white rounded-md shadow-sm flex justify-between items-center cursor-pointer
              ${selectedIndex === i ? "border-2 border-blue-500" : "border-none"}`}
          >
            <div>
              <strong className="block">{q.title}</strong>
              <div className="text-sm text-gray-600">Difficulty: {q.difficulty}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCodeClick(i, q.id);
              }}
              className="ml-2 px-3 py-1 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none"
            >
              Code
            </button>
            {clickedIndex === i && (
              <div className="absolute mt-10 p-2 bg-yellow-100 text-yellow-800 rounded-md font-semibold">
                Loading editor...
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 p-4">
        {selectedIndex !== null ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{questions[selectedIndex].title}</h2>
            <p className="mb-4">{questions[selectedIndex].description}</p>
            <p>
              <strong>Difficulty: </strong>
              {questions[selectedIndex].difficulty}
            </p>
          </>
        ) : (
          <h2 className="text-xl text-gray-500">Select a question to view details</h2>
        )}
      </div>
    </div>
  );
}
