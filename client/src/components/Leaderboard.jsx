// client/src/components/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { useNakama } from "../context/NakamaProvider";

export default function Leaderboard() {
  const { socket } = useNakama();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!socket) return;
    (async () => {
      try {
        const res = await socket.rpc("get_leaderboard", "{}");
        const payload = JSON.parse(res.payload || "{}");
        setRows(payload.rows || []);
      } catch (e) {
        console.warn("Leaderboard RPC error", e);
      }
    })();
  }, [socket]);

  return (
    <div style={{ padding: 20 }}>
      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr><th>#</th><th>Player</th><th>Wins</th><th>Losses</th><th>Streak</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.userId || r.deviceId}>
              <td>{i+1}</td>
              <td>{r.username || r.deviceId}</td>
              <td>{r.wins}</td>
              <td>{r.losses}</td>
              <td>{r.current_streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
