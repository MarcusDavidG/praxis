"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useFollowUser, useUnfollowUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { userId: currentUserId } = useAuth();
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", "username", username],
    queryFn: async () => {
      const { data } = await api.get(`/api/users/username/${username}`);
      return data.data;
    },
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["analytics", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null;
      const { data } = await api.get(`/api/analytics/user/${userData.id}`);
      return data.data;
    },
    enabled: !!userData?.id,
  });

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
              <p className="text-slate-600 dark:text-slate-400">
                This user doesn't exist.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const stats = analyticsData?.stats;
  const isOwnProfile = currentUserId === userData.id;
  const isFollowing = userData.isFollowing;

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowMutation.mutateAsync(userData.id);
    } else {
      await followMutation.mutateAsync(userData.id);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {userData.username.charAt(0).toUpperCase()}
                </div>
                
                {/* User Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-1">{userData.username}</h1>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                    {userData.walletAddress.slice(0, 6)}...{userData.walletAddress.slice(-4)}
                  </p>
                  {userData.bio && (
                    <p className="text-slate-700 dark:text-slate-300 mt-2">
                      {userData.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-slate-100">
                        {userData._count?.followers || 0}
                      </strong>{" "}
                      followers
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-slate-100">
                        {userData._count?.following || 0}
                      </strong>{" "}
                      following
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      <strong className="text-slate-900 dark:text-slate-100">
                        {userData._count?.badges || 0}
                      </strong>{" "}
                      badges
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              {!isOwnProfile && currentUserId && (
                <Button
                  onClick={handleFollowToggle}
                  disabled={followMutation.isPending || unfollowMutation.isPending}
                  variant={isFollowing ? "outline" : "default"}
                >
                  {followMutation.isPending || unfollowMutation.isPending
                    ? "Loading..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData?.recentTrades && analyticsData.recentTrades.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.recentTrades.map((trade: any) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{trade.market?.question || "Unknown Market"}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {trade.type} · {trade.outcome} · ${(trade.size * trade.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDistanceToNow(new Date(trade.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-600 dark:text-slate-400 py-8">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
