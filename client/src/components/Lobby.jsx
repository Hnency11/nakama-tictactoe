// client/src/components/Lobby.jsx
import React, { useEffect, useState } from "react";
import { useNakama } from "../context/NakamaProvider";

export default function Lobby({ onEnterMatch }) {
  const { socket, connected } = useNakama();
  const [mode, setMode] = useState("classic");
  const [timeLimit, setTimeLimit] = useState(30);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!socket) return;
    let mounted = true;
    (async () => {
      try {
        const res = await socket.rpc("list_matches", JSON.stringify({ mode }));
        const payload = JSON.parse(res.payload || "{}");
        if (!mounted) return;
        setMatches(payload.matches || []);
      } catch (e) {
        console.warn("Lobby: list_matches error", e);
      }
    })();
    return () => { mounted = false; };
  }, [socket, mode]);

  async function handleQuickMatch() {
    if (!socket) return;
    try {
      const res = await socket.rpc("create_or_find_match", JSON.stringify({ mode, timeLimitSeconds: mode === "timed" ? timeLimit : null }));
      const payload = JSON.parse(res.payload || "{}");
      onEnterMatch(payload.matchId);
    } catch (e) {
      console.error("create_or_find_match error", e);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Lobby</h2>
      <div>
        <label><input type="radio" name="mode" value="classic" checked={mode==='classic'} onChange={()=>setMode('classic')} /> Classic</label>
        <label style={{ marginLeft: 12 }}><input type="radio" name="mode" value="timed" checked={mode==='timed'} onChange={()=>setMode('timed')} /> Timed</label>
        {mode === 'timed' && (
          <div style={{ marginTop: 8 }}>
            Seconds per turn: <input type="number" min="5" max="120" value={timeLimit} onChange={e=>setTimeLimit(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
          </div>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={handleQuickMatch} disabled={!connected}>Quick Match</button>
      </div>

      <h3 style={{ marginTop: 20 }}>Open Matches</h3>
      {matches.length === 0 && <div>No open matches</div>}
      <ul>
        {matches.map(m => (
          <li key={m.matchId}>
            <strong>{m.matchId}</strong> — players: {m.players?.length || 0}
            <button style={{ marginLeft: 8 }} onClick={()=>onEnterMatch(m.matchId)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
