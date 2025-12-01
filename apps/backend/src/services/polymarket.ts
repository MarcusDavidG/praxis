import axios, { AxiosInstance } from "axios";
import { config } from "../config";
import logger from "../utils/logger";

class PolymarketService {
  private clobClient: AxiosInstance;
  private gammaClient: AxiosInstance;
  private dataClient: AxiosInstance;

  constructor() {
    this.clobClient = axios.create({
      baseURL: config.polymarket.clobApi,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.gammaClient = axios.create({
      baseURL: config.polymarket.gammaApi,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.dataClient = axios.create({
      baseURL: config.polymarket.dataApi,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getMarkets(params?: { limit?: number; offset?: number; active?: boolean }) {
    try {
      const response = await this.gammaClient.get("/markets", { params });
      return response.data;
    } catch (error) {
      logger.error("Error fetching markets from Polymarket:", error);
      throw error;
    }
  }

  async getMarket(conditionId: string) {
    try {
      const response = await this.gammaClient.get(`/markets/${conditionId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching market ${conditionId}:`, error);
      throw error;
    }
  }

  async getUserPositions(address: string) {
    try {
      const response = await this.dataClient.get(`/positions/${address}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching positions for ${address}:`, error);
      throw error;
    }
  }

  async getUserTrades(address: string, params?: { limit?: number; offset?: number }) {
    try {
      const response = await this.dataClient.get(`/trades/${address}`, { params });
      return response.data;
    } catch (error) {
      logger.error(`Error fetching trades for ${address}:`, error);
      throw error;
    }
  }

  async getOrderbook(tokenId: string) {
    try {
      const response = await this.clobClient.get(`/book`, {
        params: { token_id: tokenId },
      });
      return response.data;
    } catch (error) {
      logger.error(`Error fetching orderbook for ${tokenId}:`, error);
      throw error;
    }
  }

  async getTrades(marketId: string, params?: { limit?: number }) {
    try {
      const response = await this.clobClient.get(`/trades`, {
        params: { market: marketId, ...params },
      });
      return response.data;
    } catch (error) {
      logger.error(`Error fetching trades for market ${marketId}:`, error);
      throw error;
    }
  }
}

export const polymarketService = new PolymarketService();
