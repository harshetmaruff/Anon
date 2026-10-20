"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSocket, ensureRoomMembership, getClientId } from "@/hooks/useSocket";
import { useChatStore } from "@/store/useChatStore";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageFeed } from "@/components/chat/MessageFeed";
import { ChatInput } from "@/components/chat/ChatInput";
import { UserSidebar } from "@/components/chat/UserSidebar";
import { Toast } from "@/components/ui/Toast";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const urlKey = Array.isArray(params.roomKey) ? params.roomKey[0] : params.roomKey;

  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false); // mobile slide-over
  const [sidebarVisible, setSidebarVisible] = useState(true); // desktop pinned sidebar
  const userName = useChatStore((s) => s.userName);
  const users = useChatStore((s) => s.users);
  const messages = useChatStore((s) => s.messages);
  const myInternal = useChatStore((s) => s.myInternal);

  useEffect(() => {
    let name = "";
    try {
      name = sessionStorage.getItem("anon_userName") || "";
    } catch {}
    if (!name) {
      router.replace("/");
      return;
    }
    const socket = getSocket();
    useChatStore.getState().setUser(name);
    useChatStore.getState().setRoom(urlKey);
    useChatStore.getState().setMessages([]);

    const onMessage = (m) => useChatStore.getState().addMessage(m);
    // Prefer the authoritative full list; fall back to incremental update
    const onJoined = ({ userName: u, currentUsers }) =>
      useChatStore.setState((s) =>
        currentUsers
          ? { users: currentUsers }
          : s.users.includes(u)
            ? s
            : { users: [...s.users, u] }
      );
    const onLeft = ({ userName: u, currentUsers }) =>
      useChatStore.setState((s) =>
        currentUsers ? { users: currentUsers } : { users: s.users.filter((x) => x !== u) }
      );
    const onDestroyed = () => {
      try {
        sessionStorage.removeItem("anon_roomKey");
      } catch {}
      useChatStore.getState().reset();
      router.replace("/");
    };

    socket.on("new_message", onMessage);
    socket.on("user_joined", onJoined);
    socket.on("user_left", onLeft);
    socket.on("room_destroyed", onDestroyed);

    // Join now + auto re-join on reconnect (fresh join, refresh, or dropped
    // connection — server membership is per-connection, so without this the
    // tab silently stops receiving room events after a reconnect)
    const stopMembership = ensureRoomMembership(
      socket,
      { roomKey: urlKey, userName: name, clientId: getClientId() },
      (res) => {
        if (!res?.success) {
          useChatStore.getState().showToast(res?.error || "Room not found or expired", "error");
          router.replace("/");
          return;
        }
        useChatStore.getState().setUsers(res.currentUsers || []);
        useChatStore.getState().setMyInternal(res.internalName || "");
        try {
          sessionStorage.setItem("anon_roomKey", urlKey);
        } catch {}
        setReady(true);
      }
    );

    return () => {
      stopMembership();
      socket.off("new_message", onMessage);
      socket.off("user_joined", onJoined);
      socket.off("user_left", onLeft);
      socket.off("room_destroyed", onDestroyed);
      socket.emit("leave_room");
    };
  }, [urlKey, router]);

  const send = useCallback(
    (text) => {
      getSocket().emit("send_message", { roomKey: urlKey, userName: myInternal || userName, text, ts: Date.now() });
    },
    [urlKey, userName, myInternal]
  );

  const copy = useCallback(async () => {
    const grouped = urlKey.replace(/(.{4})(.{4})(.{4})(.{4})/, "$1-$2-$3-$4");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(grouped);
      useChatStore.getState().showToast("Room code copied to clipboard!");
    } catch {
      useChatStore.getState().showToast(`Room code: ${grouped}`, "error");
    }
  }, [urlKey]);

  const leave = useCallback(() => {
    getSocket().emit("leave_room");
    try {
      sessionStorage.removeItem("anon_roomKey");
    } catch {}
    useChatStore.getState().reset();
    router.push("/");
  }, [router]);

  const isDesktop = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

  // Header Users button: always visible; toggles the desktop sidebar on wide
  // screens, the slide-over drawer on mobile.
  const toggleUsers = useCallback(() => {
    if (isDesktop()) setSidebarVisible((v) => !v);
    else setDrawer((d) => !d);
  }, []);

  // Sidebar X button: hides whichever panel is showing; reopen via the header
  // Users button.
  const closeUsers = useCallback(() => {
    if (isDesktop()) setSidebarVisible(false);
    else setDrawer(false);
  }, []);

  if (!ready) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Connecting...</p>
        <Toast />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-slate-950 text-slate-100 antialiased">
      <ChatHeader
        roomKey={urlKey}
        userCount={users.length}
        onCopy={copy}
        onToggleUsers={toggleUsers}
        onLeave={leave}
      />
      <div className="relative flex w-full flex-1 overflow-hidden">
        <main className="flex h-full min-w-0 flex-1 flex-col bg-slate-950">
          <MessageFeed messages={messages} myUserName={myInternal || userName} />
          <ChatInput onSend={send} disabled={!ready} />
        </main>
        <UserSidebar
          users={users}
          myUserName={myInternal || userName}
          myInternal={myInternal}
          open={drawer}
          desktopVisible={sidebarVisible}
          onClose={closeUsers}
        />
      </div>
      <Toast />
    </div>
  );
}
