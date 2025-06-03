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
    <nav
      style={{
        backgroundColor: "#0070f3",
        padding: "10px 20px",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 24, letterSpacing: 1 }}>
        DSA Coach
      </div>

      {/* Desktop links */}
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: 20,
          margin: 0,
          padding: 0,
        }}
        className="desktop-menu"
      >
        {navLinks.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              style={({ isActive }) => ({
                color: isActive ? "#ffdd57" : "white",
                textDecoration: "none",
                fontWeight: isActive ? "bold" : "normal",
              })}
              onClick={() => setMenuOpen(false)} // close menu on click
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Hamburger menu button for mobile */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none",
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: 28,
          cursor: "pointer",
        }}
        className="mobile-menu-button"
        aria-label="Toggle Menu"
      >
        &#9776;
      </button>

      {/* Mobile menu (visible when menuOpen) */}
      {menuOpen && (
        <ul
          style={{
            position: "absolute",
            top: "60px",
            right: 20,
            backgroundColor: "#0070f3",
            borderRadius: 6,
            listStyle: "none",
            padding: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: 150,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 1100,
          }}
          className="mobile-menu"
        >
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                style={({ isActive }) => ({
                  color: isActive ? "#ffdd57" : "white",
                  textDecoration: "none",
                  fontWeight: isActive ? "bold" : "normal",
                })}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}

      {/* CSS for responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none;
          }
          .mobile-menu-button {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}
