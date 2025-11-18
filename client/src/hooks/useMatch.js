// client/src/hooks/useMatch.js
import { useEffect, useRef, useState } from "react";

export function useMatch({ socket, matchId: initialMatchId = null, onState }) {
  const [matchId, setMatchId] = useState(initialMatchId);
  const [players, setPlayers] = useState([]);
  const [state, setState] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const onMatchData = (envelope) => {
      try {
        const text = new TextDecoder().decode(envelope.data);
        const payload = JSON.parse(text);
        // ignore if matchId mismatch
        if (payload.matchId && matchId && payload.matchId !== matchId) return;

        if (payload.type === "state") {
          setState(payload.state);
          onState?.(payload.state);
        } else if (payload.type === "turn") {
          const expiresAt = payload.turn.expiresAt;
          startCountdown(expiresAt);
        } else if (payload.type === "players") {
          setPlayers(payload.players || []);
        }
      } catch (e) {
        console.warn("useMatch: bad match data", e);
      }
    };

    socket.onmatchdata = onMatchData;
    return () => {
      if (socket && socket.onmatchdata === onMatchData) socket.onmatchdata = null;
      stopCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, matchId]);

  function startCountdown(expiresAt) {
    stopCountdown();
    const tick = () => {
      const now = Date.now();
      const sec = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setRemaining(sec);
      if (sec <= 0) stopCountdown();
    };
    tick();
    timerRef.current = setInterval(tick, 300);
  }
  function stopCountdown() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function joinMatch(mid) {
    if (!socket) throw new Error("No socket");
    await socket.joinMatch(mid);
    setMatchId(mid);
    return mid;
  }

  async function leaveMatch() {
    if (!socket || !matchId) return;
    try { await socket.leaveMatch(matchId); } catch {}
    setMatchId(null);
    setState(null);
  }

  function sendMove(move) {
    if (!socket || !matchId) throw new Error("No match/socket");
    const payload = JSON.stringify({ action: "move", move, matchId });
    socket.sendMatchState(matchId, 1, new TextEncoder().encode(payload));
  }

  async function createOrFindMatch({ mode = "classic", timeLimitSeconds = null }) {
    // call server RPC - the server must implement it
    const res = await socket.rpc("create_or_find_match", JSON.stringify({ mode, timeLimitSeconds }));
    const payload = JSON.parse(res.payload || "{}");
    return payload.matchId;
  }

  return { matchId, players, state, remaining, joinMatch, leaveMatch, sendMove, createOrFindMatch };
}
