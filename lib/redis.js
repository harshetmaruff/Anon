const { createClient } = require("redis");

let client = null;

async function getRedis() {
  if (client && client.isOpen) return client;
  client = createClient({ url: process.env.REDIS_URL || "redis://127.0.0.1:6379" });
  client.on("error", (err) => console.error("Redis error:", err.message));
  await client.connect();
  return client;
}

module.exports = { getRedis };
