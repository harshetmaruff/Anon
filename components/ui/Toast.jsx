"use client";
import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";

export function Toast() {
  const toast = useChatStore((s) => s.toast);
  const clearToast = useChatStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3000);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;
  return (
    <div className="fixed left-1/2 top-4 z-[100] -translate-x-1/2">
      <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 shadow-xl shadow-black/40">
        {toast.message}
      </div>
    </div>
  );
}
