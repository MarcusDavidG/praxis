"use client";

import { useState, useEffect, useRef } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { userId, setAuth, clearAuth, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastAttemptedAddress = useRef<string | null>(null);
  const authInProgress = useRef(false);

  // Auto-authenticate when wallet connects (once per address)
  useEffect(() => {
    const attemptAuth = async () => {
      // Guard conditions: only authenticate if ALL are true:
      // 1. Wallet is connected
      // 2. We have an address
      // 3. Not already authenticated
      // 4. Haven't already tried this address
      // 5. No auth currently in progress
      if (
        isConnected &&
        address &&
        !isAuthenticated &&
        lastAttemptedAddress.current !== address &&
        !authInProgress.current
      ) {
        lastAttemptedAddress.current = address;
        authInProgress.current = true;
        
        try {
          await handleAuth();
        } catch (error) {
          console.error("Auto-auth failed:", error);
        } finally {
          authInProgress.current = false;
        }
      }
    };

    if (isConnected && address) {
      attemptAuth();
    } else if (!isConnected) {
      // Reset when wallet disconnects
      lastAttemptedAddress.current = null;
      authInProgress.current = false;
      if (isAuthenticated) {
        clearAuth();
        localStorage.removeItem("auth_token");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, isAuthenticated]);

  const handleAuth = async () => {
    if (!address) {
      setError("No wallet connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get nonce and message to sign
      const { data: nonceData } = await api.post("/api/auth/nonce", {
        walletAddress: address,
      });

      const { message } = nonceData.data;

      // Sign message with wallet
      const signature = await signMessageAsync({ message });

      // Try to login first
      try {
        const { data: authData } = await api.post("/api/auth/verify", {
          walletAddress: address,
          message,
          signature,
        });

        // Store token and user info
        const { token, user } = authData.data;
        localStorage.setItem("auth_token", token);
        setAuth(user.id, user.walletAddress, user.username);
        
        return { success: true, user };
      } catch (verifyError: any) {
        // User not registered, try register-and-verify
        if (verifyError.response?.status === 401) {
          // Generate username from address
          const username = `trader_${address.slice(2, 10)}`;
          
          const { data: registerData } = await api.post("/api/auth/register-and-verify", {
            walletAddress: address,
            message,
            signature,
            username,
          });

          const { token, user } = registerData.data;
          localStorage.setItem("auth_token", token);
          setAuth(user.id, user.walletAddress, user.username);
          
          return { success: true, user, isNewUser: true };
        }
        throw verifyError;
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const errorMessage = err.response?.data?.error || err.message || "Authentication failed";
      setError(errorMessage);
      
      // Don't retry automatically on user rejection or cancellation
      if (err.message?.includes("User rejected") || err.message?.includes("User denied")) {
        console.log("User rejected signature request");
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem("auth_token");
  };

  return {
    isConnected,
    isAuthenticated,
    isLoading,
    error,
    address,
    userId,
    handleAuth,
    logout,
  };
}
