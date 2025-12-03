import { prisma } from "../db/prisma";
import { FeedService } from "./feed";
import logger from "../utils/logger";

export class AnalyticsService {
  /**
   * Calculate and update user statistics
   */
  static async calculateUserStats(userId: string) {
    try {
      logger.info(`Calculating stats for user ${userId}...`);

      // Get all positions
      const positions = await prisma.position.findMany({
        where: { userId },
        include: { market: true },
      });

      // Get all trade events
      const trades = await prisma.tradeEvent.findMany({
        where: { userId },
        orderBy: { timestamp: "asc" },
      });

      if (positions.length === 0 && trades.length === 0) {
        logger.info(`No positions or trades for user ${userId}`);
        return;
      }

      // Calculate total PnL
      const totalPnL = positions.reduce((sum, pos) => {
        return sum + pos.unrealizedPnL + pos.realizedPnL;
      }, 0);

      // Calculate total volume
      const totalVolume = trades.reduce((sum, trade) => {
        return sum + trade.size * trade.price;
      }, 0);

      // Calculate total invested
      const totalInvested = positions.reduce((sum, pos) => {
        return sum + pos.size * pos.avgPrice;
      }, 0);

      // Calculate ROI
      const roi = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

      // Calculate win rate (simplified - assumes closed positions)
      const closedPositions = positions.filter((p) => p.status === "closed");
      const winningPositions = closedPositions.filter((p) => p.realizedPnL > 0);
      const winRate = closedPositions.length > 0 
        ? (winningPositions.length / closedPositions.length) * 100 
        : 0;

      // Calculate accuracy (% of correct predictions)
      // Simplified: winning positions / total closed positions
      const accuracy = winRate; // For now, same as win rate

      // Calculate average position size
      const avgPositionSize = positions.length > 0
        ? positions.reduce((sum, pos) => sum + pos.size * pos.avgPrice, 0) / positions.length
        : 0;

      // Calculate trading streak
      const tradingStreak = await this.calculateTradingStreak(userId);

      // Count active markets
      const activeMarkets = await prisma.position.count({
        where: {
          userId,
          status: "active",
        },
      });

      // Update user stats
      await prisma.userStats.upsert({
        where: { userId },
        update: {
          totalPnL,
          roi,
          winRate,
          accuracy,
          avgPositionSize,
          tradingStreak,
          totalTrades: trades.length,
          totalVolume,
          activeMarkets,
          lastUpdated: new Date(),
        },
        create: {
          userId,
          totalPnL,
          roi,
          winRate,
          accuracy,
          avgPositionSize,
          tradingStreak,
          totalTrades: trades.length,
          totalVolume,
          activeMarkets,
        },
      });

      logger.info(`Stats updated for user ${userId}`);

      // Check for streak achievement
      if (tradingStreak > 0) {
        await FeedService.onStreakAchieved(userId, tradingStreak);
      }
      
      return {
        totalPnL,
        roi,
        winRate,
        accuracy,
        avgPositionSize,
        tradingStreak,
        totalTrades: trades.length,
        totalVolume,
        activeMarkets,
      };
    } catch (error) {
      logger.error(`Failed to calculate stats for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate trading streak (consecutive winning days)
   */
  static async calculateTradingStreak(userId: string): Promise<number> {
    try {
      // Get trades grouped by day
      const trades = await prisma.tradeEvent.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        include: { market: true },
      });

      if (trades.length === 0) return 0;

      // Group trades by date
      const tradesByDate = new Map<string, typeof trades>();
      trades.forEach((trade) => {
        const date = trade.timestamp.toISOString().split("T")[0];
        if (!tradesByDate.has(date)) {
          tradesByDate.set(date, []);
        }
        tradesByDate.get(date)!.push(trade);
      });

      // Calculate PnL for each day and check for winning streak
      let streak = 0;
      const sortedDates = Array.from(tradesByDate.keys()).sort().reverse();

      for (const date of sortedDates) {
        const dayTrades = tradesByDate.get(date)!;
        const dayPnL = this.calculateDayPnL(dayTrades);

        if (dayPnL > 0) {
          streak++;
        } else {
          break; // Streak broken
        }
      }

      return streak;
    } catch (error) {
      logger.error("Failed to calculate trading streak:", error);
      return 0;
    }
  }

  /**
   * Calculate PnL for a day's trades (simplified)
   */
  private static calculateDayPnL(trades: any[]): number {
    // Simplified calculation: buy trades are negative, sell trades are positive
    return trades.reduce((sum, trade) => {
      const value = trade.size * trade.price;
      return trade.type === "buy" ? sum - value : sum + value;
    }, 0);
  }

  /**
   * Get user analytics summary
   */
  static async getUserAnalytics(userId: string) {
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    const [activePositions, totalPositions, recentTrades] = await Promise.all([
      prisma.position.count({
        where: { userId, status: "active" },
      }),
      prisma.position.count({
        where: { userId },
      }),
      prisma.tradeEvent.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: 10,
        include: { market: true },
      }),
    ]);

    return {
      stats,
      activePositions,
      totalPositions,
      recentTrades,
    };
  }

  /**
   * Get top performers
   */
  static async getTopPerformers(metric: string = "totalPnL", limit: number = 10) {
    const validMetrics = ["totalPnL", "roi", "winRate", "accuracy", "totalVolume"];
    const orderBy = validMetrics.includes(metric) ? metric : "totalPnL";

    const topUsers = await prisma.userStats.findMany({
      where: {
        totalTrades: {
          gt: 0, // Must have at least 1 trade
        },
      },
      orderBy: {
        [orderBy]: "desc",
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

    return topUsers;
  }

  /**
   * Calculate market statistics
   */
  static async getMarketStats(marketId: string) {
    const [totalVolume, totalPositions, recentTrades] = await Promise.all([
      prisma.tradeEvent.aggregate({
        where: { marketId },
        _sum: {
          size: true,
        },
      }),
      prisma.position.count({
        where: { marketId },
      }),
      prisma.tradeEvent.findMany({
        where: { marketId },
        orderBy: { timestamp: "desc" },
        take: 20,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      }),
    ]);

    return {
      totalVolume: totalVolume._sum.size || 0,
      totalPositions,
      recentTrades,
    };
  }

  /**
   * Calculate portfolio value
   */
  static async calculatePortfolioValue(userId: string): Promise<number> {
    const positions = await prisma.position.findMany({
      where: {
        userId,
        status: "active",
      },
    });

    return positions.reduce((sum, pos) => {
      return sum + pos.size * pos.currentPrice;
    }, 0);
  }
}
