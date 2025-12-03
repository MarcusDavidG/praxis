import { Router, Response } from "express";
import { FeedService } from "../services/feed";
import { AuthRequest, optionalAuth } from "../middlewares/auth";

const router = Router();

// GET /api/feed - Get global feed
router.get("/", optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const type = req.query.type as string;

    let feed;

    if (type) {
      // Filter by type
      feed = await FeedService.getFeed({ type: type as any, page, limit });
    } else {
      // Global feed
      feed = await FeedService.getGlobalFeed(page, limit);
    }

    res.json({
      success: true,
      data: feed.events,
      total: feed.total,
      page: feed.page,
      limit: feed.limit,
      totalPages: feed.totalPages,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/feed/personal - Get personalized feed (following)
router.get("/personal", optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const feed = await FeedService.getPersonalFeed(req.userId, page, limit);

    res.json({
      success: true,
      data: feed.events,
      total: feed.total,
      page: feed.page,
      limit: feed.limit,
      totalPages: feed.totalPages,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/feed/whales - Get whale trades feed
router.get("/whales", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const feed = await FeedService.getWhaleFeed(page, limit);

    res.json({
      success: true,
      data: feed.events,
      total: feed.total,
      page: feed.page,
      limit: feed.limit,
      totalPages: feed.totalPages,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/feed/user/:userId - Get user activity
router.get("/user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const feed = await FeedService.getUserActivity(userId, page, limit);

    res.json({
      success: true,
      data: feed.events,
      total: feed.total,
      page: feed.page,
      limit: feed.limit,
      totalPages: feed.totalPages,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/feed/market/:marketId - Get market activity
router.get("/market/:marketId", async (req, res, next) => {
  try {
    const { marketId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const feed = await FeedService.getMarketActivity(marketId, page, limit);

    res.json({
      success: true,
      data: feed.events,
      total: feed.total,
      page: feed.page,
      limit: feed.limit,
      totalPages: feed.totalPages,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
