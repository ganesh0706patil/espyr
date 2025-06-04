import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

const CHAT_KEY = "practice_chat_map";
const CODE_KEY = "practice_code_map";
const LANGUAGE_KEY = "practice_language_map";

// Available programming languages
const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'java', name: 'Java', extension: '.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'c', name: 'C', extension: '.c' },
  { id: 'csharp', name: 'C#', extension: '.cs' },
  { id: 'go', name: 'Go', extension: '.go' },
  { id: 'rust', name: 'Rust', extension: '.rs' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts' },
  { id: 'php', name: 'PHP', extension: '.php' },
];

// Default code templates for each language
const DEFAULT_CODE_TEMPLATES = {
  javascript: '// Start coding here\nfunction solution() {\n    // Your code here\n}',
  python: '# Start coding here\ndef solution():\n    # Your code here\n    pass',
  java: '// Start coding here\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
  cpp: '// Start coding here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
  c: '// Start coding here\n#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}',
  csharp: '// Start coding here\nusing System;\n\nclass Program {\n    static void Main() {\n        // Your code here\n    }\n}',
  go: '// Start coding here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n}',
  rust: '// Start coding here\nfn main() {\n    // Your code here\n}',
  typescript: '// Start coding here\nfunction solution(): void {\n    // Your code here\n}',
  php: '<?php\n// Start coding here\nfunction solution() {\n    // Your code here\n}\n?>'
};

