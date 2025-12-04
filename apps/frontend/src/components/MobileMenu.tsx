"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useUser";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: user } = useCurrentUser();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: "/markets", label: "Markets" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/feed", label: "Feed" },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: `/profile/${user?.username}`, label: "Profile" },
  ];

  return (
    <>
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-lg font-bold">Menu</span>
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className="block px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}

                    {isAuthenticated && user && (
                      <>
                        <div className="my-4 border-t border-slate-200 dark:border-slate-800" />
                        {authLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className="block px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                </nav>

                {/* Connect Wallet - Mobile */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                  <ConnectButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
