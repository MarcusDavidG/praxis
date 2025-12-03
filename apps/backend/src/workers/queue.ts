import { Queue } from "bullmq";
import Redis from "ioredis";
import { config } from "../config";
import logger from "../utils/logger";

// Create Redis connection for BullMQ
const connection = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
});

// Create queues
export const marketSyncQueue = new Queue("market-sync", { connection });
export const positionSyncQueue = new Queue("position-sync", { connection });
export const analyticsSyncQueue = new Queue("analytics-sync", { connection });

logger.info("BullMQ queues initialized");
