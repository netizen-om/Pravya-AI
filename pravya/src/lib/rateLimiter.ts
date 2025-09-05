import { redis } from "./redis";

export async function rateLimit(ip, limit = 100, windowSec = 60) {
  const key = `ratelimit:${ip}`;

  // Increase counter
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowSec);
  }

  return count <= limit;
}
