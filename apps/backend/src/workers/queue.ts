import { Queue } from "bullmq";
import Redis from "ioredis";
import { config } from "../config";
import logger from "../utils/logger";

// Check if Redis is configured
const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST);

let connection: Redis | null = null;
let marketSyncQueue: Queue | null = null;
let positionSyncQueue: Queue | null = null;
let analyticsSyncQueue: Queue | null = null;
let leaderboardQueue: Queue | null = null;

if (isRedisConfigured) {
  // Create Redis connection for BullMQ
  if (process.env.REDIS_URL) {
    connection = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  } else {
    connection = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      maxRetriesPerRequest: null,
    });
  }

  // Create queues
  marketSyncQueue = new Queue("market-sync", { connection });
  positionSyncQueue = new Queue("position-sync", { connection });
  analyticsSyncQueue = new Queue("analytics-sync", { connection });
  leaderboardQueue = new Queue("leaderboard-calc", { connection });

  logger.info("BullMQ queues initialized");
} else {
  logger.warn("BullMQ queues not initialized - Redis not configured");
}

export { marketSyncQueue, positionSyncQueue, analyticsSyncQueue, leaderboardQueue };
