import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const problems = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Find indices of two numbers that add up to target.",
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description: "Reverse the given string.",
  },
];

export default function Practice() {
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: "Ask me anything about the problem!" },
  ]);
  const [code, setCode] = useState("// Start coding here");

  function handleSendMessage() {
    alert("Backend not yet connected");
  }

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          borderRight: "1px solid #ddd",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h2>{selectedProblem.title}</h2>
        <p>{selectedProblem.description}</p>

        <div
          style={{
            flex: 1,
            marginTop: 20,
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 10,
            overflowY: "auto",
            background: "#fafafa",
          }}
        >
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: 8,
                textAlign: msg.from === "ai" ? "left" : "right",
                color: msg.from === "ai" ? "blue" : "green",
              }}
            >
              <b>{msg.from === "ai" ? "AI" : "You"}:</b> {msg.text}
            </div>
          ))}
        </div>

        <button
          onClick={handleSendMessage}
          style={{
            marginTop: 10,
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Send Message (Mock)
        </button>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={code}
          onChange={value => setCode(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
