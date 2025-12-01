export interface User {
  id: string;
  walletAddress: string;
  username: string;
  avatar?: string;
  bio?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  userId: string;
  totalPnL: number;
  roi: number;
  winRate: number;
  accuracy: number;
  avgPositionSize: number;
  tradingStreak: number;
  totalTrades: number;
  totalVolume: number;
  activeMarkets: number;
  lastUpdated: Date;
}

export interface Market {
  id: string;
  conditionId: string;
  questionId: string;
  question: string;
  description?: string;
  category?: string;
  endDate?: Date;
  volume: number;
  liquidity: number;
  outcomeTokens: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  userId: string;
  marketId: string;
  outcome: string;
  size: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  status: "active" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeEvent {
  id: string;
  userId: string;
  marketId: string;
  type: "buy" | "sell";
  outcome: string;
  size: number;
  price: number;
  timestamp: Date;
  txHash?: string;
}

export interface FeedEvent {
  id: string;
  type: "position_opened" | "position_closed" | "streak_achieved" | "whale_trade" | "badge_earned";
  userId: string;
  marketId?: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface CopyTradeEvent {
  id: string;
  followerId: string;
  traderId: string;
  tradeEventId: string;
  status: "pending" | "approved" | "rejected" | "executed";
  multiplier: number;
  maxAmount: number;
  createdAt: Date;
  executedAt?: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  criteria: Record<string, any>;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  value: number;
  period: "daily" | "weekly" | "all_time";
  metric: "pnl" | "roi" | "accuracy" | "streak" | "volume";
}

export interface Contest {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  status: "upcoming" | "active" | "ended";
  createdAt: Date;
}

export interface ContestEntry {
  id: string;
  contestId: string;
  userId: string;
  virtualBalance: number;
  currentValue: number;
  pnl: number;
  rank?: number;
  joinedAt: Date;
}

export interface ContestTrade {
  id: string;
  contestEntryId: string;
  marketId: string;
  type: "buy" | "sell";
  outcome: string;
  size: number;
  price: number;
  timestamp: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
