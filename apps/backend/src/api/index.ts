import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import marketsRouter from "./markets";
import positionsRouter from "./positions";
import analyticsRouter from "./analytics";
import feedRouter from "./feed";
import leaderboardRouter from "./leaderboard";

const router = Router();

// Mount routes
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/markets", marketsRouter);
router.use("/positions", positionsRouter);
router.use("/analytics", analyticsRouter);
router.use("/feed", feedRouter);
router.use("/leaderboard", leaderboardRouter);

export default router;
