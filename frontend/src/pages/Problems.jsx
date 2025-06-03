import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Problems() {
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const navigate = useNavigate();

  // Load questions from src/data/questions.json
  useEffect(() => {
    // Option 1: Import the JSON file directly (recommended)
    import('../data/questions.json')
      .then(module => {
        setQuestions(module.default);
      })
      .catch((err) => console.error("Failed to load questions:", err));

    // Option 2: If you prefer fetch and move the file to public folder
    // fetch("/data/questions.json")
    //   .then((res) => res.json())
    //   .then(setQuestions)
    //   .catch((err) => console.error("Failed to load questions:", err));
  }, []);

  const handleCodeClick = (index, questionId) => {
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 1000);
    navigate(`/practice/${questionId}`);
  };

  return (
    <div style={containerStyle}>
      <div style={questionsListStyle}>
        {questions.map((q, i) => (
          <div
            key={q.id}
            style={{
              ...questionItemStyle,
              border: selectedIndex === i ? "2px solid #3b82f6" : "none",
              cursor: "pointer",
            }}
            onClick={() => setSelectedIndex(i)}
          >
            <div>
              <strong>{q.title}</strong>
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                Difficulty: {q.difficulty}
              </div>
            </div>
            <button
              style={buttonStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleCodeClick(i, q.id);
              }}
            >
              Code
            </button>
            {clickedIndex === i && (
              <div style={messageStyle}>Loading editor...</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: "1rem" }}>
        {selectedIndex !== null ? (
          <>
            <h2>{questions[selectedIndex].title}</h2>
            <p>{questions[selectedIndex].description}</p>
            <p>
              <strong>Difficulty: </strong>
              {questions[selectedIndex].difficulty}
            </p>
          </>
        ) : (
          <h2>Select a question to view details</h2>
        )}
      </div>
    </div>
  );
}

// 💄 Inline Styles
const containerStyle = {
  display: "flex",
  height: "80vh",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
};

const questionsListStyle = {
  width: "300px",
  borderRight: "1px solid #ddd",
  backgroundColor: "#f9fafb",
  padding: "1rem",
  overflowY: "auto",
};

const questionItemStyle = {
  marginBottom: "1rem",
  padding: "0.5rem",
  backgroundColor: "#fff",
  borderRadius: "6px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const buttonStyle = {
  marginLeft: "10px",
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#3b82f6",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const messageStyle = {
  marginTop: "10px",
  padding: "8px",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  borderRadius: "6px",
  fontWeight: "600",
};