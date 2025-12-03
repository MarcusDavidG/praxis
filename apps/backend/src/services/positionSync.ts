import { prisma } from "../db/prisma";
import { polymarketService } from "./polymarket";
import logger from "../utils/logger";

export class PositionSyncService {
  /**
   * Sync user positions from Polymarket
   */
  static async syncUserPositions(walletAddress: string): Promise<number> {
    try {
      logger.info(`Syncing positions for ${walletAddress}...`);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { walletAddress: walletAddress.toLowerCase() },
      });

      if (!user) {
        logger.warn(`User ${walletAddress} not found in database`);
        return 0;
      }

      // Fetch positions from Polymarket
      const positions = await polymarketService.getUserPositions(walletAddress);

      if (!positions || !Array.isArray(positions)) {
        logger.warn(`No positions returned for ${walletAddress}`);
        return 0;
      }

      let synced = 0;

      for (const position of positions) {
        try {
          // Ensure market exists
          const market = await prisma.market.findUnique({
            where: { conditionId: position.market || position.condition_id },
          });

          if (!market) {
            logger.warn(`Market ${position.market} not found, skipping position`);
            continue;
          }

          const size = parseFloat(position.size || "0");
          const avgPrice = parseFloat(position.average_price || position.avgPrice || "0");
          const currentPrice = parseFloat(position.current_price || position.currentPrice || "0");

          // Calculate PnL
          const unrealizedPnL = size * (currentPrice - avgPrice);

          await prisma.position.upsert({
            where: {
              userId_marketId_outcome: {
                userId: user.id,
                marketId: market.id,
                outcome: position.outcome || "YES",
              },
            },
            update: {
              size,
              avgPrice,
              currentPrice,
              unrealizedPnL,
              status: size > 0 ? "active" : "closed",
            },
            create: {
              userId: user.id,
              marketId: market.id,
              outcome: position.outcome || "YES",
              size,
              avgPrice,
              currentPrice,
              unrealizedPnL,
              status: size > 0 ? "active" : "closed",
            },
          });

          synced++;
        } catch (error) {
          logger.error(`Failed to sync position:`, error);
        }
      }

      logger.info(`Synced ${synced} positions for ${walletAddress}`);
      return synced;
    } catch (error) {
      logger.error(`Position sync failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Sync trades for a user
   */
  static async syncUserTrades(walletAddress: string, limit: number = 100): Promise<number> {
    try {
      logger.info(`Syncing trades for ${walletAddress}...`);

      const user = await prisma.user.findUnique({
        where: { walletAddress: walletAddress.toLowerCase() },
      });

      if (!user) {
        logger.warn(`User ${walletAddress} not found in database`);
        return 0;
      }

      const trades = await polymarketService.getUserTrades(walletAddress, { limit });

      if (!trades || !Array.isArray(trades)) {
        logger.warn(`No trades returned for ${walletAddress}`);
        return 0;
      }

      let synced = 0;

      for (const trade of trades) {
        try {
          // Check if trade already exists
          const existingTrade = await prisma.tradeEvent.findFirst({
            where: {
              userId: user.id,
              txHash: trade.transaction_hash || trade.txHash,
            },
          });

          if (existingTrade) {
            continue;
          }

          // Ensure market exists
          const market = await prisma.market.findUnique({
            where: { conditionId: trade.market || trade.condition_id },
          });

          if (!market) {
            logger.warn(`Market ${trade.market} not found, skipping trade`);
            continue;
          }

          await prisma.tradeEvent.create({
            data: {
              userId: user.id,
              marketId: market.id,
              type: trade.side?.toLowerCase() === "buy" ? "buy" : "sell",
              outcome: trade.outcome || "YES",
              size: parseFloat(trade.size || "0"),
              price: parseFloat(trade.price || "0"),
              timestamp: trade.timestamp ? new Date(trade.timestamp * 1000) : new Date(),
              txHash: trade.transaction_hash || trade.txHash,
            },
          });

          synced++;
        } catch (error) {
          logger.error(`Failed to sync trade:`, error);
        }
      }

      logger.info(`Synced ${synced} trades for ${walletAddress}`);
      return synced;
    } catch (error) {
      logger.error(`Trade sync failed for ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Update position prices
   */
  static async updatePositionPrices(userId: string): Promise<number> {
    try {
      const positions = await prisma.position.findMany({
        where: {
          userId,
          status: "active",
        },
        include: {
          market: true,
        },
      });

      let updated = 0;

      for (const position of positions) {
        try {
          // Fetch current price from Polymarket
          // This is a simplified version - in production, fetch from orderbook
          const currentPrice = position.currentPrice; // Placeholder

          const unrealizedPnL = position.size * (currentPrice - position.avgPrice);

          await prisma.position.update({
            where: { id: position.id },
            data: {
              currentPrice,
              unrealizedPnL,
            },
          });

          updated++;
        } catch (error) {
          logger.error(`Failed to update position ${position.id}:`, error);
        }
      }

      return updated;
    } catch (error) {
      logger.error("Failed to update position prices:", error);
      throw error;
    }
  }
}
