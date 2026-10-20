# Anon — Ephemeral Anonymous Chat Application

## 📌 Project Overview

Build a privacy-focused, ephemeral chat web application where users can create or join anonymous chat rooms using only a 16-character room key. No accounts, no passwords, no IP logging. Rooms self-destruct automatically when all participants leave.

**Core Philosophy:**
- Zero friction: Just a room code → you're in
- Ephemeral by design: Nothing persists after the room empties
- Privacy-first: No IP logging, no user accounts, no message history after disconnect
- Fast & lightweight: In-memory storage with Redis

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | React framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Real-time | Socket.io | WebSocket communication |
| Server | Custom Next.js server (`server.js`) | Required for Socket.io |
| Storage | Redis | Ephemeral data with native TTL |
| State (client) | Zustand | Lightweight state management |
| Icons | Lucide React | Icon library |

---

## 🏗️ Architecture

### Redis Data Model (Ephemeral Storage)
room:{roomKey} → Hash { createdAt, ttl } // TTL = 24h safety net
users:{roomKey} → Set { "Neo_8f3a", "Cipher_7" } // Active user identifiers
messages:{roomKey} → List [ {user, text, ts} ] // LTRIM to last 100

**Key Behaviors:**
- `room:{key}` auto-expires via Redis TTL (24h fail-safe)
- `users:{key}` is actively managed by Socket.io disconnect events
- When `SCARD users:{key} === 0` → delete all three keys immediately
- `messages:{key}` is capped at 100 entries via `LTRIM`

### Socket.io Event Contract

| Event | Direction | Payload | Server Action |
|-------|-----------|---------|---------------|
| `create_room` | C→S | `{ userName }` | Generate 16-char key, add user to Set, return `{ roomKey }` |
| `join_room` | C→S | `{ roomKey, userName }` | Validate key exists, add to Set, return `{ success, currentUsers }` |
| `leave_room` | C→S | `{ roomKey, userName }` | Remove from Set, check if empty, broadcast `user_left` |
| `send_message` | C→S | `{ roomKey, userName, text, ts }` | Push to List, broadcast `new_message` to room |
| `new_message` | S→C | `{ user, text, ts }` | Client appends to chat |
| `user_joined` | S→C | `{ userName }` | Client updates user list |
| `user_left` | S→C | `{ userName }` | Client updates user list |
| `room_destroyed` | S→C | `{}` | Redirect to lobby |
| `disconnect` | auto | — | Treat as `leave_room` |

### Room Key Format
- 16 alphanumeric characters
- Grouped for readability: `aB3x-K9mQ-2pL7-nR4w`
- Generated using `crypto.randomBytes`

---

## 🎨 UI Specifications

### Screen 1: Lobby (`/`)
- **Layout:** Full viewport, dark gradient background (`bg-gray-950` to `bg-black`)
- **Centered card:** `max-w-md`, subtle border (`border-gray-800`), soft focus glow
- **Header:** Shield icon + "Anon" title + "Simple, private conversations" subtitle + "End-to-end encrypted" badge
- **Tabs:** "Join Room" | "Create Room"
- **Join tab inputs:** Your Name, Room Code or Link
- **Create tab inputs:** Your Name only (code auto-generated)
- **Primary CTA:** Emerald green button, full width
- **Footer info:** "Messages disappear automatically once all participants leave."
- **On create:** Show toast "Room code copied to clipboard!"

### Screen 2: Chat Room (`/room/[roomKey]`)
- **Layout:** `h-screen`, flex column
- **Top header:** Room key (monospace, emerald) + "X people online" badge + Leave button
- **Privacy banner:** "Messages in this room are private and end-to-end encrypted."
- **Message feed:** Scrollable, dark bg, subtle pattern
  - **Others' messages:** Left-aligned, `bg-gray-800`, username above in muted text
  - **Your messages:** Right-aligned, `bg-emerald-600`
  - **Timestamps:** Bottom-right of each bubble, `text-xs`
- **Input bar:** Paperclip icon (disabled for v1) + rounded text input + emerald send button
- **Right sidebar (desktop):** "People in Room" list with green dot indicators, collapsible on mobile

### Design System
- **Background:** `#0f0f0f` / `bg-gray-950`
- **Accent:** Emerald `#10b981` / `text-emerald-400`
- **UI font:** Inter or Geist Sans
- **Mono font:** JetBrains Mono (for room codes, timestamps)
- **Borders:** `border-gray-800`
- **Hover states:** Subtle emerald glow on focus

---

## ⚠️ Edge Cases to Handle

