"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useLeaderboard(period: string, metric: string, limit: number = 50) {
  return useQuery({
    queryKey: ["leaderboard", period, metric, limit],
    queryFn: async () => {
      const { data } = await api.get(`/api/leaderboard/${period}/${metric}`, {
        params: { limit },
      });
      return data;
    },
  });
}

export function useMyRank() {
  return useQuery({
    queryKey: ["leaderboard", "my-rank"],
    queryFn: async () => {
      const { data } = await api.get("/api/leaderboard/me/rank");
      return data.data;
    },
  });
}

export function useUserRank(userId: string) {
  return useQuery({
    queryKey: ["leaderboard", "user-rank", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await api.get(`/api/leaderboard/user/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
}

export function useTopTraders() {
  return useQuery({
    queryKey: ["leaderboard", "top-traders"],
    queryFn: async () => {
      const { data } = await api.get("/api/leaderboard/top-traders");
      return data.data;
    },
  });
}
