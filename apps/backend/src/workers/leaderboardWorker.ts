import { Worker } from "bullmq";
import Redis from "ioredis";
import { LeaderboardService } from "../services/leaderboard";
import { config } from "../config";
import logger from "../utils/logger";

const isRedisConfigured = !!(process.env.REDIS_URL || process.env.REDIS_HOST);

let leaderboardWorker: Worker | null = null;

if (isRedisConfigured) {
  const connection = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
    : new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        maxRetriesPerRequest: null,
      });

  leaderboardWorker = new Worker(
    "leaderboard-calc",
    async (job) => {
      logger.info(`Processing leaderboard calculation job ${job.id}`);
      
      try {
        const { period, metric } = job.data;
        
        if (period && metric) {
          // Calculate specific leaderboard
          await LeaderboardService.calculateLeaderboard(period, metric);
          logger.info(`Leaderboard calculated: ${period} - ${metric}`);
          return { period, metric };
        } else {
          // Calculate all leaderboards
          const calculated = await LeaderboardService.calculateAllLeaderboards();
          logger.info(`All leaderboards calculated (${calculated} total)`);
          return { calculated };
        }
      } catch (error) {
        logger.error(`Leaderboard calculation job ${job.id} failed:`, error);
        throw error;
      }
    },
    {
      connection,
      concurrency: 1, // Run one at a time to avoid conflicts
    }
  );

  leaderboardWorker.on("completed", (job) => {
    logger.info(`Leaderboard calculation job ${job.id} completed successfully`);
  });

  leaderboardWorker.on("failed", (job, err) => {
    logger.error(`Leaderboard calculation job ${job?.id} failed:`, err);
  });

  logger.info("Leaderboard worker started");
}

export { leaderboardWorker };
