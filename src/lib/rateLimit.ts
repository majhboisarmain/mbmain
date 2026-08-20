import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfter: number;
}

/**
 * Creates an LRU-cache backed sliding window rate limiter
 */
export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // Default 1 minute
  });

  return {
    check: (limit: number, token: string, windowMs = 60000): RateLimitResult => {
      const now = Date.now();
      const timestamps = tokenCache.get(token) || [];
      const windowStart = now - windowMs;

      // Filter out timestamps outside the current sliding window
      const validTimestamps = timestamps.filter((t) => t > windowStart);

      if (validTimestamps.length >= limit) {
        const oldestInWindow = validTimestamps[0];
        const retryAfter = Math.ceil((oldestInWindow + windowMs - now) / 1000);
        return {
          success: false,
          limit,
          remaining: 0,
          retryAfter: retryAfter > 0 ? retryAfter : 1,
        };
      }

      validTimestamps.push(now);
      tokenCache.set(token, validTimestamps, { ttl: windowMs });

      return {
        success: true,
        limit,
        remaining: limit - validTimestamps.length,
        retryAfter: 0,
      };
    },
  };
}

// Pre-configured rate limiters for different endpoint types
export const authRateLimiter = rateLimit({ uniqueTokenPerInterval: 500, interval: 15 * 60 * 1000 }); // 15 mins
export const generalRateLimiter = rateLimit({ uniqueTokenPerInterval: 1000, interval: 60 * 1000 }); // 1 min
export const uploadRateLimiter = rateLimit({ uniqueTokenPerInterval: 300, interval: 60 * 1000 }); // 1 min
export const aiRateLimiter = rateLimit({ uniqueTokenPerInterval: 300, interval: 60 * 1000 }); // 1 min
