import { marketSyncWorker } from "./marketSyncWorker";
import { positionSyncWorker } from "./positionSyncWorker";
import { analyticsWorker } from "./analyticsWorker";
import { marketSyncQueue, positionSyncQueue, analyticsSyncQueue } from "./queue";
import logger from "../utils/logger";

// Start all workers
export function startWorkers() {
  logger.info("Starting all BullMQ workers...");
  
  // Schedule recurring jobs
  
  // Sync markets every hour
  marketSyncQueue.add(
    "sync-markets",
    { limit: 100 },
    {
      repeat: {
        pattern: "0 * * * *", // Every hour
      },
      jobId: "market-sync-hourly",
    }
  );

  // Update analytics every 10 minutes
  analyticsSyncQueue.add(
    "sync-all-analytics",
    {},
    {
      repeat: {
        pattern: "*/10 * * * *", // Every 10 minutes
      },
      jobId: "analytics-sync-10min",
    }
  );
  
  logger.info("Workers started and jobs scheduled");
}

// Graceful shutdown
export async function stopWorkers() {
  logger.info("Stopping workers...");
  
  await marketSyncWorker.close();
  await positionSyncWorker.close();
  await analyticsWorker.close();
  
  logger.info("Workers stopped");
}

// Export workers and queues
export {
  marketSyncWorker,
  positionSyncWorker,
  analyticsWorker,
  marketSyncQueue,
  positionSyncQueue,
  analyticsSyncQueue,
};
