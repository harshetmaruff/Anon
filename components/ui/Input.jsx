"use client";

export function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium tracking-wide text-slate-300">{label}</label>
      )}
      <input
        className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
        {...props}
      />
    </div>
  );
}
