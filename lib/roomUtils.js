const crypto = require("crypto");

const ROOM_TTL_SECONDS = 24 * 60 * 60; // 24h fail-safe

function generateRoomKey() {
  // 16 alphanumerics via crypto.randomBytes; display grouped xxxx-xxxx-xxxx-xxxx by caller
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(16);
  let key = "";
  for (let i = 0; i < 16; i++) key += alphabet[bytes[i] % alphabet.length];
  return key;
}

function formatRoomKey(key) {
  return key.replace(/(.{4})(.{4})(.{4})(.{4})/, "$1-$2-$3-$4");
}

function parseRoomKey(input) {
  return (input || "").replace(/-/g, "").trim();
}

const roomKey = (key) => `room:${key}`;
const usersKey = (key) => `users:${key}`;
const messagesKey = (key) => `messages:${key}`;

async function destroyRoomIfEmpty(redis, roomKeyRaw, io) {
  const count = await redis.sCard(usersKey(roomKeyRaw));
  if (count === 0) {
    await redis.del([roomKey(roomKeyRaw), usersKey(roomKeyRaw), messagesKey(roomKeyRaw)]);
    if (io) io.to(roomKeyRaw).emit("room_destroyed", {});
  }
}

module.exports = {
  ROOM_TTL_SECONDS,
  generateRoomKey,
  formatRoomKey,
  parseRoomKey,
  roomKey,
  usersKey,
  messagesKey,
  destroyRoomIfEmpty,
};
