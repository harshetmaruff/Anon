"use client";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`flex w-full items-center justify-center space-x-1.5 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-medium text-slate-950 shadow-md shadow-sky-500/10 transition-colors duration-150 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