export default function Practice() {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("text/x-c++src");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState(null);

  // Use refs to avoid unnecessary re-renders
  const codeMapRef = useRef({});
  const languageMapRef = useRef({});
  const chatMapRef = useRef({});
  const isInitializedRef = useRef(false);
  const currentIdRef = useRef(null);

  // Initialize data on first mount
  useEffect(() => {
    if (isInitializedRef.current) return;

    // Load stored data
    const storedCodeMap = localStorage.getItem(CODE_KEY);
    const storedChatMap = localStorage.getItem(CHAT_KEY);
    const storedLanguageMap = localStorage.getItem(LANGUAGE_KEY);

    if (storedCodeMap) {
      try {
        codeMapRef.current = JSON.parse(storedCodeMap);
      } catch (e) {
        console.error("Failed to parse stored code map:", e);
        codeMapRef.current = {};
      }
    }

    if (storedLanguageMap) {
      try {
        languageMapRef.current = JSON.parse(storedLanguageMap);
      } catch (e) {
        console.error("Failed to parse stored language map:", e);
        languageMapRef.current = {};
      }
    }

    if (storedChatMap) {
      try {
        chatMapRef.current = JSON.parse(storedChatMap);
      } catch (e) {
        console.error("Failed to parse stored chat map:", e);
        chatMapRef.current = {};
      }
    }

    isInitializedRef.current = true;
  }, []);

  // Load problem data
  useEffect(() => {
    import('../data/questions.json')
      .then(module => {
        const data = module.default;
        const selected = data.find((q) => String(q.id) === id);
        setProblem(selected);
      })
      .catch((err) => console.error("Failed to load problem:", err));
  }, [id]);

  // Handle question switching
  useEffect(() => {
    if (!id || !isInitializedRef.current) return;

    // Save current question's data before switching
    if (currentIdRef.current && currentIdRef.current !== id) {
      // Save previous question's code
      if (code.trim()) {
        codeMapRef.current[`${currentIdRef.current}-${language}`] = code;
        localStorage.setItem(CODE_KEY, JSON.stringify(codeMapRef.current));
      }

      // Save previous question's language
      languageMapRef.current[currentIdRef.current] = language;
      localStorage.setItem(LANGUAGE_KEY, JSON.stringify(languageMapRef.current));

      // Save previous question's chat
      if (chatMessages.length > 0) {
        chatMapRef.current[currentIdRef.current] = chatMessages;
        localStorage.setItem(CHAT_KEY, JSON.stringify(chatMapRef.current));
      }
    }

    // Load new question's data
    const questionLanguage = languageMapRef.current[id] || "text/x-c++src";
    const questionCode = codeMapRef.current[`${id}-${questionLanguage}`] || DEFAULT_CODE_TEMPLATES[questionLanguage];
    const questionChat = chatMapRef.current[id] || [
      { from: "ai", text: "Ask me anything about this problem!" }
    ];

    setLanguage(questionLanguage);
    setCode(questionCode);
    setChatMessages(questionChat);
    currentIdRef.current = id;
  }, [id]);

  // Debounced save function for code
  const saveCodeDebounced = useCallback(
    (() => {
      let timeoutId;
      return (newCode, currentLanguage) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (id && newCode.trim()) {
            codeMapRef.current[`${id}-${currentLanguage}`] = newCode;
            localStorage.setItem(CODE_KEY, JSON.stringify(codeMapRef.current));
          }
        }, 500); // Save after 500ms of no typing
      };
    })(),
    [id]
  );

  // Handle code changes
  const handleCodeChange = useCallback((value) => {
    const newCode = value || "";
    setCode(newCode);
    saveCodeDebounced(newCode, language);
  }, [saveCodeDebounced, language]);

  // Save chat immediately when it changes
  useEffect(() => {
    if (!id || !isInitializedRef.current || chatMessages.length === 0) return;

    const timeoutId = setTimeout(() => {
      chatMapRef.current[id] = chatMessages;
      localStorage.setItem(CHAT_KEY, JSON.stringify(chatMapRef.current));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [chatMessages, id]);

  const handleSendMessage = useCallback(async (customMessage = null) => {
    const message = customMessage || "Please analyze my code.";
  
    setChatMessages(prev => [...prev, { from: "user", text: message }]);
    setIsLoading(true);
  
    try {
      const endpoint = customMessage ? "chat" : "analyze";
  
      const payload = customMessage
        ? { message: customMessage, code, language, problemId: id, problem }
        : { code, question: problem?.toString() || "Explain this code" };
  
      console.log("Sending payload to backend:", payload);
  
      const response = await fetch(`http://localhost:8000/code-agent/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        setChatMessages(prev => [...prev, { from: "ai", text: "Backend error: " + (errorData.error || "Unknown error") }]);
        setIsLoading(false);
        return;
      }
  
      const data = await response.json();
      const aiResponse = data.feedback || data.response || "No response from backend";
  
      setChatMessages(prev => [...prev, { from: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Fetch error:", error);
      setChatMessages(prev => [...prev, { from: "ai", text: "Error connecting to backend" }]);
    } finally {
      setIsLoading(false);
    }
  }, [code, language, id, problem]);
  

  const clearChat = useCallback(() => {
    const defaultChat = [{ from: "ai", text: "Ask me anything about this problem!" }];
    setChatMessages(defaultChat);
  }, []);

  const clearCode = useCallback(() => {
    setCode(DEFAULT_CODE_TEMPLATES[language] || "");
  }, [language]);

  const handleLanguageChange = useCallback((newLanguage) => {
    // Save current code before switching language
    if (code?.trim() && id) {
      codeMapRef.current[`${id}-${language}`] = code;
      localStorage.setItem(CODE_KEY, JSON.stringify(codeMapRef.current));
    }
  
    // Save language preference
    languageMapRef.current[id] = newLanguage;
    localStorage.setItem(LANGUAGE_KEY, JSON.stringify(languageMapRef.current));
  
    // Load code for new language or use template
    const newCode = codeMapRef.current[`${id}-${newLanguage}`] || DEFAULT_CODE_TEMPLATES[newLanguage];
  
    setLanguage(newLanguage);
    setCode(newCode);
  }, [code, language, id]);

  const handleHint = useCallback(() => {
    handleSendMessage("Can you give me a hint for this problem?");
  }, [handleSendMessage]);

  const handleExplain = useCallback(() => {
    handleSendMessage("Can you explain the problem approach?");
  }, [handleSendMessage]);

  return (
    <div style={containerStyle}>
      {/* Left Panel */}
      <div style={leftPanelStyle}>
        {problem ? (
          <div style={problemSectionStyle}>
            <h2 style={problemTitleStyle}>{problem.title}</h2>
            <p style={problemDescStyle}>{problem.description}</p>
            <p style={problemDiffStyle}>
              <strong>Difficulty:</strong>
              <span style={{
                ...difficultyBadgeStyle,
                backgroundColor: getDifficultyColor(problem.difficulty)
              }}>
                {problem.difficulty}
              </span>
            </p>
          </div>
        ) : (
          <div style={loadingStyle}>Loading problem...</div>
        )}

        {/* Chat Section */}
        <div style={chatContainerStyle}>
          <div style={chatHeaderStyle}>
            <h3 style={chatTitleStyle}>AI Assistant</h3>
            <button onClick={clearChat} style={clearChatBtnStyle}>
              Clear
            </button>
          </div>

          <div style={chatMessagesStyle}>
            {chatMessages.map((msg, i) => (
              <div
                key={`${id}-${i}`} // Stable key that includes question ID
                style={{
                  ...messageStyle,
                  alignSelf: msg.from === "ai" ? "flex-start" : "flex-end",
                  backgroundColor: msg.from === "ai" ? "#e3f2fd" : "#e8f5e8",
                }}
              >
                <div style={messageSenderStyle}>
                  {msg.from === "ai" ? "🤖 AI" : "👤 You"}
                </div>
                <div style={messageTextStyle}>{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div style={{ ...messageStyle, backgroundColor: "#f5f5f5" }}>
                <div style={messageSenderStyle}>🤖 AI</div>
                <div style={messageTextStyle}>Thinking...</div>
              </div>
            )}
          </div>



          {/* Chat Actions */}
          <div style={chatActionsStyle}>
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              style={{ ...actionBtnStyle, backgroundColor: "#2196f3" }}
            >
              {isLoading ? "Analyzing..." : "Analyze Code"}
            </button>

            <button
              onClick={handleHint}
              disabled={isLoading}
              style={{ ...actionBtnStyle, backgroundColor: "#4caf50" }}
            >
              Get Hint
            </button>

            <button
              onClick={handleExplain}
              disabled={isLoading}
              style={{ ...actionBtnStyle, backgroundColor: "#ff9800" }}
            >
              Explain
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div style={rightPanelStyle}>
        <div style={editorHeaderStyle}>
          <span style={editorTitleStyle}>Code Editor</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              fontSize: "0.9rem",
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <button onClick={clearCode} style={clearCodeBtnStyle}>
            Clear Code
          </button>
        </div>

        <div style={editorContainerStyle}>
          <Editor
            height="100%"
            language={language} // Dynamically set the language
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return '#4caf50';
    case 'medium': return '#ff9800';
    case 'hard': return '#f44336';
    default: return '#757575';
  }
};

// Styles
const containerStyle = {
  display: "flex",
  height: "90vh",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const leftPanelStyle = {
  flex: 1,
  borderRight: "1px solid #e0e0e0",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fafafa",
};

const problemSectionStyle = {
  padding: "20px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "white",
};

const problemTitleStyle = {
  margin: "0 0 15px 0",
  color: "#1976d2",
  fontSize: "1.5rem",
};

const problemDescStyle = {
  margin: "0 0 15px 0",
  lineHeight: "1.6",
  color: "#424242",
};

const problemDiffStyle = {
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const difficultyBadgeStyle = {
  color: "white",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "0.8rem",
  fontWeight: "bold",
};

const loadingStyle = {
  padding: "20px",
  textAlign: "center",
  color: "#757575",
};

const chatContainerStyle = {
  flex: 1,
  maxHeight: '70vh', 
  display: "flex",
  flexDirection: "column",
  margin: "10px",
  backgroundColor: "white",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  overflowY: "auto",
};

const chatHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px 8px 0 0",
};

const chatTitleStyle = {
  margin: 0,
  fontSize: "1.1rem",
  color: "#1976d2",
};

const clearChatBtnStyle = {
  padding: "4px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  backgroundColor: "white",
  cursor: "pointer",
  fontSize: "0.8rem",
};

const chatMessagesStyle = {
  flex: 1,
  padding: "15px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const messageStyle = {
  maxWidth: "85%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #e0e0e0",
};

const messageSenderStyle = {
  fontSize: "0.8rem",
  fontWeight: "bold",
  marginBottom: "5px",
  opacity: 0.8,
};

const messageTextStyle = {
  lineHeight: "1.4",
  whiteSpace: "pre-wrap",
};

const chatActionsStyle = {
  padding: "15px",
  display: "flex",
  gap: "8px",
  borderTop: "1px solid #e0e0e0",
  backgroundColor: "#f9f9f9",
  borderRadius: "0 0 8px 8px",
};

const actionBtnStyle = {
  flex: 1,
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  color: "white",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "0.9rem",
  transition: "opacity 0.2s",
};

const rightPanelStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const editorHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 15px",
  backgroundColor: "#f5f5f5",
  borderBottom: "1px solid #e0e0e0",
};

const editorTitleStyle = {
  fontWeight: "500",
  color: "#424242",
};

const clearCodeBtnStyle = {
  padding: "6px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  backgroundColor: "white",
  cursor: "pointer",
  fontSize: "0.8rem",
  color: "#d32f2f",
};

const editorContainerStyle = {
  flex: 1,
};