"use client";

// Server tracks users as `DisplayName_xxxx`; UI shows only the short name.
export function shortName(internal) {
  if (!internal) return "";
  const i = internal.lastIndexOf("_");
  return i > 0 ? internal.slice(0, i) : internal;
}

const NAME_COLORS = ["text-sky-400", "text-amber-400", "text-emerald-400", "text-violet-400", "text-rose-400"];

export function nameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return NAME_COLORS[h % NAME_COLORS.length];
}

export function formatTs(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "";
  }
}
