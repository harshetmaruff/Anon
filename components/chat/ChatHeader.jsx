"use client";
import { useState } from "react";
import { Shield, Copy, Check, Users, LogOut } from "lucide-react";

export function ChatHeader({ roomKey, userCount, onCopy, onToggleUsers, onLeave }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between bg-slate-900 px-4 shadow-sm md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400">
            <Shield size={19} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">Anon</span>
        </div>
        <div className="hidden h-5 w-px bg-slate-800 sm:block" />
        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1">
          <span className="shrink-0 text-xs text-slate-400">Room:</span>
          <span className="truncate font-mono text-xs font-medium text-slate-200">#{roomKey}</span>
          <button
            type="button"
            onClick={copy}
            title="Copy room link"
            className="flex h-10 shrink-0 items-center gap-1 rounded bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400 transition-colors hover:bg-slate-700 hover:text-white md:h-auto"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
        </div>
        <div className="hidden items-center gap-1.5 pl-1 text-xs text-slate-400 lg:flex">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <span>{userCount} {userCount === 1 ? "person" : "people"} online</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleUsers}
          title="View participants"
          aria-label="View participants"
          className="h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 transition-colors hover:text-white"
          style={{ display: "inline-flex" }}
        >
          <Users size={18} />
        </button>
        <button
          type="button"
          onClick={onLeave}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-rose-500/30 hover:bg-rose-500/15 hover:text-rose-400"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Leave Room</span>
        </button>
      </div>
    </header>
  );
}
