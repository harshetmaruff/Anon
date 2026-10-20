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
