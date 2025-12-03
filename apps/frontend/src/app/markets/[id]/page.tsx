"use client";

import { use } from "react";
import { useMarket, useMarketTrades } from "@/hooks/useMarkets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export default function MarketDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: market, isLoading: marketLoading } = useMarket(id);
  const { data: tradesData, isLoading: tradesLoading } = useMarketTrades(id, 10);

  if (marketLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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

  if (!market) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Market Not Found</h2>
              <p className="text-slate-600 dark:text-slate-400">
                This market doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Market Header */}
        <div className="mb-8">
          {market.category && (
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {market.category}
            </span>
          )}
          <h1 className="text-4xl font-bold mt-2 mb-4">{market.question}</h1>
          {market.description && (
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {market.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-4">
            {market.active ? (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold rounded-full">
                Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-full">
                Closed
              </span>
            )}
            {market.endDate && (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Ends {formatDistanceToNow(new Date(market.endDate), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${market.volume.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Liquidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${market.liquidity.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {market._count?.positions || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outcomes */}
        {market.outcomeTokens && market.outcomeTokens.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Outcomes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {market.outcomeTokens.map((outcome: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex-1 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <p className="text-lg font-semibold">{outcome}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            {tradesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : tradesData?.data && tradesData.data.length > 0 ? (
              <div className="space-y-4">
                {tradesData.data.map((trade: any) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {trade.user?.username || "Anonymous"}
                      </p>
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
                No trades yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
