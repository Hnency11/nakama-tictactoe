import React, { useState } from "react";

function Cell({ value, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 80, height: 80, fontSize: 32, borderRadius: 8, margin: 6
    }}>
      {value || ""}
    </button>
  );
}

export default function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const winner = (() => {
    const b = board;
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b1,c] of lines) {
      if (board[a] && board[a] === board[b1] && board[a] === board[c]) return board[a];
    }
    return null;
  })();

  function click(i) {
    if (board[i] || winner) return;
    const nb = board.slice();
    nb[i] = xTurn ? "X" : "O";
    setBoard(nb);
    setXTurn(!xTurn);
  }
  function reset() {
    setBoard(Array(9).fill(null));
    setXTurn(true);
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", maxWidth: 280 }}>
        {board.map((v,i) => <Cell key={i} value={v} onClick={()=>click(i)} />)}
      </div>
      <div style={{ marginTop: 12 }}>
        {winner ? <strong>Winner: {winner}</strong> : <span>Turn: {xTurn ? "X" : "O"}</span>}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
