import { Router, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { AuthRequest, authenticate, optionalAuth } from "../middlewares/auth";
import { validate } from "../middlewares/validation";
import { NotFoundError, ValidationError } from "../utils/errors";

const router = Router();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    walletAddress: z.string().min(42).max(42),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    avatar: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    country: z.string().max(2).optional(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).optional(),
    avatar: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    country: z.string().max(2).optional(),
  }),
});

// POST /api/users/register - Register new user
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { walletAddress, username, avatar, bio, country } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (existingUser) {
      throw new ValidationError("Wallet address already registered");
    }

    // Check if username is taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      throw new ValidationError("Username already taken");
    }

    // Create user with stats
    const user = await prisma.user.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        username,
        avatar,
        bio,
        country,
        stats: {
          create: {},
        },
      },
      include: {
        stats: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/me - Get current user profile
router.get("/me", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        stats: true,
        _count: {
          select: {
            following: true,
            followers: true,
            badges: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:userId - Get user by ID
router.get("/:userId", optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        stats: true,
        badges: {
          include: {
            badge: true,
          },
        },
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if current user follows this user
    let isFollowing = false;
    if (req.userId) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: req.userId,
            followingId: userId,
          },
        },
      });
      isFollowing = !!follow;
    }

    res.json({
      success: true,
      data: {
        ...user,
        isFollowing,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/username/:username - Get user by username
router.get("/username/:username", optionalAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        stats: true,
        badges: {
          include: {
            badge: true,
          },
        },
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if current user follows this user
    let isFollowing = false;
    if (req.userId) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: req.userId,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    res.json({
      success: true,
      data: {
        ...user,
        isFollowing,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/users/me - Update current user profile
router.patch("/me", authenticate, validate(updateProfileSchema), async (req: AuthRequest, res: Response, next) => {
  try {
    const { username, avatar, bio, country } = req.body;

    // If username is being changed, check if it's available
    if (username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username,
          NOT: {
            id: req.userId,
          },
        },
      });

      if (existingUsername) {
        throw new ValidationError("Username already taken");
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(username && { username }),
        ...(avatar !== undefined && { avatar }),
        ...(bio !== undefined && { bio }),
        ...(country !== undefined && { country }),
      },
      include: {
        stats: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:userId/followers - Get user's followers
router.get("/:userId/followers", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            include: {
              stats: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.follow.count({
        where: { followingId: userId },
      }),
    ]);

    res.json({
      success: true,
      data: followers.map((f) => f.follower),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:userId/following - Get users that this user follows
router.get("/:userId/following", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            include: {
              stats: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.follow.count({
        where: { followerId: userId },
      }),
    ]);

    res.json({
      success: true,
      data: following.map((f) => f.following),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/:userId/follow - Follow a user
router.post("/:userId/follow", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { userId } = req.params;

    // Can't follow yourself
    if (userId === req.userId) {
      throw new ValidationError("Cannot follow yourself");
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToFollow) {
      throw new NotFoundError("User not found");
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId!,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      throw new ValidationError("Already following this user");
    }

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId: req.userId!,
        followingId: userId,
      },
    });

    res.json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:userId/follow - Unfollow a user
router.delete("/:userId/follow", authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { userId } = req.params;

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.userId!,
          followingId: userId,
        },
      },
    });

    if (!follow) {
      throw new NotFoundError("Not following this user");
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.userId!,
          followingId: userId,
        },
      },
    });

    res.json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
