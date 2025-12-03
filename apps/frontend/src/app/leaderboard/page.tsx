"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeaderboard, useMyRank, useTopTraders } from "@/hooks/useLeaderboard";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Period = "daily" | "weekly" | "all_time";
type Metric = "pnl" | "roi" | "accuracy" | "streak" | "volume";

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "all_time", label: "All Time" },
];

const METRICS: { value: Metric; label: string }[] = [
  { value: "pnl", label: "P&L" },
  { value: "roi", label: "ROI" },
  { value: "accuracy", label: "Accuracy" },
  { value: "streak", label: "Streak" },
  { value: "volume", label: "Volume" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("all_time");
  const [metric, setMetric] = useState<Metric>("pnl");
  const { isAuthenticated } = useAuth();

  const { data: leaderboardData, isLoading } = useLeaderboard(period, metric, 50);
  const { data: myRank } = useMyRank();
  const { data: topTraders } = useTopTraders();

  const rankings = leaderboardData?.data || [];

  const formatMetricValue = (value: number, metricType: Metric) => {
    switch (metricType) {
      case "pnl":
        return `$${value.toFixed(2)}`;
      case "roi":
      case "accuracy":
        return `${value.toFixed(2)}%`;
      case "streak":
        return `${value} days`;
      case "volume":
        return `$${value.toLocaleString()}`;
      default:
        return value.toString();
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return <span className="text-2xl">🥇</span>;
    if (rank === 2)
      return <span className="text-2xl">🥈</span>;
    if (rank === 3)
      return <span className="text-2xl">🥉</span>;
    return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
  };

  const currentMetricRank = myRank?.[`${period}_${metric}`];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Top traders ranked by performance metrics
          </p>
        </div>

        {/* My Rank Card */}
        {isAuthenticated && myRank && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle>Your Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {METRICS.map((m) => {
                  const rankKey = `${period}_${m.value}` as keyof typeof myRank;
                  const rank = myRank[rankKey];
                  return (
                    <div key={m.value} className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {m.label}
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        #{rank || "-"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Rankings</CardTitle>
                {/* Period Tabs */}
                <div className="flex gap-2 mt-4">
                  {PERIODS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPeriod(p.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        period === p.value
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                {/* Metric Tabs */}
                <div className="flex gap-2 mt-2">
                  {METRICS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMetric(m.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        metric === m.value
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 animate-pulse"
                      >
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : rankings.length > 0 ? (
                  <div className="space-y-2">
                    {rankings.map((entry: any, index: number) => {
                      const isCurrentUser = isAuthenticated && entry.userId === myRank?.userId;
                      return (
                        <div
                          key={entry.userId}
                          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                            isCurrentUser
                              ? "bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800"
                              : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {/* Rank Badge */}
                            <div className="w-12 text-center">
                              {getRankBadge(index + 1)}
                            </div>

                            {/* User Info */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                {entry.user?.username?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <Link
                                  href={`/profile/${entry.user?.username}`}
                                  className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  {entry.user?.username || "Unknown"}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                      You
                                    </span>
                                  )}
                                </Link>
                              </div>
                            </div>

                            {/* Value */}
                            <div className="text-right">
                              <p className="font-bold text-lg">
                                {formatMetricValue(entry.value, metric)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-600 dark:text-slate-400">
                    No rankings available for this period and metric
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Top Traders */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Top Traders</CardTitle>
              </CardHeader>
              <CardContent>
                {topTraders ? (
                  <div className="space-y-6">
                    {/* Best Overall */}
                    {topTraders.bestOverall && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          🏆 Best Overall
                        </p>
                        <Link
                          href={`/profile/${topTraders.bestOverall.username}`}
                          className="block p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {topTraders.bestOverall.username}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            ${topTraders.bestOverall.totalPnL?.toFixed(2)} P&L
                          </p>
                        </Link>
                      </div>
                    )}

                    {/* Highest ROI */}
                    {topTraders.highestROI && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          📈 Highest ROI
                        </p>
                        <Link
                          href={`/profile/${topTraders.highestROI.username}`}
                          className="block p-3 bg-green-50 dark:bg-green-950 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {topTraders.highestROI.username}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {topTraders.highestROI.roi?.toFixed(2)}% ROI
                          </p>
                        </Link>
                      </div>
                    )}

                    {/* Most Accurate */}
                    {topTraders.mostAccurate && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          🎯 Most Accurate
                        </p>
                        <Link
                          href={`/profile/${topTraders.mostAccurate.username}`}
                          className="block p-3 bg-blue-50 dark:bg-blue-950 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {topTraders.mostAccurate.username}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {topTraders.mostAccurate.accuracy?.toFixed(1)}% accuracy
                          </p>
                        </Link>
                      </div>
                    )}

                    {/* Longest Streak */}
                    {topTraders.longestStreak && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          🔥 Longest Streak
                        </p>
                        <Link
                          href={`/profile/${topTraders.longestStreak.username}`}
                          className="block p-3 bg-purple-50 dark:bg-purple-950 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {topTraders.longestStreak.username}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            {topTraders.longestStreak.tradingStreak} day streak
                          </p>
                        </Link>
                      </div>
                    )}

                    {/* Highest Volume */}
                    {topTraders.highestVolume && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          💰 Highest Volume
                        </p>
                        <Link
                          href={`/profile/${topTraders.highestVolume.username}`}
                          className="block p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {topTraders.highestVolume.username}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            ${topTraders.highestVolume.totalVolume?.toLocaleString()}
                          </p>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Loading top traders...
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
