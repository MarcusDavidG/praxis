"use client";

import { useState } from "react";
import { useMarkets, useTopMarkets, useSearchMarkets } from "@/hooks/useMarkets";
import { MarketCard } from "@/components/MarketCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: marketsData, isLoading: marketsLoading } = useMarkets(page, 12);
  const { data: topMarketsData, isLoading: topLoading } = useTopMarkets(5);
  const { data: searchData, isLoading: searchLoading } = useSearchMarkets(searchQuery, 20);

  const showSearch = searchQuery.length >= 2;
  const displayMarkets = showSearch ? searchData?.data : marketsData?.data;
  const isLoading = showSearch ? searchLoading : marketsLoading;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Markets</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse and trade prediction markets from Polymarket
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
          />
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="text-sm text-slate-500 mt-2">
              Type at least 2 characters to search
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayMarkets && displayMarkets.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayMarkets.map((market: any) => (
                    <MarketCard key={market.id} market={market} />
                  ))}
                </div>

                {/* Pagination */}
                {!showSearch && marketsData && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                      Page {page} of {marketsData.totalPages || 1}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= (marketsData.totalPages || 1)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    {showSearch ? "No markets found matching your search" : "No markets available"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Top Markets */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Top Markets</CardTitle>
              </CardHeader>
              <CardContent>
                {topLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : topMarketsData?.data && topMarketsData.data.length > 0 ? (
                  <div className="space-y-4">
                    {topMarketsData.data.map((market: any, idx: number) => (
                      <div
                        key={market.id}
                        className="pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg font-bold text-slate-400">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <a
                              href={`/markets/${market.id}`}
                              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                            >
                              {market.question}
                            </a>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              ${market.volume.toLocaleString()} volume
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    No top markets available
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
