// client/src/nakama/client.js
// Minimal stub used for submission (no Nakama calls)
console.log("Nakama client stub loaded");

export async function createSession() {
  // return a dummy session so frontend code that expects it won't crash
  return { token: "dummy-token" };
}

export async function createSocket() {
  // dummy socket with minimal functions
  return {
    connect: async () => console.log("dummy socket connect"),
    disconnect: () => console.log("dummy socket disconnect"),
    joinMatch: async () => {},
    leaveMatch: async () => {},
    sendMatchState: () => {}
  };
}

