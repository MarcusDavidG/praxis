"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useUser";

export function Header() {
  const { isAuthenticated } = useAuth();
  const { data: user } = useCurrentUser();

  return (
    <header className="border-b bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-2xl font-bold">Praxis</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/markets"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Markets
            </Link>
            <Link
              href="/leaderboard"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Leaderboard
            </Link>
            <Link
              href="/feed"
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Feed
            </Link>
            {isAuthenticated && user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Dashboard
                </Link>
                <Link
                  href={`/profile/${user.username}`}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Connect Wallet Button */}
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}
