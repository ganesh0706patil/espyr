import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import questionsData from "../data/questions.json";
import { UserCircle, Bot } from "lucide-react";

export default function MentorAgent() {
  const { id } = useParams(); // Extract the question ID from URL parameters
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Set the selected question ID based on URL parameter when component mounts
  useEffect(() => {
    if (id) {
      const questionId = parseInt(id, 10);
      // Check if the question with this ID exists
      const questionExists = questionsData.find(q => q.id === questionId);
      if (questionExists) {
        setSelectedQuestionId(questionId);
      } else {
        // Fallback to first question if ID doesn't exist
        setSelectedQuestionId(questionsData[0]?.id || 1);
      }
    } else {
      // Default to first question if no ID in URL
      setSelectedQuestionId(questionsData[0]?.id || 1);
    }
  }, [id]);

  // Load chat messages from memory when component mounts or question changes
  useEffect(() => {
    if (selectedQuestionId) {
      const storedMessages = window.chatHistory?.[selectedQuestionId] || [];
      setMessages(storedMessages);
    }
  }, [selectedQuestionId]);

  // Save chat messages to memory whenever messages change
  useEffect(() => {
    if (selectedQuestionId && messages.length > 0) {
      if (!window.chatHistory) {
        window.chatHistory = {};
      }
      window.chatHistory[selectedQuestionId] = messages;
    }
  }, [messages, selectedQuestionId]);

  // Get current question based on selectedQuestionId
  const currentQuestion = questionsData.find((q) => q.id === selectedQuestionId) || null;

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput || !currentQuestion) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
    setUserInput("");
    setLoading(true);

    try {
      // Prepare payload for backend
      const payload = {
        user_input: trimmedInput,
        skill_level: "intermediate", // Default skill level since we removed the selector
        problem_description: currentQuestion.description,
        problem_id: String(currentQuestion.id),
        user_id: "user123",  
      };

      // Call backend mentor chat API
      const response = await fetch("http://127.0.0.1:8000/mentor-agent/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Add mentor response to chat
      setMessages((prev) => [
        ...prev,
        { role: "mentor", content: data.message || "No response from mentor agent." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "mentor", content: "⚠️ Error: Unable to reach mentor agent." },
      ]);
    } finally {
      setLoading(false);
    }
  }, [userInput, currentQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const clearChat = () => {
    setMessages([]);
    if (window.chatHistory && selectedQuestionId) {
      delete window.chatHistory[selectedQuestionId];
    }
  };

  // Show loading state while question is being set
  if (selectedQuestionId === null) {
    return (
      <>
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading question...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-screen flex flex-col bg-gradient-to-br from-white to-gray-100">
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">Mentor Agent</h1>
              <p className="text-sm text-gray-500 mt-1">AI-powered DSA mentor chat</p>
            </div>
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors duration-200"
              >
                Clear Chat
              </button>
            )}
          </div>
        </header>

        {/* Question Description */}
        {currentQuestion && (
          <section className="bg-white px-6 py-4 border-b text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{currentQuestion.title}</h2>
                <p className="mt-1">{currentQuestion.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ml-4 ${
                currentQuestion.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                currentQuestion.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
          </section>
        )}

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <Bot size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg mb-2">💬 Welcome to your AI Mentor!</p>
              <p className="text-sm">Ask questions about the problem or share your approach to get personalized guidance.</p>
              <p className="text-xs mt-2 text-gray-300">Your chat history will be saved and persist across page visits.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "mentor" && (
                <div className="text-gray-500">
                  <Bot size={24} />
                </div>
              )}
              <div
                className={`px-4 py-2 max-w-[70%] rounded-xl shadow-sm transition-all duration-300 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-orange-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="text-gray-400">
                  <UserCircle size={24} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start space-x-3 justify-start">
              <div className="text-gray-500">
                <Bot size={24} />
              </div>
              <div className="px-4 py-2 bg-gray-200 text-gray-900 rounded-xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 bg-white border-t flex gap-3 items-start"
        >
          <textarea
            className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none"
            rows="2"
            placeholder="Explain your approach or ask a question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !userInput.trim()}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors duration-200 min-w-[80px]"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </>
  );
}