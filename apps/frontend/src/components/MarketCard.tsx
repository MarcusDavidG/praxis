"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Market {
  id: string;
  question: string;
  description?: string;
  category?: string;
  volume: number;
  liquidity: number;
  outcomeTokens: string[];
  active: boolean;
  endDate?: string;
}

export function MarketCard({ market }: { market: Market }) {
  return (
    <Link href={`/markets/${market.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {market.category && (
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {market.category}
                </span>
              )}
              <CardTitle className="mt-2 text-lg leading-tight">
                {market.question}
              </CardTitle>
            </div>
            {market.active ? (
              <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded-full">
                Active
              </span>
            ) : (
              <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-full">
                Closed
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {market.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {market.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Volume</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                ${market.volume.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Liquidity</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                ${market.liquidity.toLocaleString()}
              </p>
            </div>
          </div>

          {market.outcomeTokens && market.outcomeTokens.length > 0 && (
            <div className="mt-4 flex gap-2">
              {market.outcomeTokens.map((outcome, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded"
                >
                  {outcome}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
