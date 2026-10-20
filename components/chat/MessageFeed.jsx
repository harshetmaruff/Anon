"use client";
import { useEffect, useRef } from "react";
import { Shield } from "lucide-react";
import { MessageBubble } from "@/components/chat/MessageBubble";

export function MessageFeed({ messages, myUserName }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 md:px-8">
      <div className="mb-6 flex justify-center">
        <div className="flex max-w-md items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 text-center text-xs text-slate-400 shadow-sm">
          <Shield size={16} className="shrink-0 text-sky-400" />
          <span>Messages in this room are private and end-to-end encrypted.</span>
        </div>
      </div>
      {messages.map((m, i) => (
        // Author is the server-assigned internal name, so this is an exact match
        <MessageBubble key={`${m.ts}-${i}`} msg={m} mine={m.user === myUserName} />
      ))}
    </div>
  );
}
