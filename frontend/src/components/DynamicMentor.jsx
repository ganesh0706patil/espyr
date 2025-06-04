import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";

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
    
    const newUserMessage = { from: "user", text: userInput };
    setChat((prev) => [...prev, newUserMessage]);
    setUserInput("");

    const allMessages = mentorScripts[skill];
    const nextIndex = chat.length + 1;

    if (nextIndex < allMessages.length) {
      const nextMsg = allMessages[nextIndex];
      if (nextMsg.from === "mentor" || nextMsg.from === "codeAgent") {
        setTimeout(() => {
          setChat((prev) => [...prev, nextMsg]);
          if (nextMsg.toolCall === "open_editor") {
            setEditorOpen(true);
          }
        }, 800);
      }
    }
  }

  return (
    <div className="flex h-[90vh] font-sans bg-white text-gray-900">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 border-r border-orange-200 p-6 flex flex-col"
      >
        <motion.h3 
          whileHover={{ scale: 1.02 }}
          className="text-2xl font-bold mb-6 text-orange-800"
        >
          Choose Skill Level
        </motion.h3>
        
        <motion.select
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="mb-6 p-3 text-base border-2 border-orange-300 cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-black shadow-sm"
        >
          {skillLevels.map((lvl) => (
            <option key={lvl} value={lvl} className="bg-white text-black">
              {lvl}
            </option>
          ))}
        </motion.select>

        <motion.div 
          whileHover={{ scale: 1.005 }}
          className="flex-1 overflow-y-auto border-2 border-orange-200 p-4 bg-orange-50 rounded-xl mb-4 shadow-inner"
        >
          <AnimatePresence>
            {chat.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30 
                  } 
                }}
                exit={{ opacity: 0 }}
                className={`mb-4 whitespace-pre-wrap ${
                  msg.from === "mentor" || msg.from === "codeAgent" ? "text-left" : "text-right"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`inline-block max-w-3/4 p-4 rounded-xl shadow-sm ${
                    msg.from === "mentor"
                      ? "bg-orange-100 text-orange-900 border-l-4 border-orange-600"
                      : msg.from === "codeAgent"
                      ? "bg-purple-100 text-purple-900 border-l-4 border-purple-600"
                      : "bg-gray-100 text-gray-900 border-l-4 border-gray-600"
                  }`}
                >
                  <strong
                    className={`text-sm font-semibold ${
                      msg.from === "mentor"
                        ? "text-orange-700"
                        : msg.from === "codeAgent"
                        ? "text-purple-700"
                        : "text-gray-700"
                    }`}
                  >
                    {msg.from === "mentor"
                      ? "Mentor"
                      : msg.from === "codeAgent"
                      ? "Code Agent"
                      : "You"}
                    :
                  </strong>{" "}
                  <span className="text-black">{msg.text}</span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="flex items-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.input
            whileFocus={{ 
              scale: 1.01,
              boxShadow: "0 0 0 2px rgba(234, 88, 12, 0.5)"
            }}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              mentorScripts[skill].find((m) => m.from === "user")?.placeholder || "Your answer..."
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUserSubmit();
            }}
            className="flex-1 p-3 text-base border-2 border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-black shadow-sm"
          />
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
            whileTap={{ 
              scale: 0.98,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
            onClick={handleUserSubmit}
            disabled={!userInput.trim()}
            className={`ml-3 px-6 py-3 font-bold rounded-xl ${
              userInput.trim()
                ? "bg-orange-700 hover:bg-orange-800 cursor-pointer text-white shadow-md"
                : "bg-orange-200 cursor-not-allowed text-orange-400"
            }`}
          >
            Submit
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {editorOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 30 
              } 
            }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 border-l border-orange-200"
          >
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(val) => setCode(val)}
              theme="vs"
              options={{ 
                minimap: { enabled: false }, 
                fontSize: 16, 
                wordWrap: "on",
                glyphMargin: true,
                lineNumbersMinChars: 3,
                folding: true,
                renderLineHighlight: 'gutter',
                overviewRulerBorder: false,
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden',
                  handleMouseWheel: true
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}