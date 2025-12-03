"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

interface FeedEventProps {
  event: {
    id: string;
    type: string;
    timestamp: string;
    user: {
      id: string;
      username: string;
      avatar?: string;
    };
    market?: {
      id: string;
      question: string;
      category?: string;
    };
    data: any;
  };
}

export function FeedEvent({ event }: FeedEventProps) {
  const renderEventContent = () => {
    switch (event.type) {
      case "position_opened":
        return (
          <div>
            <p className="font-medium">
              <Link
                href={`/profile/${event.user.username}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {event.user.username}
              </Link>{" "}
              opened a position
            </p>
            {event.market && (
              <Link
                href={`/markets/${event.market.id}`}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 block mt-1"
              >
                {event.market.question}
              </Link>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                {event.data.outcome}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                ${event.data.value?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        );

      case "position_closed":
        return (
          <div>
            <p className="font-medium">
              <Link
                href={`/profile/${event.user.username}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {event.user.username}
              </Link>{" "}
              closed a position
            </p>
            {event.market && (
              <Link
                href={`/markets/${event.market.id}`}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 block mt-1"
              >
                {event.market.question}
              </Link>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded">
                {event.data.outcome}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                ${event.data.value?.toFixed(2) || "0.00"}
              </span>
              {event.data.pnl !== undefined && (
                <span
                  className={`font-semibold ${
                    event.data.pnl >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {event.data.pnl >= 0 ? "+" : ""}${event.data.pnl.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        );

      case "whale_trade":
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐋</span>
              <p className="font-medium">
                <Link
                  href={`/profile/${event.user.username}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {event.user.username}
                </Link>{" "}
                made a whale trade
              </p>
            </div>
            {event.market && (
              <Link
                href={`/markets/${event.market.id}`}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 block mt-1"
              >
                {event.market.question}
              </Link>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded font-semibold">
                {event.data.action === "opened" ? "OPENED" : "CLOSED"}
              </span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                {event.data.outcome}
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                ${event.data.value?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        );

      case "streak_achieved":
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <p className="font-medium">
                <Link
                  href={`/profile/${event.user.username}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {event.user.username}
                </Link>{" "}
                achieved a {event.data.streak}-day winning streak!
              </p>
            </div>
          </div>
        );

      case "badge_earned":
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <p className="font-medium">
                <Link
                  href={`/profile/${event.user.username}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {event.user.username}
                </Link>{" "}
                earned the <strong>{event.data.badgeName}</strong> badge
              </p>
            </div>
            {event.data.badgeDescription && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {event.data.badgeDescription}
              </p>
            )}
          </div>
        );

      default:
        return (
          <p className="text-slate-600 dark:text-slate-400">
            Unknown event type: {event.type}
          </p>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">{renderEventContent()}</div>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-4 whitespace-nowrap">
            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
