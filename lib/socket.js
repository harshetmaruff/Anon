const { getRedis } = require("./redis");
const {
  ROOM_TTL_SECONDS,
  generateRoomKey,
  roomKey,
  usersKey,
  messagesKey,
  destroyRoomIfEmpty,
} = require("./roomUtils");

// Empty rooms are deleted after a grace period instead of instantly, so a
// transient leave (React StrictMode remount in dev, or a fast Socket.io
// reconnect) cannot destroy a room the user is about to rejoin.
const DESTROY_GRACE_MS = 5000;

// roomKey -> pending destroy timer
const pendingDestroy = new Map();

function cancelPendingDestroy(rk) {
  const timer = pendingDestroy.get(rk);
  if (timer) {
    clearTimeout(timer);
    pendingDestroy.delete(rk);
  }
}

function scheduleDestroy(redis, rk, io) {
  if (pendingDestroy.has(rk)) return;
  const timer = setTimeout(async () => {
    pendingDestroy.delete(rk);
    try {
      await destroyRoomIfEmpty(redis, rk, io);
    } catch (err) {
      console.error("destroy room failed:", err.message);
    }
  }, DESTROY_GRACE_MS);
  if (typeof timer.unref === "function") timer.unref();
  pendingDestroy.set(rk, timer);
}

// Internal suffix mapping: socket.id -> { roomKey, internalName }
// Name collision: frontend sends display name; server stores Name_xxxx internally.
// If the display name is already taken in the room, the joining user gets a
// numeric suffix (Alice -> Alice2 -> Alice3) so identities stay distinguishable.
function dedupeName(existingMembers, requested) {
  const taken = new Set(
    existingMembers.map((m) => {
      const i = m.lastIndexOf("_");
      return i > 0 ? m.slice(0, i) : m;
    })
  );
  if (!taken.has(requested)) return requested;
  let n = 2;
  while (taken.has(`${requested}${n}`)) n++;
  return `${requested}${n}`;
}

const baseOf = (internal) => {
  const i = internal.lastIndexOf("_");
  return i > 0 ? internal.slice(0, i) : internal;
};

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    let joined = null; // { roomKey, internalName }

    const clientIdOf = (cid) => {
      const clean = String(cid || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
      return clean.length >= 3 ? clean : socket.id.slice(0, 6);
    };

    socket.on("create_room", async ({ userName, clientId }, ack) => {
      try {
        const redis = await getRedis();
        const key = generateRoomKey();
        const cid = clientIdOf(clientId);
        const internalName = `${userName}_${cid}`;
        await redis.hSet(roomKey(key), { createdAt: Date.now().toString(), ttl: ROOM_TTL_SECONDS.toString() });
        await redis.expire(roomKey(key), ROOM_TTL_SECONDS);
        await redis.sAdd(usersKey(key), internalName);
        await redis.expire(usersKey(key), ROOM_TTL_SECONDS);
        await socket.join(key);
        joined = { roomKey: key, internalName };
        cancelPendingDestroy(key);
        const currentUsers = await redis.sMembers(usersKey(key));
        socket.emit("user_joined", { userName: internalName, currentUsers });
        if (typeof ack === "function") ack({ roomKey: key, internalName });
        else socket.emit("room_created", { roomKey: key, internalName });
      } catch (err) {
        console.error("create_room failed:", err.message);
        if (typeof ack === "function") ack({ error: "Failed to create room" });
      }
    });

    socket.on("join_room", async ({ roomKey: rk, userName, clientId }, ack) => {
      try {
        const redis = await getRedis();
        const exists = await redis.exists(roomKey(rk));
        if (!exists) {
          if (typeof ack === "function") return ack({ success: false, error: "Room not found or expired" });
          return socket.emit("join_error", { error: "Room not found or expired" });
        }
        const cid = clientIdOf(clientId);
        const members = await redis.sMembers(usersKey(rk));
        // Reuse the existing entry for this client (reconnect / remount) so we
        // never mint a second identity for the same person.
        const existing = members.find((m) => m.endsWith(`_${cid}`));
        let internalName;
        if (existing) {
          internalName = existing;
        } else {
          const displayName = dedupeName(members, userName);
          internalName = `${displayName}_${cid}`;
          await redis.sAdd(usersKey(rk), internalName);
          await redis.expire(usersKey(rk), ROOM_TTL_SECONDS);
          await redis.expire(messagesKey(rk), ROOM_TTL_SECONDS);
        }
        await socket.join(rk);
        joined = { roomKey: rk, internalName };
        cancelPendingDestroy(rk);
        const currentUsers = await redis.sMembers(usersKey(rk));
        if (typeof ack === "function") ack({ success: true, currentUsers, userName: baseOf(internalName), internalName });
        // Full list included so clients that missed an event can resync
        io.to(rk).emit("user_joined", { userName: internalName, currentUsers });
      } catch (err) {
        console.error("join_room failed:", err.message);
        if (typeof ack === "function") ack({ success: false, error: "Join failed" });
      }
    });

    socket.on("send_message", async ({ roomKey: rk, userName, text, ts }) => {
      try {
        const redis = await getRedis();
        // Author comes from the server-side identity, not the client payload.
        const author = joined && joined.roomKey === rk ? joined.internalName : userName;
        const msg = JSON.stringify({ user: author, text, ts });
        await redis.rPush(messagesKey(rk), msg);
        await redis.lTrim(messagesKey(rk), -100, -1);
        io.to(rk).emit("new_message", { user: author, text, ts });
      } catch (err) {
        console.error("send_message failed:", err.message);
      }
    });

    const leave = async () => {
      if (!joined) return;
      try {
        const redis = await getRedis();
        const { roomKey: rk, internalName } = joined;
        await redis.sRem(usersKey(rk), internalName);
        const currentUsers = await redis.sMembers(usersKey(rk));
        io.to(rk).emit("user_left", { userName: internalName, currentUsers });
        if (currentUsers.length === 0) scheduleDestroy(redis, rk, io);
        await socket.leave(rk);
      } catch (err) {
        console.error("leave failed:", err.message);
      } finally {
        joined = null;
      }
    };

    socket.on("leave_room", leave);
    socket.on("disconnect", leave);
  });
}

module.exports = { registerSocketHandlers };
