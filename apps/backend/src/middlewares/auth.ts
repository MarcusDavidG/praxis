import { Request, Response, NextFunction } from "express";
import { SiweMessage } from "siwe";
import { UnauthorizedError } from "../utils/errors";
import { prisma } from "../db/prisma";

export interface AuthRequest extends Request {
  userId?: string;
  walletAddress?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring(7);
    
    // For MVP, we'll use a simple wallet-based auth
    // In production, implement proper SIWE with session management
    const walletAddress = token;
    
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.userId = user.id;
    req.walletAddress = user.walletAddress;
    
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const walletAddress = token;
      
      const user = await prisma.user.findUnique({
        where: { walletAddress },
      });

      if (user) {
        req.userId = user.id;
        req.walletAddress = user.walletAddress;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};