1. **Zombie connections:** Implement Socket.io heartbeat (ping/pong every 5s). If no ping, force-remove user from Set.
2. **Name collisions:** Frontend appends random 4-char suffix internally (e.g., `Neo_8f3a`), displays only `Neo` in UI.
3. **Invalid room key:** Show error toast "Room not found or expired" and stay on lobby.
4. **Page refresh:** Re-join room using stored `roomKey` in sessionStorage; restore userName.
5. **Empty room redirect:** If user is last to leave, redirect to lobby after `room_destroyed` event.
6. **Clipboard fallback:** If `navigator.clipboard` fails, show code in a modal with manual copy.

---

## 📁 Suggested File Structure
/
├── server.js # Custom Next.js server with Socket.io
├── lib/
│ ├── redis.js # Redis client setup
│ ├── socket.js # Socket.io event handlers
│ └── roomUtils.js # Key generation, cleanup logic
├── app/
│ ├── layout.js # Root layout (dark theme, fonts)
│ ├── page.js # Lobby screen
│ └── room/
│ └── [roomKey]/
│ └── page.js # Chat room screen
├── components/
│ ├── lobby/
│ │ ├── LobbyCard.jsx
│ │ ├── JoinForm.jsx
│ │ └── CreateForm.jsx
│ ├── chat/
│ │ ├── ChatHeader.jsx
│ │ ├── MessageFeed.jsx
│ │ ├── MessageBubble.jsx
│ │ ├── ChatInput.jsx
│ │ └── UserSidebar.jsx
│ └── ui/
│ ├── Button.jsx
│ ├── Input.jsx
│ └── Toast.jsx
├── store/
│ └── useChatStore.js # Zustand store (messages, users, room)
├── hooks/
│ └── useSocket.js # Socket.io client hook
└── styles/
└── globals.css # Tailwind directives

---

## 🚧 Build Phases

**Phase 1 — Foundation**
- Initialize Next.js + Tailwind
- Set up custom `server.js` with Socket.io
- Connect Redis client
- Verify Socket.io handshake works

**Phase 2 — Backend Logic**
- Implement room creation (key generation + Redis storage)
- Implement room joining (validation + user tracking)
- Implement message broadcasting
- Implement disconnect cleanup (empty room deletion)

**Phase 3 — Frontend: Lobby**
- Build LobbyCard with Join/Create tabs
- Form validation
- Toast notifications
- Clipboard copy on create

**Phase 4 — Frontend: Chat Room**
- ChatHeader with live user count
- MessageFeed with auto-scroll
- MessageBubble (sent vs received styling)
- ChatInput with Enter-to-send
- UserSidebar with live user list

**Phase 5 — Polish**
- Heartbeat for zombie connections
- Name collision handling
- Session persistence on refresh
- Responsive sidebar (mobile collapse)
- Error states & empty states

---

## ❌ Out of Scope (v1)
- User accounts / registration
- Room passwords
- Multimedia uploads
- Real end-to-end encryption (label only)
- IP logging / analytics
- Message reactions / replies
- Read receipts

---

## ✅ Definition of Done
- [ ] User can create a room and get a 16-char grouped key
- [ ] User can join with just the key + their name
- [ ] Messages broadcast in real-time to all participants
- [ ] User list updates live as people join/leave
- [ ] Room auto-deletes when last user leaves
- [ ] Room auto-expires after 24h TTL (safety net)
- [ ] No IP addresses logged anywhere
- [ ] UI matches the provided HTML design exactly (Some of the designs present there are not web responsive, make sure they are mobile-responsive and suitable to screens of all sizes)

Mobile-Responsive Guardrails 
Dynamic Viewport Height:
Use h-[100dvh] (dynamic viewport height) instead of h-screen for the main chat container. This prevents the mobile browser’s expanding/collapsing URL bar from cutting off the input field or creating ugly scrollbars.
Flexible Message Feed:
The message feed must use flex-1 overflow-y-auto so it dynamically shrinks when the mobile keyboard appears, keeping the input field visible at the bottom.
Right Sidebar Behavior:
Desktop (md and up): Fixed width sidebar (w-72, hidden md:block).
Mobile: Hidden by default. Add a "Users" icon (e.g., Users from Lucide) in the ChatHeader. Clicking it opens a slide-over drawer (fixed inset-y-0 right-0 z-50) or a bottom sheet showing the "People in Room" list.
Room Key Truncation:
In the ChatHeader, the room key (#e9f8a...c32d) must use truncate or break-all so it doesn’t overflow and break the header layout on narrow screens.
Touch Targets:
Ensure all buttons (Send, Leave, Copy) have a minimum touch target of h-10 or h-11 and px-4 for easy tapping on mobile.
Input Area Keyboard Handling:
The bottom input bar should be sticky bottom-0 or part of the flex column, ensuring it stays anchored above the mobile keyboard without pushing the entire page up awkwardly.