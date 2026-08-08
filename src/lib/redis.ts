import { createClient, RedisClientType } from 'redis';

const globalForRedis = globalThis as unknown as {
  redis: RedisClientType | undefined;
};

function getRedisClient(): RedisClientType | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!globalForRedis.redis) {
    globalForRedis.redis = createClient({ url }) as RedisClientType;
  }
  return globalForRedis.redis;
}

export const redis = getRedisClient();

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, data: unknown, ttl = 300): Promise<void> {
  if (!redis) return;
  try {
    await redis.setEx(key, ttl, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {
    // silently fail
  }
}

export async function cacheInvalidatePattern(pattern: string): Promise<void> {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch {
    // silently fail
  }
}
