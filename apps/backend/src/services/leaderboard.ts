import { prisma } from "../db/prisma";
import logger from "../utils/logger";

export type LeaderboardPeriod = "daily" | "weekly" | "all_time";
export type LeaderboardMetric = "pnl" | "roi" | "accuracy" | "streak" | "volume";

export class LeaderboardService {
  /**
   * Calculate and cache leaderboard for a specific period and metric
   */
  static async calculateLeaderboard(
    period: LeaderboardPeriod,
    metric: LeaderboardMetric,
    limit: number = 100
  ) {
    try {
      logger.info(`Calculating ${period} leaderboard for ${metric}...`);

      // Map metric to database field
      const metricMap: Record<LeaderboardMetric, string> = {
        pnl: "totalPnL",
        roi: "roi",
        accuracy: "accuracy",
        streak: "tradingStreak",
        volume: "totalVolume",
      };

      const dbMetric = metricMap[metric];

      // Get top users by metric
      const topUsers = await prisma.userStats.findMany({
        where: {
          totalTrades: {
            gt: 0, // Must have at least 1 trade
          },
        },
        orderBy: {
          [dbMetric]: "desc",
        },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      // Delete existing cache for this period/metric
      await prisma.leaderboardCache.deleteMany({
        where: {
          period,
          metric,
        },
      });

      // Cache new rankings
      const cachePromises = topUsers.map((userStats, index) => {
        const value = (userStats as any)[dbMetric];
        
        return prisma.leaderboardCache.create({
          data: {
            period,
            metric,
            rank: index + 1,
            userId: userStats.userId,
            value: value || 0,
          },
        });
      });

      await Promise.all(cachePromises);

      logger.info(
        `Leaderboard cached: ${period} - ${metric} (${topUsers.length} entries)`
      );

      return topUsers.length;
    } catch (error) {
      logger.error(`Failed to calculate leaderboard ${period}/${metric}:`, error);
      throw error;
    }
  }

  /**
   * Get leaderboard from cache
   */
  static async getLeaderboard(
    period: LeaderboardPeriod,
    metric: LeaderboardMetric,
    limit: number = 50
  ) {
    try {
      const cached = await prisma.leaderboardCache.findMany({
        where: {
          period,
          metric,
        },
        orderBy: {
          rank: "asc",
        },
        take: limit,
      });

      // If cache is empty or old, recalculate
      if (cached.length === 0) {
        await this.calculateLeaderboard(period, metric);
        return this.getLeaderboard(period, metric, limit);
      }

      // Get user details
      const userIds = cached.map((c) => c.userId);
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      const userMap = new Map(users.map((u) => [u.id, u]));

      // Combine cache with user data
      const leaderboard = cached.map((entry) => ({
        rank: entry.rank,
        user: userMap.get(entry.userId),
        value: entry.value,
        updatedAt: entry.updatedAt,
      }));

      return leaderboard;
    } catch (error) {
      logger.error(`Failed to get leaderboard ${period}/${metric}:`, error);
      throw error;
    }
  }

  /**
   * Get user's rank in a specific leaderboard
   */
  static async getUserRank(
    userId: string,
    period: LeaderboardPeriod,
    metric: LeaderboardMetric
  ) {
    try {
      const cached = await prisma.leaderboardCache.findUnique({
        where: {
          period_metric_userId: {
            period,
            metric,
            userId,
          },
        },
      });

      return cached ? cached.rank : null;
    } catch (error) {
      logger.error("Failed to get user rank:", error);
      return null;
    }
  }

  /**
   * Get all rankings for a user across all leaderboards
   */
  static async getUserRankings(userId: string) {
    try {
      const rankings = await prisma.leaderboardCache.findMany({
        where: { userId },
      });

      // Group by period and metric
      const grouped: any = {
        daily: {},
        weekly: {},
        all_time: {},
      };

      rankings.forEach((r) => {
        grouped[r.period][r.metric] = {
          rank: r.rank,
          value: r.value,
          updatedAt: r.updatedAt,
        };
      });

      return grouped;
    } catch (error) {
      logger.error("Failed to get user rankings:", error);
      throw error;
    }
  }

  /**
   * Calculate all leaderboards (daily, weekly, all-time for all metrics)
   */
  static async calculateAllLeaderboards() {
    try {
      logger.info("Calculating all leaderboards...");

      const periods: LeaderboardPeriod[] = ["daily", "weekly", "all_time"];
      const metrics: LeaderboardMetric[] = ["pnl", "roi", "accuracy", "streak", "volume"];

      let calculated = 0;

      for (const period of periods) {
        for (const metric of metrics) {
          try {
            await this.calculateLeaderboard(period, metric);
            calculated++;
          } catch (error) {
            logger.error(`Failed to calculate ${period}/${metric}:`, error);
          }
        }
      }

      logger.info(`Calculated ${calculated} leaderboards`);
      return calculated;
    } catch (error) {
      logger.error("Failed to calculate all leaderboards:", error);
      throw error;
    }
  }

  /**
   * Get top traders across multiple metrics
   */
  static async getTopTraders(limit: number = 10) {
    try {
      // Get users with highest PnL
      const topByPnL = await prisma.userStats.findMany({
        where: {
          totalTrades: { gt: 0 },
        },
        orderBy: {
          totalPnL: "desc",
        },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      // Get users with highest ROI
      const topByROI = await prisma.userStats.findMany({
        where: {
          totalTrades: { gt: 0 },
        },
        orderBy: {
          roi: "desc",
        },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      // Get users with highest accuracy
      const topByAccuracy = await prisma.userStats.findMany({
        where: {
          totalTrades: { gt: 0 },
        },
        orderBy: {
          accuracy: "desc",
        },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

      return {
        topByPnL,
        topByROI,
        topByAccuracy,
      };
    } catch (error) {
      logger.error("Failed to get top traders:", error);
      throw error;
    }
  }
}
