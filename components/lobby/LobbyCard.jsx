"use client";
import { useState } from "react";
import { Shield } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { JoinForm } from "@/components/lobby/JoinForm";
import { CreateForm } from "@/components/lobby/CreateForm";

export function LobbyCard() {
  const [mode, setMode] = useState("join");
  const [userName, setUserName] = useState("");

  const tabCls = (active) =>
    `rounded-lg px-3 py-2 text-center transition-all duration-150 ${
      active ? "bg-slate-800 font-medium text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
    }`;

  return (
    <div className="w-full max-w-[440px]">
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-xl shadow-black/40 backdrop-blur-sm">
        <div className="px-7 pb-5 pt-7 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-white">Start a conversation</h1>
          <p className="mt-1.5 text-sm text-slate-400">Private by design. No registration required.</p>
        </div>

        <div className="px-7 pb-2">
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-800/80 bg-slate-950/70 p-1 text-sm font-medium">
            <button type="button" className={tabCls(mode === "join")} onClick={() => setMode("join")}>
              Join Room
            </button>
            <button type="button" className={tabCls(mode === "create")} onClick={() => setMode("create")}>
              Create Room
            </button>
          </div>
        </div>

        <div className="space-y-4 p-7">
          <Input
            label="Your Name"
            placeholder="e.g. Alex"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={24}
          />
          {mode === "join" ? (
            <JoinForm userName={userName} setUserName={setUserName} />
          ) : (
            <CreateForm userName={userName} />
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Messages disappear automatically once all participants leave.
        </p>
      </div>
    </div>
  );
}
