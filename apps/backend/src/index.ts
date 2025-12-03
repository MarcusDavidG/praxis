import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import logger from "./utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { prisma } from "./db/prisma";
import redis, { isRedisConfigured } from "./utils/redis";
import { startWorkers, stopWorkers } from "./workers";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    redis: isRedisConfigured ? "enabled" : "disabled",
    workers: isRedisConfigured ? "enabled" : "disabled"
  });
});

// API routes
import apiRouter from "./api";
app.use("/api", apiRouter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected");

    // Only connect to Redis if configured
    if (isRedisConfigured && redis) {
      try {
        await redis.ping();
        logger.info("Redis connected");
        
        // Start BullMQ workers only if Redis is available
        startWorkers();
        logger.info("Background workers started");
      } catch (error) {
        logger.error("Redis connection failed, continuing without background workers:", error);
      }
    } else {
      logger.warn("Running without Redis - background workers disabled");
      logger.warn("Market syncing, position syncing, and analytics will need to be triggered manually via API");
    }

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Frontend URL: ${config.cors.origin}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  
  if (isRedisConfigured && redis) {
    try {
      await stopWorkers();
      await redis.quit();
    } catch (error) {
      logger.error("Error during shutdown:", error);
    }
  }
  
  await prisma.$disconnect();
  process.exit(0);
});
