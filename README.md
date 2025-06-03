# 🧠 Espyr DSA Coach

Espyr DSA Coach is an AI-powered web application designed to help users practice Data Structures and Algorithms (DSA) while receiving personalized guidance from an AI mentor agent. Inspired by platforms like LeetCode and ChatGPT, this project provides a complete full-stack system with problem practice, code editing, and mentorship simulation.

---

## 🏗️ Project Structure
---

## ⚙️ Tech Stack

### 💻 Frontend:
- React.js
- React Router
- Tailwind CSS (planned)
- Monaco Editor (for code interface)

### 🧠 Backend:
- FastAPI (Python)
- REST API
- CORS Middleware for React-FastAPI connection

---

## 🚀 Features

### ✅ Functional:
- View DSA problems (loaded from JSON)
- “Code” button for each problem (currently shows backend not connected)
- AI Mentor Agent:
  - Adapts based on selected skill level (Beginner, Intermediate, Advanced)
  - Simulated chat with dynamic hints and behavior
- Code Editor (Monaco) triggered by mentor agent

### 🔜 Upcoming:
- Backend logic for solving questions
- Code execution support
- Real AI agents (LLMs) connected via backend
- Tailwind-based UI enhancements

---

## 🧪 Development Setup

### 🔧 Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

## Frontend (React)
cd frontend
npm install
npm start


## 🌍 API Endpoints
Method	Route	Description
GET	/	Welcome message
GET	/problems	Fetch all DSA problems
POST	/mentor-agent/	Interact with mentor agent
POST	/code-agent/	(Planned) Code evaluations
/practice for code editor
