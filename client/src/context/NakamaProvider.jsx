// client/src/context/NakamaProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { createSession, createSocket } from "../nakama/client";

const NakamaContext = createContext();

export function useNakama() {
  return useContext(NakamaContext);
}

export function NakamaProvider({ children }) {
  const [session, setSession] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await createSession();
        if (!mounted) return;
        setSession(s);
        const sock = await createSocket(s);
        if (!mounted) return;
        setSocket(sock);
        setConnected(true);
        console.info("NakamaProvider: connected");
      } catch (err) {
        console.error("NakamaProvider connect error:", err);
        setConnected(false);
      }
    })();

    return () => {
      mounted = false;
      if (socket) {
        try { socket.disconnect(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NakamaContext.Provider value={{ session, socket, connected }}>
      {children}
    </NakamaContext.Provider>
  );
}
