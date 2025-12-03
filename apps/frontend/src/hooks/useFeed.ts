"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useFeed(page: number = 1, limit: number = 20, type?: string) {
  return useQuery({
    queryKey: ["feed", page, limit, type],
    queryFn: async () => {
      const { data } = await api.get("/api/feed", {
        params: { page, limit, type },
      });
      return data;
    },
  });
}

export function usePersonalFeed(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["feed", "personal", page, limit],
    queryFn: async () => {
      const { data } = await api.get("/api/feed/personal", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useWhaleFeed(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["feed", "whales", page, limit],
    queryFn: async () => {
      const { data } = await api.get("/api/feed/whales", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useUserActivity(userId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["feed", "user", userId, page, limit],
    queryFn: async () => {
      if (!userId) return { data: [], total: 0 };
      const { data } = await api.get(`/api/feed/user/${userId}`, {
        params: { page, limit },
      });
      return data;
    },
    enabled: !!userId,
  });
}
