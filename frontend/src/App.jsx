import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import MentorAgent from "./pages/MentorAgent";
import Practice from "./pages/Practice";
import MentorPage from "./pages/MentorPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/mentor-agent" element={<MentorAgent />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/mentor" element={<MentorPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
