"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket, getClientId } from "@/hooks/useSocket";
import { useChatStore } from "@/store/useChatStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function normalizeRoomInput(input) {
  const raw = (input || "").trim();
  // Accept full link or bare code; strip down to 16 alphanumerics
  const match = raw.match(/([A-Za-z0-9-]{16,})/);
  const code = (match ? match[1] : raw).replace(/-/g, "");
  return code;
}

export function JoinForm({ userName, setUserName }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const showToast = useChatStore((s) => s.showToast);

  const submit = (e) => {
    e.preventDefault();
    const name = userName.trim();
    const roomKey = normalizeRoomInput(code);
    if (!name) return showToast("Please enter your name", "error");
    if (roomKey.length !== 16) return showToast("Room not found or expired", "error");
    setBusy(true);
    const socket = getSocket();
    socket.emit("join_room", { roomKey, userName: name, clientId: getClientId() }, (res) => {
      setBusy(false);
      if (!res?.success) return showToast(res?.error || "Room not found or expired", "error");
      try {
        sessionStorage.setItem("anon_roomKey", roomKey);
        sessionStorage.setItem("anon_userName", name);
      } catch {}
      useChatStore.getState().setRoom(roomKey);
      useChatStore.getState().setUsers(res.currentUsers || []);
      router.push(`/room/${roomKey}`);
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        label="Room Code or Link"
        placeholder="Enter room code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <div className="pt-2">
        <Button type="submit" disabled={busy}>
          <span>{busy ? "Connecting..." : "Join Room"}</span>
        </Button>
      </div>
    </form>
  );
}
