import { Router } from "express";
import { MarketSyncService } from "../services/marketSync";
import { prisma } from "../db/prisma";
import { NotFoundError } from "../utils/errors";

const router = Router();

// GET /api/markets - Get all markets with pagination
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const active = req.query.active !== "false";

    const where: any = { active };
    if (category) {
      where.category = category;
    }

    const [markets, total] = await Promise.all([
      prisma.market.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          volume: "desc",
        },
      }),
      prisma.market.count({ where }),
    ]);

    res.json({
      success: true,
      data: markets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/markets/top - Get top markets by volume
router.get("/top", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const markets = await MarketSyncService.getTopMarkets(limit);

    res.json({
      success: true,
      data: markets,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/markets/search - Search markets
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q as string;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const markets = await MarketSyncService.searchMarkets(query, limit);

    res.json({
      success: true,
      data: markets,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/markets/:marketId - Get market by ID
router.get("/:marketId", async (req, res, next) => {
  try {
    const { marketId } = req.params;

    const market = await prisma.market.findUnique({
      where: { id: marketId },
      include: {
        _count: {
          select: {
            positions: true,
            tradeEvents: true,
          },
        },
      },
    });

    if (!market) {
      throw new NotFoundError("Market not found");
    }

    res.json({
      success: true,
      data: market,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/markets/:marketId/trades - Get recent trades for a market
router.get("/:marketId/trades", async (req, res, next) => {
  try {
    const { marketId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const trades = await prisma.tradeEvent.findMany({
      where: { marketId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });

    res.json({
      success: true,
      data: trades,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/markets/sync - Trigger market sync
router.post("/sync", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.body.limit) || 100, 500);

    const synced = await MarketSyncService.syncMarkets(limit);

    res.json({
      success: true,
      data: {
        synced,
      },
      message: `Successfully synced ${synced} markets`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
