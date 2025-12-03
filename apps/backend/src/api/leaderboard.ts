import { Router, Response } from "express";
import { LeaderboardService } from "../services/leaderboard";
import { AuthRequest, optionalAuth } from "../middlewares/auth";

const router = Router();

// GET /api/leaderboard/:period/:metric - Get leaderboard
router.get("/:period/:metric", async (req, res, next) => {
  try {
    const { period, metric } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    // Validate period
    if (!["daily", "weekly", "all_time"].includes(period)) {
      return res.status(400).json({
        success: false,
        error: "Invalid period. Must be: daily, weekly, or all_time",
      });
    }

    // Validate metric
    if (!["pnl", "roi", "accuracy", "streak", "volume"].includes(metric)) {
      return res.status(400).json({
        success: false,
        error: "Invalid metric. Must be: pnl, roi, accuracy, streak, or volume",
      });
    }

    const leaderboard = await LeaderboardService.getLeaderboard(
      period as any,
      metric as any,
      limit
    );

    res.json({
      success: true,
      data: leaderboard,
      period,
      metric,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/leaderboard/user/:userId - Get user's rankings
router.get("/user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const rankings = await LeaderboardService.getUserRankings(userId);

    res.json({
      success: true,
      data: rankings,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/leaderboard/me/rank - Get current user's rankings
router.get("/me/rank", optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const rankings = await LeaderboardService.getUserRankings(req.userId);

    res.json({
      success: true,
      data: rankings,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/leaderboard/top-traders - Get top traders across metrics
router.get("/top-traders", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

    const topTraders = await LeaderboardService.getTopTraders(limit);

    res.json({
      success: true,
      data: topTraders,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/leaderboard/calculate - Trigger leaderboard recalculation
router.post("/calculate", async (req, res, next) => {
  try {
    const { period, metric } = req.body;

    if (period && metric) {
      // Calculate specific leaderboard
      await LeaderboardService.calculateLeaderboard(period, metric);
      
      res.json({
        success: true,
        message: `Leaderboard calculated: ${period} - ${metric}`,
      });
    } else {
      // Calculate all leaderboards
      const calculated = await LeaderboardService.calculateAllLeaderboards();
      
      res.json({
        success: true,
        message: `Calculated ${calculated} leaderboards`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
