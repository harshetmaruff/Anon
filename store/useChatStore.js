"use client";
import { create } from "zustand";

export const useChatStore = create((set) => ({
  userName: "",
  roomKey: "",
  users: [],
  messages: [],
  toast: null, // { message, type }

  setUser: (userName) => set({ userName }),
  setRoom: (roomKey) => set({ roomKey }),
  setUsers: (users) => set({ users }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setMessages: (messages) => set({ messages }),
  showToast: (message, type = "info") => set({ toast: { message, type } }),
  clearToast: () => set({ toast: null }),
  reset: () => set({ roomKey: "", users: [], messages: [] }),
}));
