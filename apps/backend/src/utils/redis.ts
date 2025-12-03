import Redis from "ioredis";
import logger from "./logger";

// Check if Redis is configured
const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST);

let redis: Redis | null = null;

if (isRedisConfigured) {
  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    redis = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });
  } else {
    redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });
  }

  redis.on("connect", () => {
    logger.info("Redis connected");
  });

  redis.on("error", (err) => {
    logger.error("Redis connection error", err);
  });
} else {
  logger.warn("Redis not configured - background workers will be disabled");
}

export default redis;
export { isRedisConfigured };
