import { Router, Response } from "express";
import { PositionSyncService } from "../services/positionSync";
import { AuthRequest, authenticate } from "../middlewares/auth";
import { prisma } from "../db/prisma";
import { NotFoundError } from "../utils/errors";

const router = Router();

// GET /api/positions/me - Get current user's positions
router.get("/me", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const status = req.query.status as string;

    const where: any = { userId: req.userId };
    if (status) {
      where.status = status;
    }

    const positions = await prisma.position.findMany({
      where,
      include: {
        market: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/positions/user/:userId - Get user's positions
router.get("/user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const status = req.query.status as string;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const positions = await prisma.position.findMany({
      where,
      include: {
        market: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/positions/sync - Sync current user's positions
router.post("/sync", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const synced = await PositionSyncService.syncUserPositions(user.walletAddress);

    res.json({
      success: true,
      data: {
        synced,
      },
      message: `Successfully synced ${synced} positions`,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/positions/:positionId - Get position by ID
router.get("/:positionId", async (req, res, next) => {
  try {
    const { positionId } = req.params;

    const position = await prisma.position.findUnique({
      where: { id: positionId },
      include: {
        market: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!position) {
      throw new NotFoundError("Position not found");
    }

    res.json({
      success: true,
      data: position,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
