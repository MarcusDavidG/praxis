"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Connect Button */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-2xl font-bold">Praxis</span>
          </div>
          <ConnectButton />
        </nav>

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Praxis
          </h1>
          <p className="text-3xl font-semibold text-slate-700 dark:text-slate-300">
            Social Trading Network for Polymarket
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Track top traders, copy their positions, and compete on the leaderboard.
            Turn prediction markets into a social game.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
              Get Started
            </button>
            <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Track Traders</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Follow top performers and view real-time stats including PnL, ROI, win rate, and accuracy.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Copy Trading</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Mirror positions from successful traders with adjustable risk multipliers. Non-custodial and secure.
            </p>
          </div>

          <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Compete</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Join weekly fantasy contests, earn badges, and climb the leaderboard to prove your trading skills.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-8">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">Real-time</div>
              <div className="text-xl opacity-90">Trade Tracking</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">Social</div>
              <div className="text-xl opacity-90">Trading Network</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">Non-custodial</div>
              <div className="text-xl opacity-90">Copy Trading</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
