export const POLYMARKET_CLOB_API = "https://clob.polymarket.com";
export const POLYMARKET_GAMMA_API = "https://gamma-api.polymarket.com";
export const POLYMARKET_DATA_API = "https://data-api.polymarket.com";

export const BADGE_CRITERIA = {
  HOT_HAND: {
    name: "Hot Hand",
    description: "Achieve a 3-day winning streak",
    requiredStreak: 3,
  },
  ORACLE: {
    name: "Oracle",
    description: "Make 10 correct predictions",
    requiredCorrectPredictions: 10,
  },
  WHALE: {
    name: "Whale",
    description: "Reach $10,000 in total trading volume",
    requiredVolume: 10000,
  },
  SHARPSHOOTER: {
    name: "Sharpshooter",
    description: "Achieve 70% accuracy",
    requiredAccuracy: 0.7,
  },
  GRINDER: {
    name: "Grinder",
    description: "Complete 100 trades",
    requiredTrades: 100,
  },
} as const;

export const LEADERBOARD_PERIODS = ["daily", "weekly", "all_time"] as const;
export const LEADERBOARD_METRICS = ["pnl", "roi", "accuracy", "streak", "volume"] as const;

export const FEED_EVENT_TYPES = [
  "position_opened",
  "position_closed",
  "streak_achieved",
  "whale_trade",
  "badge_earned",
] as const;

export const POSITION_STATUS = ["active", "closed"] as const;
export const TRADE_TYPES = ["buy", "sell"] as const;
export const CONTEST_STATUS = ["upcoming", "active", "ended"] as const;
export const COPY_TRADE_STATUS = ["pending", "approved", "rejected", "executed"] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const WHALE_THRESHOLD = 1000; // USD
export const CONTEST_DEFAULT_BALANCE = 10000; // Virtual USD
