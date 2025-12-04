"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Activity } from "lucide-react";
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
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer h-full border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 overflow-hidden group">
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {market.category && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                      {market.category}
                    </span>
                  </div>
                )}
                <CardTitle className="mt-2 text-lg leading-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {market.question}
                </CardTitle>
              </div>
              {market.active ? (
                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                  <Activity className="w-3 h-3" />
                  Live
                </span>
              ) : (
                <span className="ml-2 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full">
                  Closed
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {market.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {market.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Volume</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  ${(market.volume / 1000).toFixed(1)}K
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1">
                  <Activity className="w-3 h-3" />
                  <span>Liquidity</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  ${(market.liquidity / 1000).toFixed(1)}K
                </p>
              </div>
            </div>

            {market.outcomeTokens && market.outcomeTokens.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {market.outcomeTokens.slice(0, 2).map((outcome, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                  >
                    {outcome}
                  </span>
                ))}
                {market.outcomeTokens.length > 2 && (
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                    +{market.outcomeTokens.length - 2}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
