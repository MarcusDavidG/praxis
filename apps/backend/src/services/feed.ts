import { prisma } from "../db/prisma";
import logger from "../utils/logger";
import { WHALE_THRESHOLD } from "@praxis/shared";

export type FeedEventType =
  | "position_opened"
  | "position_closed"
  | "streak_achieved"
  | "whale_trade"
  | "badge_earned";

export class FeedService {
  /**
   * Create a feed event
   */
  static async createFeedEvent(
    type: FeedEventType,
    userId: string,
    data: any,
    marketId?: string
  ) {
    try {
      const event = await prisma.feedEvent.create({
        data: {
          type,
          userId,
          marketId,
          data,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          market: {
            select: {
              id: true,
              question: true,
              category: true,
            },
          },
        },
      });

      logger.info(`Feed event created: ${type} for user ${userId}`);
      return event;
    } catch (error) {
      logger.error("Failed to create feed event:", error);
      throw error;
    }
  }

  /**
   * Generate feed event when position is opened
   */
  static async onPositionOpened(positionId: string) {
    try {
      const position = await prisma.position.findUnique({
        where: { id: positionId },
        include: {
          user: true,
          market: true,
        },
      });

      if (!position) return;

      const value = position.size * position.avgPrice;

      // Check if it's a whale trade
      if (value >= WHALE_THRESHOLD) {
        await this.createFeedEvent(
          "whale_trade",
          position.userId,
          {
            positionId,
            outcome: position.outcome,
            size: position.size,
            price: position.avgPrice,
            value,
            action: "opened",
          },
          position.marketId
        );
      } else {
        await this.createFeedEvent(
          "position_opened",
          position.userId,
          {
            positionId,
            outcome: position.outcome,
            size: position.size,
            price: position.avgPrice,
            value,
          },
          position.marketId
        );
      }
    } catch (error) {
      logger.error("Failed to generate position opened event:", error);
    }
  }

  /**
   * Generate feed event when position is closed
   */
  static async onPositionClosed(positionId: string) {
    try {
      const position = await prisma.position.findUnique({
        where: { id: positionId },
        include: {
          user: true,
          market: true,
        },
      });

      if (!position) return;

      const value = position.size * position.currentPrice;
      const pnl = position.realizedPnL;

      // Check if it's a whale trade
      if (value >= WHALE_THRESHOLD) {
        await this.createFeedEvent(
          "whale_trade",
          position.userId,
          {
            positionId,
            outcome: position.outcome,
            size: position.size,
            price: position.currentPrice,
            value,
            pnl,
            action: "closed",
          },
          position.marketId
        );
      } else {
        await this.createFeedEvent(
          "position_closed",
          position.userId,
          {
            positionId,
            outcome: position.outcome,
            size: position.size,
            price: position.currentPrice,
            value,
            pnl,
          },
          position.marketId
        );
      }
    } catch (error) {
      logger.error("Failed to generate position closed event:", error);
    }
  }

  /**
   * Generate feed event when user achieves a streak
   */
  static async onStreakAchieved(userId: string, streak: number) {
    try {
      // Only create events for notable streaks (3, 5, 7, 10, etc.)
      const notableStreaks = [3, 5, 7, 10, 15, 20, 30];
      
      if (!notableStreaks.includes(streak)) return;

      await this.createFeedEvent("streak_achieved", userId, {
        streak,
      });
    } catch (error) {
      logger.error("Failed to generate streak achieved event:", error);
    }
  }

  /**
   * Generate feed event when user earns a badge
   */
  static async onBadgeEarned(userId: string, badgeId: string) {
    try {
      const badge = await prisma.badge.findUnique({
        where: { id: badgeId },
      });

      if (!badge) return;

      await this.createFeedEvent("badge_earned", userId, {
        badgeId,
        badgeName: badge.name,
        badgeDescription: badge.description,
      });
    } catch (error) {
      logger.error("Failed to generate badge earned event:", error);
    }
  }

  /**
   * Get feed events with pagination and filtering
   */
  static async getFeed(options: {
    userId?: string; // Filter by specific user
    followingUserId?: string; // Get feed of users that followingUserId follows
    marketId?: string; // Filter by specific market
    type?: FeedEventType; // Filter by event type
    page?: number;
    limit?: number;
  }) {
    const {
      userId,
      followingUserId,
      marketId,
      type,
      page = 1,
      limit = 20,
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (followingUserId) {
      // Get users that followingUserId follows
      const following = await prisma.follow.findMany({
        where: { followerId: followingUserId },
        select: { followingId: true },
      });

      const followingIds = following.map((f) => f.followingId);
      
      if (followingIds.length > 0) {
        where.userId = {
          in: followingIds,
        };
      } else {
        // No following, return empty
        return {
          events: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
    }

    if (marketId) {
      where.marketId = marketId;
    }

    if (type) {
      where.type = type;
    }

    const [events, total] = await Promise.all([
      prisma.feedEvent.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          market: {
            select: {
              id: true,
              question: true,
              category: true,
            },
          },
        },
        orderBy: {
          timestamp: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.feedEvent.count({ where }),
    ]);

    return {
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get global feed (all activity)
   */
  static async getGlobalFeed(page: number = 1, limit: number = 20) {
    return this.getFeed({ page, limit });
  }

  /**
   * Get user's personalized feed (from followed users)
   */
  static async getPersonalFeed(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return this.getFeed({ followingUserId: userId, page, limit });
  }

  /**
   * Get whale trades feed
   */
  static async getWhaleFeed(page: number = 1, limit: number = 20) {
    return this.getFeed({ type: "whale_trade", page, limit });
  }

  /**
   * Get recent activity for a user
   */
  static async getUserActivity(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return this.getFeed({ userId, page, limit });
  }

  /**
   * Get recent activity for a market
   */
  static async getMarketActivity(
    marketId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return this.getFeed({ marketId, page, limit });
  }

  /**
   * Delete old feed events (cleanup)
   */
  static async cleanupOldEvents(daysToKeep: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const deleted = await prisma.feedEvent.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      logger.info(`Cleaned up ${deleted.count} old feed events`);
      return deleted.count;
    } catch (error) {
      logger.error("Failed to cleanup old events:", error);
      throw error;
    }
  }
}
