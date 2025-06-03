import React from "react";

const homeStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "calc(100vh - 128px)", // approximate for navbar+footer
  backgroundColor: "#f4f7fa",
  textAlign: "center",
  padding: "0 1rem",
};

const titleStyle = {
  fontSize: "3rem",
  fontWeight: "700",
  color: "#0f172a",
  marginBottom: "0.5rem",
};

const subtitleStyle = {
  fontSize: "1.25rem",
  maxWidth: "600px",
  lineHeight: "1.6",
  color: "#475569",
};

export default function Home() {
  return (
    <div style={homeStyle}>
      <h1 style={titleStyle}>Welcome to DSA Coach</h1>
      <p style={subtitleStyle}>
        Practice coding problems and get mentorship powered by AI.
      </p>
    </div>
  );
}
