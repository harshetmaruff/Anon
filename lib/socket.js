const { getRedis } = require("./redis");
const {
  ROOM_TTL_SECONDS,
  generateRoomKey,
  roomKey,
  usersKey,
  messagesKey,
  destroyRoomIfEmpty,
} = require("./roomUtils");

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

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    let joined = null; // { roomKey, internalName }

    socket.on("create_room", async ({ userName }, ack) => {
      try {
        const redis = await getRedis();
        const key = generateRoomKey();
        await redis.hSet(roomKey(key), { createdAt: Date.now().toString(), ttl: ROOM_TTL_SECONDS.toString() });
        await redis.expire(roomKey(key), ROOM_TTL_SECONDS);
        await socket.join(key);
        if (typeof ack === "function") ack({ roomKey: key });
        else socket.emit("room_created", { roomKey: key });
      } catch (err) {
        console.error("create_room failed:", err.message);
        if (typeof ack === "function") ack({ error: "Failed to create room" });
      }
    });

    socket.on("join_room", async ({ roomKey: rk, userName }, ack) => {
      try {
        const redis = await getRedis();
        const exists = await redis.exists(roomKey(rk));
        if (!exists) {
          if (typeof ack === "function") return ack({ success: false, error: "Room not found or expired" });
          return socket.emit("join_error", { error: "Room not found or expired" });
        }
        const displayName = dedupeName(await redis.sMembers(usersKey(rk)), userName);
        const internalName = `${displayName}_${socket.id.slice(0, 4)}`;
        await redis.sAdd(usersKey(rk), internalName);
        await redis.expire(usersKey(rk), ROOM_TTL_SECONDS);
        await redis.expire(messagesKey(rk), ROOM_TTL_SECONDS);
        await socket.join(rk);
        joined = { roomKey: rk, internalName };
        const currentUsers = await redis.sMembers(usersKey(rk));
        if (typeof ack === "function") ack({ success: true, currentUsers, userName: displayName });
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
        const msg = JSON.stringify({ user: userName, text, ts });
        await redis.rPush(messagesKey(rk), msg);
        await redis.lTrim(messagesKey(rk), -100, -1);
        io.to(rk).emit("new_message", { user: userName, text, ts });
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
        await destroyRoomIfEmpty(redis, rk, io);
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
