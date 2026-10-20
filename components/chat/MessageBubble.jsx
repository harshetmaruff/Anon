"use client";
import { shortName, nameColor, formatTs } from "@/components/chat/chatUtils";

export function MessageBubble({ msg, mine }) {
  if (mine) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[90%] space-y-1 rounded-2xl rounded-tr-sm border border-sky-500/40 bg-sky-600 px-4 py-2.5 shadow-sm md:max-w-[75%]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-sky-100">You ({shortName(msg.user)})</span>
          </div>
          <p className="select-text text-sm leading-relaxed text-white">{msg.text}</p>
          <div className="flex items-center justify-end pt-0.5">
            <span className="text-[11px] text-sky-200">{formatTs(msg.ts)}</span>
          </div>
        </div>
      </div>
    );
  }
  const display = shortName(msg.user);
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-1 rounded-2xl rounded-tl-sm border border-slate-800/80 bg-slate-900/90 px-4 py-2.5 shadow-sm md:max-w-[75%]">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-xs font-semibold ${nameColor(display)}`}>{display}</span>
        </div>
        <p className="select-text text-sm leading-relaxed text-slate-200">{msg.text}</p>
        <div className="flex items-center justify-end pt-0.5">
          <span className="text-[11px] text-slate-400">{formatTs(msg.ts)}</span>
        </div>
      </div>
    </div>
  );
}
