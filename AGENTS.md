# AGENTS.md — Anon (ephemeral anonymous chat)

Status: demo-complete. All of `README.md` Suggested File Structure is implemented
(`server.js`, `lib/`, `app/`, `components/`, `store/`, `hooks/`, `styles/`).
Remaining: explicit 5s heartbeat (Socket.io disconnect cleanup covers it for now).

## Source of truth (in priority order)

1. `README.md` — Redis model, Socket.io event contract, edge cases, responsive guardrails, out-of-scope. Trust it for behavior.
2. `DESIGN/Lobby.html`, `DESIGN/ChatRoom.html` — pixel reference for lobby + chat layout. Copy structure/styling, don't redesign.
3. `DESIGN/DESIGN.md` — token source: canvas `#020617`/`slate-950`, card `#0f172a`/`slate-900`, borders `slate-800`, primary Sky `#0ea5e9` hover `#38bdf8`, trust Emerald `#34d399`, Inter only, card `max-w-[440px]` / `rounded-2xl`, inputs `bg-slate-950/70 rounded-xl`, focus `focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20`.
   - Conflict note: `README.md` UI section mentions emerald CTAs / `gray-950` / JetBrains Mono — prefer `DESIGN/*` (sky + slate + Inter) unless user says otherwise.
   - Deliberate deviations the user approved: chat bubbles `md:max-w-[75%]` (not 540px) + full-width input so wide screens fill; lobby + chat header both use the Shield badge (`rounded-lg`, `Shield size 19`).

## Architecture (as built)

- Stack: Next.js App Router + Tailwind v3 + Socket.io on custom `server.js` + Redis + Zustand (`store/useChatStore.js`) + Lucide icons. Run via `npm run dev` / `npm start` (`node server.js`) — never `next dev` alone. Needs local Redis on `6379` or `REDIS_URL` (see `.env.example`).
- Entrypoints: `server.js` (Next + Socket.io), `lib/redis.js` (singleton), `lib/socket.js` (handlers), `lib/roomUtils.js` (key gen, key helpers, `destroyRoomIfEmpty`), `app/page.js` (lobby `/`), `app/room/[roomKey]/page.js`, `hooks/useSocket.js` (`getSocket` singleton + `ensureRoomMembership`).
- path alias `@/*` → repo root (`jsconfig.json`).
- Redis: `room:{key}` Hash `{createdAt, ttl}` 24h TTL (fail-safe) · `users:{key}` Set (Socket.io-managed, TTL refreshed on join) · `messages:{key}` List capped 100 via `LTRIM`. When `SCARD users:{key}==0` the room is deleted after a 5s grace period (the delete is cancelled if anyone rejoins) — the grace period is required so a React StrictMode remount (dev) or a fast Socket.io reconnect cannot destroy a room the user is about to rejoin.
- Events: `create_room {userName}` → `{roomKey}` · `join_room {roomKey,userName}` → `{success,currentUsers}` · `leave_room` · `send_message {roomKey,userName,text,ts}` → broadcast `new_message` · `user_joined` / `user_left` (both carry full `currentUsers` list — clients sync from it, not incremental adds) / `room_destroyed` · `disconnect` = `leave_room`.
- Client must re-emit `join_room` on every socket `connect` (see `ensureRoomMembership` in `hooks/useSocket.js`) — server membership is per-connection, otherwise a reconnected tab silently stops receiving room events.
- Room key: 16 alphanumerics via `crypto.randomBytes`, display grouped `xxxx-xxxx-xxxx-xxxx`.
- Identity: server stores `DisplayName_{clientId}` in the users Set; the client id is generated per tab (`getClientId()` in `hooks/useSocket.js`, kept in `sessionStorage`) and sent with `create_room`/`join_room`, so the same person keeps one identity across reconnects and remounts. `join_room` reuses an existing member with the same client id instead of minting a second one. UI shows short name only (`shortName()` in `components/chat/chatUtils.js`); self-detection is an exact match on the server-assigned internal name, so same-name users are not confused.
- Sidebar behavior (user-specified, differs from README guardrails): header Users button is visible on ALL screens; on desktop it toggles the pinned sidebar (`sidebarVisible` state), on mobile the slide-over drawer. Sidebar X is visible on all screens and hides its panel; reopen via Users button. Buttons use inline `display:inline-flex` + original styling — do not "clean up" or hide them without asking.
- Edge cases (all implemented): name-collision suffix · invalid key → toast "Room not found or expired", stay on lobby · refresh re-join via `sessionStorage` (`anon_roomKey`/`anon_userName`) · last-leave → `room_destroyed` → redirect to `/` · clipboard fallback (create: modal; chat header: toast with code) · create-room toast "Room code copied to clipboard!".

## Constraints / gotchas

- Ephemeral + privacy are the product: no accounts, no room passwords, no uploads, no IP logging/analytics, no persisted history, no reactions/receipts. "End-to-end encrypted" badge is label-only in v1 — do not claim real E2EE.
- Chat container `h-[100dvh]` (not `h-screen`) · feed `flex-1 overflow-y-auto` · room key `truncate` · touch targets `h-10/11` · input bar sticky `bottom-0`. Paperclip/upload icon disabled in v1.
- No `next.config.js` (user wants default dev behavior incl. dev badge). No toolchain/lint/test/CI.
- Watch out: stale `node server.js` processes squat on `:3000` and cause "Another next dev server is already running" — kill before restarting. Probe with `timeout 3 bash -c 'echo > /dev/tcp/127.0.0.1/3000'` (avoids hanging `ss`).

## Workflow

- Verify: `npm run build` must pass; socket flows verified via throwaway node scripts (create → join → broadcast → `user_left` → `room_destroyed` → Redis keys gone) and a kill-and-restart reconnect test — no test files kept, re-verify the same way after touching `lib/socket.js` or membership logic.
- Manual check: create → copy key → join in 2nd browser → message broadcast → user-count updates → last-leave destroys room.
- User prefers minimal diffs: confirm before restyling existing UI or changing button visibility.
