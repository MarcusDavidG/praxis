import { Router } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth";
import { validate } from "../middlewares/validation";
import { UnauthorizedError, ValidationError } from "../utils/errors";
import { prisma } from "../db/prisma";

const router = Router();

// Validation schemas
const getNonceSchema = z.object({
  body: z.object({
    walletAddress: z.string().min(42).max(42),
  }),
});

const verifySchema = z.object({
  body: z.object({
    walletAddress: z.string().min(42).max(42),
    message: z.string(),
    signature: z.string(),
  }),
});

// POST /api/auth/nonce - Get nonce for wallet signing
router.post("/nonce", validate(getNonceSchema), async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    
    const nonce = AuthService.generateNonce();
    const message = AuthService.createAuthMessage(walletAddress, nonce);

    res.json({
      success: true,
      data: {
        nonce,
        message,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/verify - Verify signature and authenticate
router.post("/verify", validate(verifySchema), async (req, res, next) => {
  try {
    const { walletAddress, message, signature } = req.body;

    const user = await AuthService.authenticateWithSignature(
      walletAddress,
      message,
      signature
    );

    if (!user) {
      throw new UnauthorizedError("User not registered. Please register first.");
    }

    // Generate token
    const token = AuthService.generateToken(walletAddress);

    res.json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register-and-verify - Register and authenticate in one step
router.post("/register-and-verify", async (req, res, next) => {
  try {
    const { walletAddress, message, signature, username, avatar, bio, country } = req.body;

    // Verify signature
    const isValid = await AuthService.verifySignature(message, signature, walletAddress);
    
    if (!isValid) {
      throw new UnauthorizedError("Invalid signature");
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: { stats: true },
    });

    // If user exists, just return token
    if (user) {
      const token = AuthService.generateToken(walletAddress);
      return res.json({
        success: true,
        data: { user, token },
        message: "User already exists",
      });
    }

    // Check if username is taken
    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        throw new ValidationError("Username already taken");
      }
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        username: username || `user_${walletAddress.slice(2, 10)}`,
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

    const token = AuthService.generateToken(walletAddress);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
