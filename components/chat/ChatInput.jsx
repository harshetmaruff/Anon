"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="sticky bottom-0 shrink-0 border-t border-slate-800 bg-slate-900 p-3 md:p-4">
      <form onSubmit={submit} className="flex w-full items-center gap-2.5">
        <input
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          disabled={disabled}
          className="h-11 flex-1 rounded-xl border border-slate-700/70 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 transition-colors placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
        <button
          type="submit"
          disabled={disabled}
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-400 active:bg-sky-600 disabled:opacity-60"
        >
          <span>Send</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
