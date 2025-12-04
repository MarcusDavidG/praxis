"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Trophy, Copy, Sparkles, BarChart3, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">

        {/* Hero Section */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center space-y-8 py-20 md:py-32"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>The Social Layer for Prediction Markets</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Praxis
            </h1>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 max-w-4xl mx-auto">
            Turn Prediction Trading Into a Social Game
          </motion.p>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Track top traders, copy winning strategies, and compete on the leaderboard.
            Built on Polymarket, powered by community insights.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <Link
              href="/markets"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Explore Markets
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              View Leaderboard
              <Trophy className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Real-time
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-2">Trade Tracking</div>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Social
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-2">Trading Network</div>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                Non-custodial
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-2">Copy Trading</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-32"
        >
          <motion.div
            variants={fadeInUp}
            className="group p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Track Traders</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Follow top performers and view real-time stats including PnL, ROI, win rate, and accuracy.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="group p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Copy className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Copy Trading</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Mirror positions from successful traders with adjustable risk multipliers. Non-custodial and secure.
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="group p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Compete & Win</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Join weekly fantasy contests, earn badges, and climb the leaderboard to prove your trading skills.
            </p>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto mb-32"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div variants={fadeInUp} className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Connect Wallet</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Sign in with your Web3 wallet. No email or password required. Your keys, your control.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Discover Traders</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Browse top traders on the leaderboard. Analyze their performance, strategies, and track record.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 text-white text-3xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Trade & Compete</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Follow, copy, or compete with the best. Build your reputation and climb the ranks.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Why Praxis Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto mb-32"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Why Choose Praxis?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Built for traders, by traders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Real-Time Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Track every trade, analyze every strategy. Get insights that matter.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Non-Custodial</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Your funds stay in your wallet. We never touch your assets.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Transparent Stats</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All performance data is on-chain and verifiable. No fake numbers.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Lightning Fast</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Built on Polygon for instant trades and minimal fees.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-20 text-white text-center mb-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Start Trading Smarter?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
              Join the social trading revolution. Connect your wallet and explore markets now.
            </p>
            <Link
              href="/markets"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg"
            >
              Get Started Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
