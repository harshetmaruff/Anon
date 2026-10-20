"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { getSocket } from "@/hooks/useSocket";
import { useChatStore } from "@/store/useChatStore";
import { Button } from "@/components/ui/Button";

export function CreateForm({ userName }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [fallbackCode, setFallbackCode] = useState(null);
  const showToast = useChatStore((s) => s.showToast);

  const create = () => {
    const name = userName.trim();
    if (!name) return showToast("Please enter your name", "error");
    setBusy(true);
    const socket = getSocket();
    socket.emit("create_room", { userName: name }, async (res) => {
      setBusy(false);
      if (!res?.roomKey) return showToast("Failed to create room", "error");
      const { roomKey } = res;
      const grouped = roomKey.replace(/(.{4})(.{4})(.{4})(.{4})/, "$1-$2-$3-$4");
      try {
        if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
        await navigator.clipboard.writeText(grouped);
        showToast("Room code copied to clipboard!");
      } catch {
        setFallbackCode(grouped); // modal with manual copy
      }
      try {
        sessionStorage.setItem("anon_roomKey", roomKey);
        sessionStorage.setItem("anon_userName", name);
      } catch {}
      useChatStore.getState().setRoom(roomKey);
      useChatStore.getState().setUser(name);
      router.push(`/room/${roomKey}`);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2.5 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 text-xs text-slate-400">
        <Info size={16} className="mt-0.5 shrink-0 text-sky-400" />
        <span className="leading-relaxed">
          A private room code will be generated and automatically copied to your clipboard.
        </span>
      </div>
      <div className="pt-2">
        <Button type="button" onClick={create} disabled={busy}>
          <span>{busy ? "Creating..." : "Create Room"}</span>
        </Button>
      </div>
      {fallbackCode && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
            <p className="text-sm text-slate-300">Copy your room code manually:</p>
            <p className="mt-2 break-all font-mono text-sm text-sky-400">{fallbackCode}</p>
            <div className="mt-4">
              <Button type="button" onClick={() => setFallbackCode(null)}>
                <span>Continue</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
