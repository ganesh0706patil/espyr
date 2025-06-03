import React from "react";

const footerStyle = {
  backgroundColor: "#0f172a",
  color: "#94a3b8",
  padding: "1rem 2rem",
  textAlign: "center",
  boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
  fontSize: "0.9rem",
  marginTop: "auto",
};

export default function Footer() {
  return (
    <footer style={footerStyle}>
      © 2025 DSA Coach. All rights reserved.
    </footer>
  );
}
