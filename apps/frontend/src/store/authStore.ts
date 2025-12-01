import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: string | null;
  walletAddress: string | null;
  username: string | null;
  isAuthenticated: boolean;
  setAuth: (userId: string, walletAddress: string, username: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      walletAddress: null,
      username: null,
      isAuthenticated: false,
      setAuth: (userId, walletAddress, username) =>
        set({ userId, walletAddress, username, isAuthenticated: true }),
      clearAuth: () =>
        set({ userId: null, walletAddress: null, username: null, isAuthenticated: false }),
    }),
    {
      name: "praxis-auth",
    }
  )
);
