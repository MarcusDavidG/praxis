import { Worker } from "bullmq";
import Redis from "ioredis";
import { PositionSyncService } from "../services/positionSync";
import { config } from "../config";
import logger from "../utils/logger";

const connection = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
});

export const positionSyncWorker = new Worker(
  "position-sync",
  async (job) => {
    logger.info(`Processing position sync job ${job.id}`);
    
    try {
      const { walletAddress } = job.data;
      
      if (!walletAddress) {
        throw new Error("Wallet address is required");
      }
      
      const positionsSynced = await PositionSyncService.syncUserPositions(walletAddress);
      const tradesSynced = await PositionSyncService.syncUserTrades(walletAddress);
      
      logger.info(
        `Position sync job ${job.id} completed. ` +
        `Synced ${positionsSynced} positions and ${tradesSynced} trades`
      );
      
      return { positionsSynced, tradesSynced };
    } catch (error) {
      logger.error(`Position sync job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 3,
  }
);

positionSyncWorker.on("completed", (job) => {
  logger.info(`Position sync job ${job.id} completed successfully`);
});

positionSyncWorker.on("failed", (job, err) => {
  logger.error(`Position sync job ${job?.id} failed:`, err);
});

logger.info("Position sync worker started");
