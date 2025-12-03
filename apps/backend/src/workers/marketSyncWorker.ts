import { Worker } from "bullmq";
import Redis from "ioredis";
import { MarketSyncService } from "../services/marketSync";
import { config } from "../config";
import logger from "../utils/logger";

const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST);

let marketSyncWorker: Worker | null = null;

if (isRedisConfigured) {
  const connection = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
    : new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        maxRetriesPerRequest: null,
      });

  marketSyncWorker = new Worker(
    "market-sync",
    async (job) => {
      logger.info(`Processing market sync job ${job.id}`);
      
      try {
        const limit = job.data.limit || 100;
        const synced = await MarketSyncService.syncMarkets(limit);
        
        logger.info(`Market sync job ${job.id} completed. Synced ${synced} markets`);
        return { synced };
      } catch (error) {
        logger.error(`Market sync job ${job.id} failed:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 1,
    }
  );

  marketSyncWorker.on("completed", (job) => {
    logger.info(`Market sync job ${job.id} completed successfully`);
  });

  marketSyncWorker.on("failed", (job, err) => {
    logger.error(`Market sync job ${job?.id} failed:`, err);
  });

  logger.info("Market sync worker started");
}

export { marketSyncWorker };
