import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/problems", label: "Problems" },
    { path: "/mentor-agent", label: "Mentor Agent" },
    { path: "/mentor", label: "Mentor" },
    { path: "/practice/1", label: "Practice" },
  ];

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">DSA Coach</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `hover:text-yellow-300 transition font-medium ${
                    isActive ? "text-yellow-400 font-bold" : "text-white"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          &#9776;
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <ul className="md:hidden mt-3 bg-blue-600 rounded-lg shadow-lg px-4 py-2 flex flex-col gap-3 absolute right-6">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `block text-white hover:text-yellow-300 transition font-medium ${
                    isActive ? "text-yellow-400 font-bold" : "text-white"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
