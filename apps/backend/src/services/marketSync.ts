import { prisma } from "../db/prisma";
import { polymarketService } from "./polymarket";
import logger from "../utils/logger";

export class MarketSyncService {
  /**
   * Sync markets from Polymarket API to database
   */
  static async syncMarkets(limit: number = 100): Promise<number> {
    try {
      logger.info("Starting market sync...");

      const markets = await polymarketService.getMarkets({
        limit,
        active: true,
      });

      if (!markets || !Array.isArray(markets)) {
        logger.warn("No markets returned from Polymarket API");
        return 0;
      }

      let synced = 0;

      for (const market of markets) {
        try {
          const conditionId = market.conditionId || market.condition_id;
          
          if (!conditionId) {
            logger.warn("Market missing conditionId, skipping");
            continue;
          }

          // Parse outcomes if it's a JSON string
          let outcomeTokens: string[] = [];
          if (market.outcomes) {
            try {
              outcomeTokens = typeof market.outcomes === "string" 
                ? JSON.parse(market.outcomes)
                : market.outcomes;
            } catch (e) {
              outcomeTokens = [];
            }
          }

          await prisma.market.upsert({
            where: { conditionId },
            update: {
              question: market.question,
              description: market.description,
              category: market.category,
              endDate: market.endDateIso || market.endDate ? new Date(market.endDateIso || market.endDate) : null,
              volume: market.volumeNum || parseFloat(market.volume || "0"),
              liquidity: market.liquidityNum || parseFloat(market.liquidity || "0"),
              active: market.active !== false,
            },
            create: {
              conditionId,
              questionId: market.id || market.questionId || conditionId,
              question: market.question,
              description: market.description,
              category: market.category,
              endDate: market.endDateIso || market.endDate ? new Date(market.endDateIso || market.endDate) : null,
              volume: market.volumeNum || parseFloat(market.volume || "0"),
              liquidity: market.liquidityNum || parseFloat(market.liquidity || "0"),
              outcomeTokens,
              active: market.active !== false,
            },
          });

          synced++;
        } catch (error) {
          logger.error(`Failed to sync market ${market.conditionId || market.condition_id}:`, error);
        }
      }

      logger.info(`Successfully synced ${synced} markets`);
      return synced;
    } catch (error) {
      logger.error("Market sync failed:", error);
      throw error;
    }
  }

  /**
   * Sync a single market by condition ID
   */
  static async syncMarketById(conditionId: string): Promise<boolean> {
    try {
      const market = await polymarketService.getMarket(conditionId);

      if (!market) {
        logger.warn(`Market ${conditionId} not found`);
        return false;
      }

      // Parse outcomes if it's a JSON string
      let outcomeTokens: string[] = [];
      if (market.outcomes) {
        try {
          outcomeTokens = typeof market.outcomes === "string" 
            ? JSON.parse(market.outcomes)
            : market.outcomes;
        } catch (e) {
          outcomeTokens = [];
        }
      }

      await prisma.market.upsert({
        where: { conditionId },
        update: {
          question: market.question,
          description: market.description,
          category: market.category,
          endDate: market.endDateIso || market.endDate ? new Date(market.endDateIso || market.endDate) : null,
          volume: market.volumeNum || parseFloat(market.volume || "0"),
          liquidity: market.liquidityNum || parseFloat(market.liquidity || "0"),
          active: market.active !== false,
        },
        create: {
          conditionId,
          questionId: market.id || market.questionId || conditionId,
          question: market.question,
          description: market.description,
          category: market.category,
          endDate: market.endDateIso || market.endDate ? new Date(market.endDateIso || market.endDate) : null,
          volume: market.volumeNum || parseFloat(market.volume || "0"),
          liquidity: market.liquidityNum || parseFloat(market.liquidity || "0"),
          outcomeTokens,
          active: market.active !== false,
        },
      });

      logger.info(`Market ${conditionId} synced successfully`);
      return true;
    } catch (error) {
      logger.error(`Failed to sync market ${conditionId}:`, error);
      return false;
    }
  }

  /**
   * Get top markets by volume
   */
  static async getTopMarkets(limit: number = 20) {
    return prisma.market.findMany({
      where: {
        active: true,
      },
      orderBy: {
        volume: "desc",
      },
      take: limit,
    });
  }

  /**
   * Search markets
   */
  static async searchMarkets(query: string, limit: number = 20) {
    return prisma.market.findMany({
      where: {
        OR: [
          {
            question: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        active: true,
      },
      take: limit,
      orderBy: {
        volume: "desc",
      },
    });
  }
}
