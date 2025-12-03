import { marketSyncWorker } from "./marketSyncWorker";
import { positionSyncWorker } from "./positionSyncWorker";
import { marketSyncQueue, positionSyncQueue } from "./queue";
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
  
  logger.info("Workers started and jobs scheduled");
}

// Graceful shutdown
export async function stopWorkers() {
  logger.info("Stopping workers...");
  
  await marketSyncWorker.close();
  await positionSyncWorker.close();
  
  logger.info("Workers stopped");
}

// Export workers and queues
export { marketSyncWorker, positionSyncWorker, marketSyncQueue, positionSyncQueue };
