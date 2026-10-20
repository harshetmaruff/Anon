"use client";
import { Shield } from "lucide-react";
import { LobbyCard } from "@/components/lobby/LobbyCard";
import { Toast } from "@/components/ui/Toast";

export default function LobbyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-200">
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400">
            <Shield size={19} />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-slate-100">Anon</span>
            <span className="ml-2 hidden text-xs text-slate-400 sm:inline">Simple, private conversations</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5 rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6">
        <LobbyCard />
      </main>
      <Toast />
    </div>
  );
}
