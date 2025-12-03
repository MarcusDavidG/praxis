import { Worker } from "bullmq";
import Redis from "ioredis";
import { AnalyticsService } from "../services/analytics";
import { prisma } from "../db/prisma";
import { config } from "../config";
import logger from "../utils/logger";

const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST);

let analyticsWorker: Worker | null = null;

if (isRedisConfigured) {
  const connection = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
    : new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        maxRetriesPerRequest: null,
      });

  analyticsWorker = new Worker(
    "analytics-sync",
    async (job) => {
      logger.info(`Processing analytics job ${job.id}`);
      
      try {
        const { userId } = job.data;
        
        if (userId) {
          // Calculate stats for specific user
          const stats = await AnalyticsService.calculateUserStats(userId);
          logger.info(`Analytics updated for user ${userId}`);
          return { userId, stats };
        } else {
          // Update stats for all users with positions/trades
          const users = await prisma.user.findMany({
            where: {
              OR: [
                { positions: { some: {} } },
                { tradeEvents: { some: {} } },
              ],
            },
            select: { id: true },
          });

          let updated = 0;
          for (const user of users) {
            try {
              await AnalyticsService.calculateUserStats(user.id);
              updated++;
            } catch (error) {
              logger.error(`Failed to update stats for user ${user.id}:`, error);
            }
          }

          logger.info(`Analytics job ${job.id} completed. Updated ${updated} users`);
          return { updated };
        }
      } catch (error) {
        logger.error(`Analytics job ${job.id} failed:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 2,
    }
  );

  analyticsWorker.on("completed", (job) => {
    logger.info(`Analytics job ${job.id} completed successfully`);
  });

  analyticsWorker.on("failed", (job, err) => {
    logger.error(`Analytics job ${job?.id} failed:`, err);
  });

  logger.info("Analytics worker started");
}

export { analyticsWorker };
