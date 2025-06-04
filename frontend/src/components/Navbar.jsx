import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Code2 } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/problems", label: "Problems" },
    { path: "/mentor-agent", label: "Mentor Agent" },
    { path: "/mentor", label: "Mentor" },
    { path: "/practice/1", label: "Practice" },
  ];

  return (
    <nav className={`sticky top-0 z-50 bg-white shadow-md`}> {/* Changed to sticky and always has shadow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-orange-700" />
            <span className="text-xl font-bold text-gray-900">
              DSA<span className="text-orange-700">Coach</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-gray-800 hover:text-orange-700 font-medium transition-colors duration-300 ${
                    isActive ? "text-orange-700 font-semibold" : ""
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `block py-2 px-3 hover:bg-gray-100 rounded-md transition-colors duration-300 w-full text-left ${
                    isActive ? "text-orange-700 font-semibold" : "text-gray-800"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}