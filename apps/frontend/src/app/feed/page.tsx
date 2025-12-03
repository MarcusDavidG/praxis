"use client";

import { useState } from "react";
import { useFeed, usePersonalFeed, useWhaleFeed } from "@/hooks/useFeed";
import { useAuth } from "@/hooks/useAuth";
import { FeedEvent } from "@/components/FeedEvent";
import { Card, CardContent } from "@/components/ui/card";

type FeedTab = "global" | "personal" | "whales";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("global");
  const [page, setPage] = useState(1);
  const { isAuthenticated } = useAuth();

  const { data: globalData, isLoading: globalLoading } = useFeed(page, 20);
  const { data: personalData, isLoading: personalLoading } = usePersonalFeed(page, 20);
  const { data: whaleData, isLoading: whaleLoading } = useWhaleFeed(page, 20);

  const getFeedData = () => {
    switch (activeTab) {
      case "global":
        return { data: globalData, isLoading: globalLoading };
      case "personal":
        return { data: personalData, isLoading: personalLoading };
      case "whales":
        return { data: whaleData, isLoading: whaleLoading };
    }
  };

  const { data: feedData, isLoading } = getFeedData();
  const events = feedData?.data || [];
  const total = feedData?.total || 0;
  const totalPages = feedData?.totalPages || 1;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Activity Feed</h1>
          <p className="text-slate-600 dark:text-slate-400">
            See what's happening across the Praxis trading network
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setActiveTab("global");
              setPage(1);
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "global"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Global
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                setActiveTab("personal");
                setPage(1);
              }}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === "personal"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Following
            </button>
          )}
          <button
            onClick={() => {
              setActiveTab("whales");
              setPage(1);
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "whales"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Whale Trades 🐋
          </button>
        </div>

        {/* Feed Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="space-y-4">
              {events.map((event: any) => (
                <FeedEvent key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Previous
                </button>
                <span className="text-slate-600 dark:text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Next
                </button>
              </div>
            )}

            {/* Total Count */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              Showing {events.length} of {total} events
            </p>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                {activeTab === "personal" && !isAuthenticated
                  ? "Connect your wallet to see your personalized feed"
                  : activeTab === "personal"
                  ? "Follow traders to see their activity here"
                  : "No activity yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
