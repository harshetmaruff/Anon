"use client";
import { X } from "lucide-react";
import { shortName } from "@/components/chat/chatUtils";

export function UserSidebar({ users, myUserName, myInternal, open, desktopVisible, onClose }) {
  const list = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
        <span className="text-sm font-semibold text-slate-200">People in Room ({users.length})</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close participants"
          className="h-10 w-10 items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:text-slate-200"
          style={{ display: "inline-flex" }}
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {users.map((u) => {
          const display = shortName(u);
          // Exact match on the server-assigned internal name; fall back to the
          // display name only when the internal name is not known yet.
          const isMe = myInternal ? u === myInternal : display === myUserName;
          return (
            <div
              key={u}
              className={`flex items-center justify-between rounded-xl p-2.5 ${
                isMe
                  ? "border border-slate-700/40 bg-slate-800/60"
                  : "border border-transparent bg-slate-800/40"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
                <span className="truncate text-sm font-medium text-slate-100">
                  {isMe ? `${display} (You)` : display}
                </span>
              </div>
              {isMe && (
                <span className="rounded bg-slate-700/50 px-2 py-0.5 text-[11px] font-medium text-slate-400">
                  You
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar (collapsible via header toggle / X) */}
      <aside
        className={
          desktopVisible
            ? "hidden h-full w-72 shrink-0 flex-col border-l border-slate-800 bg-slate-900 md:flex"
            : "hidden"
        }
      >
        {list}
      </aside>
      {/* Mobile slide-over drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute inset-y-0 right-0 z-50 w-72 bg-slate-900 shadow-lg">
            {list}
          </aside>
        </div>
      )}
    </>
  );
}
