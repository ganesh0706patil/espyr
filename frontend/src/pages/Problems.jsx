import React, { useState } from "react";

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
  transition: "background-color 0.3s ease",
};

const messageStyle = {
  marginTop: "10px",
  padding: "8px",
  backgroundColor: "#fef3c7",
  color: "#92400e",
  borderRadius: "6px",
  fontWeight: "600",
};

export default function Problems() {
  const [clickedIndex, setClickedIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const questions = [
    {
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "Easy",
    },
    {
      title: "Longest Substring Without Repeating Characters",
      description:
        "Find the length of the longest substring without repeating characters.",
      difficulty: "Medium",
    },
    {
      title: "Median of Two Sorted Arrays",
      description:
        "Find the median of two sorted arrays.",
      difficulty: "Hard",
    },
    // Add more questions if needed...
  ];

  const handleCodeClick = (index) => {
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 3000);
  };

  return (
    <div style={containerStyle}>
      <div style={questionsListStyle}>
        {questions.map((q, i) => (
          <div
            key={i}
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
                handleCodeClick(i);
              }}
            >
              Code
            </button>
            {clickedIndex === i && (
              <div style={messageStyle}>Backend not yet connected.</div>
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
