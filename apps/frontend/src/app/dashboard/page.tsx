"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser, useUserAnalytics } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: analytics, isLoading: analyticsLoading } = useUserAnalytics(user?.id);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = analytics?.stats;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your trading performance and manage your portfolio
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total PnL */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                (stats?.totalPnL || 0) >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                ${stats?.totalPnL?.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>

          {/* ROI */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                (stats?.roi || 0) >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {stats?.roi?.toFixed(2) || "0.00"}%
              </div>
            </CardContent>
          </Card>

          {/* Win Rate */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {stats?.winRate?.toFixed(1) || "0.0"}%
              </div>
            </CardContent>
          </Card>

          {/* Trading Streak */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats?.tradingStreak || 0} days
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trading Volume */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats?.totalVolume?.toLocaleString() || "0"}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {stats?.totalTrades || 0} total trades
              </p>
            </CardContent>
          </Card>

          {/* Active Markets */}
          <Card>
            <CardHeader>
              <CardTitle>Active Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.activeMarkets || 0}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                markets with open positions
              </p>
            </CardContent>
          </Card>

          {/* Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle>Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.accuracy?.toFixed(1) || "0.0"}%
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                prediction accuracy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                Your recent positions and trades will appear here
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
