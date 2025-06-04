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
  const [chat, setChat] = useState(mentorScripts["Beginner"].filter((m) => m.from !== "user"));
  const [userInput, setUserInput] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [code, setCode] = useState("// Write your solution here");

  useEffect(() => {
    setChat(mentorScripts[skill].filter((m) => m.from !== "user"));
    setUserInput("");
    setEditorOpen(false);
  }, [skill]);

  function handleUserSubmit() {
    if (!userInput.trim()) return;
    setChat((prev) => [...prev, { from: "user", text: userInput }]);
    setUserInput("");

    const allMessages = mentorScripts[skill];
    const nextIndex = chat.length + 1;

    if (nextIndex < allMessages.length) {
      const nextMsg = allMessages[nextIndex];
      if (nextMsg.from === "mentor" || nextMsg.from === "codeAgent") {
        setChat((prev) => [...prev, nextMsg]);
        if (nextMsg.toolCall === "open_editor") {
          setEditorOpen(true);
        }
      }
    }
  }

  return (
    <div className="flex h-[90vh] font-sans">
      <div className="flex-1 border-r border-gray-300 p-5 flex flex-col bg-white">
        <h3 className="text-lg font-semibold mb-4">Choose Skill Level</h3>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="mb-5 p-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {skillLevels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>

        <div className="flex-1 overflow-y-auto border border-gray-300 p-3 bg-gray-50 rounded-md mb-3">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 whitespace-pre-wrap ${
                msg.from === "mentor" || msg.from === "codeAgent" ? "text-left" : "text-right"
              }`}
            >
              <strong
                className={`${
                  msg.from === "mentor"
                    ? "text-blue-600"
                    : msg.from === "codeAgent"
                    ? "text-purple-700 italic"
                    : "text-green-700"
                }`}
              >
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

        <div className="flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              mentorScripts[skill].find((m) => m.from === "user")?.placeholder || "Your answer..."
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUserSubmit();
            }}
            className="w-3/4 p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUserSubmit}
            disabled={!userInput.trim()}
            className={`ml-3 px-5 py-3 font-semibold rounded-md text-white ${
              userInput.trim()
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </div>

      <div className={`flex-1 ${editorOpen ? "block" : "hidden"}`}>
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
