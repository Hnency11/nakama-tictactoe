import React from "react";
import Game from "./components/Game";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Tic-Tac-Toe — Submission Build</h1>
      <p style={{ color: "#666" }}>Minimal local UI (Nakama disabled for submission).</p>
      <Game />
    </div>
  );
}
