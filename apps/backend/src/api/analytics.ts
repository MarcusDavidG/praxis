import { Router, Response } from "express";
import { AnalyticsService } from "../services/analytics";
import { AuthRequest, authenticate, optionalAuth } from "../middlewares/auth";
import { NotFoundError } from "../utils/errors";

const router = Router();

// GET /api/analytics/me - Get current user's analytics
router.get("/me", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const analytics = await AnalyticsService.getUserAnalytics(req.userId!);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/user/:userId - Get user analytics
router.get("/user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const analytics = await AnalyticsService.getUserAnalytics(userId);

    if (!analytics.stats) {
      throw new NotFoundError("User stats not found");
    }

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/analytics/calculate - Recalculate user stats
router.post("/calculate", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const stats = await AnalyticsService.calculateUserStats(req.userId!);

    res.json({
      success: true,
      data: stats,
      message: "Stats recalculated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/top-performers - Get top performing traders
router.get("/top-performers", async (req, res, next) => {
  try {
    const metric = req.query.metric as string || "totalPnL";
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);

    const topPerformers = await AnalyticsService.getTopPerformers(metric, limit);

    res.json({
      success: true,
      data: topPerformers,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/market/:marketId - Get market analytics
router.get("/market/:marketId", async (req, res, next) => {
  try {
    const { marketId } = req.params;

    const stats = await AnalyticsService.getMarketStats(marketId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/portfolio-value - Get portfolio value
router.get("/portfolio-value", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const portfolioValue = await AnalyticsService.calculatePortfolioValue(req.userId!);

    res.json({
      success: true,
      data: {
        portfolioValue,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
