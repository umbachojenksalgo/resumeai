import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
      throw new Error("Missing KV_REST_API_URL or KV_REST_API_TOKEN");
    }
    redis = new Redis({ url, token });
  }
  return redis;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const r = getRedis();
  return r.get<T>(key);
}

export async function kvSet(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  const r = getRedis();
  if (ttlSeconds) {
    await r.set(key, value, { ex: ttlSeconds });
  } else {
    await r.set(key, value);
  }
}

export async function kvDel(key: string): Promise<void> {
  const r = getRedis();
  await r.del(key);
}

export async function kvIncr(key: string): Promise<number> {
  const r = getRedis();
  return r.incr(key);
}

export async function kvExpire(key: string, ttlSeconds: number): Promise<void> {
  const r = getRedis();
  await r.expire(key, ttlSeconds);
}
