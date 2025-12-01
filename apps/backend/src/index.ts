import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import logger from "./utils/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { prisma } from "./db/prisma";
import redis from "./utils/redis";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes will be added here

app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected");

    await redis.ping();
    logger.info("Redis connected");

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});
