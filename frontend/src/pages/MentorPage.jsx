import React from "react";
import DynamicMentor from "../components/DynamicMentor";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function MentorPage() {
  return (
    <>
    <Navbar/>
    <div>
      <motion.h1
  className="
    text-center mt-8
    text-4xl font-extrabold
    bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700
    text-transparent bg-clip-text
    tracking-tight
    py-4 relative
    font-sans
  "
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  AI Mentor
  <motion.span
    className="
      absolute bottom-2 left-1/2 -translate-x-1/2
      w-24 h-1
      bg-gradient-to-r from-gray-500 to-gray-600
      rounded-full
    "
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ delay: 0.3, duration: 0.8, ease: "backOut" }}
  />
</motion.h1>
      <DynamicMentor />
    </div>
    </>
  );
}