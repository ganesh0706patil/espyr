import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";

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
  python: '# Start coding here\ndef solution():\n    // Your code here\n    pass',
  java: '// Start coding here\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}',
  cpp: '// Start coding here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}',
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
  const [language, setLanguage] = useState("javascript");
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
    const questionLanguage = languageMapRef.current[id] || "javascript";
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
  ? {
      type: customMessage,  // <-- key fix: send type = "hint" or "submit"
      message: "",           // optional: can be "" if not needed
      code,
      question: problem?.toString() || ""
    }
  : {
      code,
      question: problem?.toString() || "Explain this code"
    };
  
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
    handleSendMessage("hint");
  }, [handleSendMessage]);

  const handleSubmit = useCallback(() => {
    handleSendMessage("submit");
  }, [handleSendMessage]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Problem and Chat */}
        <div className="w-1/2 flex flex-col border-r border-gray-200">
          {/* Problem Section */}
          <div className="p-6 bg-white border-b border-gray-200">
            {problem ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">{problem.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {problem.description}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Loading problem...</div>
            )}
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex justify-between items-center p-4 bg-orange-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-orange-800">AI Assistant</h3>
              <button 
                onClick={clearChat} 
                className="px-3 py-1 rounded-md text-sm font-medium bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Clear Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-350px)]">
              {chatMessages.map((msg, i) => (
                <div
                  key={`${id}-${i}`}
                  className={`max-w-[85%] p-4 rounded-lg ${
                    msg.from === "ai" 
                      ? "bg-orange-50 text-gray-800 rounded-tl-none" 
                      : "bg-orange-100 text-gray-800 rounded-tr-none ml-auto"
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {msg.from === "ai" ? "🤖 AI Assistant" : "👤 You"}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="max-w-[85%] p-4 rounded-lg bg-orange-50 text-gray-800 rounded-tl-none">
                  <div className="font-semibold mb-1">🤖 AI Assistant</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse delay-200"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Actions */}
            <div className="p-4 bg-orange-50 border-t border-gray-200 space-x-2 flex">
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading}
                className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
                  isLoading ? 'bg-orange-300 text-white' : 'bg-orange-600 text-white hover:bg-orange-700 cursor-pointer'
                }`}
              >
                {isLoading ? "Analyzing..." : "Analyze Code"}
              </button>

              <button
                onClick={handleHint}
                disabled={isLoading}
                className="px-4 py-2 rounded-md font-medium text-sm bg-white text-orange-600 border border-orange-300 hover:bg-orange-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Hint
              </button>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 rounded-md font-medium text-sm bg-white text-orange-600 border border-orange-300 hover:bg-orange-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Editor */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="flex justify-between items-center p-4 bg-orange-50 border-b border-gray-200">
            <span className="font-medium text-orange-800">Code Editor</span>
            <div className="flex items-center space-x-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1 rounded-md border border-orange-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <button 
                onClick={clearCode} 
                className="px-3 py-1 rounded-md text-sm font-medium bg-white text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Clear Code
              </button>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                renderWhitespace: "selection",
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 10,
                overviewRulerBorder: false,
                padding: { top: 10, bottom: 10 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}