import { redis } from "./redis";

export async function rateLimit(ip, limit = 3, windowSec = 60) {
  const key = `ratelimit:${ip}`;
    console.log("IP : ", ip);
    
  // Increase counter
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, windowSec);
  }

  return count <= limit;
}
