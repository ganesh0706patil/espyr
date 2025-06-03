import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

const mentorScripts = {
  Beginner: [
    { from: "mentor", text: "What do you think the approach could be?" },
    { from: "user", placeholder: "Maybe try every pair and check sum." },
    { from: "mentor", text: "That's a good start! What happens if the input size is 10^4?" },
    { from: "mentor", text: "Hint: Can a hashmap help you reduce time?" },
  ],
  Intermediate: [
    { from: "user", placeholder: "I'll use a hashmap to store indexes." },
    { from: "mentor", text: "Great! Watch out for duplicates. What's the complexity?" },
    { from: "mentor", text: "Opening code editor for you...", toolCall: "open_editor" },
  ],
  Advanced: [
    { from: "user", placeholder: "This looks like a two-pointer pattern." },
    { from: "mentor", text: "Nice recognition. Can you prove why it's optimal?" },
    { from: "codeAgent", text: "Edge case: sorted array with negative numbers. Try adjusting your solution." },
    { from: "user", placeholder: "Adjusting and testing..." },
    { from: "mentor", text: "Perfect. Final complexity?" },
  ],
};

export default function DynamicMentor() {
  const [skill, setSkill] = useState("Beginner");
  const [chat, setChat] = useState(mentorScripts["Beginner"].filter(m => m.from !== "user"));
  const [userInput, setUserInput] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [code, setCode] = useState("// Write your solution here");

  useEffect(() => {
    setChat(mentorScripts[skill].filter(m => m.from !== "user"));
    setUserInput("");
    setEditorOpen(false);
  }, [skill]);

  function handleUserSubmit() {
    if (!userInput.trim()) return;
    setChat(prev => [...prev, { from: "user", text: userInput }]);
    setUserInput("");

    const allMessages = mentorScripts[skill];
    const nextIndex = chat.length + 1;

    if (nextIndex < allMessages.length) {
      const nextMsg = allMessages[nextIndex];
      if (nextMsg.from === "mentor" || nextMsg.from === "codeAgent") {
        setChat(prev => [...prev, nextMsg]);
        if (nextMsg.toolCall === "open_editor") {
          setEditorOpen(true);
        }
      }
    }
  }

  return (
    <div style={{ display: "flex", height: "90vh", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          flex: 1,
          borderRight: "1px solid #ddd",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fefefe",
        }}
      >
        <h3>Choose Skill Level</h3>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          style={{ marginBottom: 20, padding: 8, fontSize: 16 }}
        >
          {skillLevels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: 12,
            backgroundColor: "#fafafa",
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          {chat.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: 12,
                textAlign: msg.from === "mentor" || msg.from === "codeAgent" ? "left" : "right",
                color:
                  msg.from === "mentor"
                    ? "#0070f3"
                    : msg.from === "codeAgent"
                    ? "#6a0dad"
                    : "#1a8917",
                fontStyle: msg.from === "codeAgent" ? "italic" : "normal",
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>
                {msg.from === "mentor"
                  ? "Mentor"
                  : msg.from === "codeAgent"
                  ? "Code Agent"
                  : "You"}
                :
              </strong>{" "}
              {msg.text}
            </div>
          ))}
        </div>

        <div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              mentorScripts[skill].find((m) => m.from === "user")?.placeholder || "Your answer..."
            }
            style={{
              width: "75%",
              padding: "10px",
              fontSize: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUserSubmit();
            }}
          />
          <button
            onClick={handleUserSubmit}
            disabled={!userInput.trim()}
            style={{
              padding: "10px 16px",
              marginLeft: 12,
              backgroundColor: "#0070f3",
              border: "none",
              color: "white",
              fontWeight: "bold",
              borderRadius: 4,
              cursor: userInput.trim() ? "pointer" : "not-allowed",
            }}
          >
            Submit
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: editorOpen ? "block" : "none" }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(val) => setCode(val)}
          options={{ minimap: { enabled: false }, fontSize: 16, wordWrap: "on" }}
        />
      </div>
    </div>
  );
}
