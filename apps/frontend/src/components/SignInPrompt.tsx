"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogIn } from "lucide-react";

export function SignInPrompt() {
  const { isConnected, isAuthenticated, isLoading, handleAuth, error } = useAuth();

  // Only show if wallet is connected but not authenticated
  if (!isConnected || isAuthenticated || isLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-2xl p-4 text-white">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Sign In to Continue</h3>
            <p className="text-sm opacity-90 mb-3">
              Sign a message with your wallet to access all features
            </p>
            <button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
            {error && (
              <p className="text-xs mt-2 text-red-200">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
