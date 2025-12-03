import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";
import marketsRouter from "./markets";
import positionsRouter from "./positions";
import analyticsRouter from "./analytics";

const router = Router();

// Mount routes
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/markets", marketsRouter);
router.use("/positions", positionsRouter);
router.use("/analytics", analyticsRouter);

export default router;
