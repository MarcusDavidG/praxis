"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useState } from "react";

export function useMarkets(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["markets", page, limit],
    queryFn: async () => {
      const { data } = await api.get("/api/markets", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useTopMarkets(limit: number = 10) {
  return useQuery({
    queryKey: ["markets", "top", limit],
    queryFn: async () => {
      const { data } = await api.get("/api/markets/top", {
        params: { limit },
      });
      return data;
    },
  });
}

export function useMarket(marketId: string) {
  return useQuery({
    queryKey: ["market", marketId],
    queryFn: async () => {
      const { data } = await api.get(`/api/markets/${marketId}`);
      return data.data;
    },
    enabled: !!marketId,
  });
}

export function useSearchMarkets(query: string, limit: number = 20) {
  return useQuery({
    queryKey: ["markets", "search", query, limit],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return { success: true, data: [] };
      }
      const { data } = await api.get("/api/markets/search", {
        params: { q: query, limit },
      });
      return data;
    },
    enabled: query.length >= 2,
  });
}

export function useMarketTrades(marketId: string, limit: number = 20) {
  return useQuery({
    queryKey: ["market", marketId, "trades", limit],
    queryFn: async () => {
      const { data } = await api.get(`/api/markets/${marketId}/trades`, {
        params: { limit },
      });
      return data;
    },
    enabled: !!marketId,
  });
}
