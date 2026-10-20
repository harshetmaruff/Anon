"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io({ autoConnect: true });
  }
  return socketInstance;
}

// Stable per-tab identity. The server uses it to build the internal name
// (DisplayName_clientId) so the same person keeps one identity across
// reconnects and remounts instead of collecting duplicate suffixed copies.
let clientIdFallback = null;
export function getClientId() {
  try {
    let id = sessionStorage.getItem("anon_clientId");
    if (!id) {
      id = Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4);
      sessionStorage.setItem("anon_clientId", id);
    }
    return id;
  } catch {
    if (!clientIdFallback) {
      clientIdFallback = Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4);
    }
    return clientIdFallback;
  }
}

export function useSocket() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = getSocket();
    if (!ref.current.connected) ref.current.connect();
  }, []);
  return ref;
}

// Join a room now (if connected) and re-join automatically on every
// (re)connect. Without this, a reconnected socket silently stops receiving
// room events because server-side membership is per-connection.
// Returns a cleanup function that stops future (re)joins.
export function ensureRoomMembership(socket, payload, onAck) {
  let active = true;
  const doJoin = () => {
    if (!active) return;
    socket.emit("join_room", payload, (res) => {
      if (active) onAck(res);
    });
  };
  socket.on("connect", doJoin);
  if (socket.connected) doJoin();
  return () => {
    active = false;
    socket.off("connect", doJoin);
  };
}
