"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  FileText,
  CreditCard,
  Clock,
  Trash2,
  Key,
  Sparkles,
  LucideIcon,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HoverGradient } from "../HoverGradient";
import type { RecentActivityItem } from "@/actions/dashboard-action";
import { ActivityAction } from "@prisma/client";

interface RecentActivityProps {
  isDark: boolean;
  data: RecentActivityItem[];
}

// Map activity action to icon and color
function getActivityIconAndColor(action: ActivityAction): {
  icon: LucideIcon;
  color: string;
} {
  switch (action) {
    case "INTERVIEW_COMPLETED":
      return { icon: CheckCircle, color: "green" };
    case "INTERVIEW_DELETED":
      return { icon: Trash2, color: "orange" };
    case "RESUME_UPLOADED":
      return { icon: FileText, color: "blue" };
    case "RESUME_DELETED":
      return { icon: Trash2, color: "orange" };
    case "PAYMENT_SUCCESS":
      return { icon: CreditCard, color: "green" };
    case "PAYMENT_FAILED":
      return { icon: AlertCircle, color: "orange" };
    case "SUBSCRIPTION_STARTED":
      return { icon: Sparkles, color: "purple" };
    case "PASSWORD_RESET_REQUEST":
      return { icon: Key, color: "blue" };
    default:
      return { icon: CheckCircle, color: "blue" };
  }
}

// Helper to get relative time description
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function RecentActivity({ isDark, data }: RecentActivityProps) {
  const colorMap: Record<string, string> = {
    blue: "#3B82F6",
    green: "#22C55E",
    purple: "#A855F7",
    orange: "#FB923C",
  };

  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        className="space-y-6"
      >
        <h2
          className={cn(
            "text-2xl font-semibold",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Recent Activity
        </h2>

        <Card
          className={cn(
            "rounded-2xl shadow-sm border transition-all duration-300",
            isDark
              ? "bg-neutral-900/50 border-neutral-800"
              : "bg-white border-gray-200"
          )}
        >
          <HoverGradient
            gradientSize={300}
            fromColor={isDark ? "#262626" : "#D9D9D955"}
            toColor={isDark ? "#262626" : "#D9D9D955"}
            opacity={0.8}
          >
            <div className="rounded-2xl border-none transition-all duration-300 p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                    isDark ? "bg-neutral-800" : "bg-gray-100"
                  )}
                >
                  <Clock
                    className={cn(
                      "h-6 w-6",
                      isDark ? "text-neutral-500" : "text-gray-400"
                    )}
                  />
                </div>
                <p
                  className={cn(
                    "text-sm font-medium mb-1",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  No activity yet
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isDark ? "text-neutral-400" : "text-gray-500"
                  )}
                >
                  Complete interviews or upload resumes to see your activity
                </p>
              </div>
            </div>
          </HoverGradient>
        </Card>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <h2
        className={cn(
          "text-2xl font-semibold",
          isDark ? "text-white" : "text-gray-900"
        )}
      >
        Recent Activity
      </h2>

      {/* Card Container */}
      <Card
        className={cn(
          "rounded-2xl shadow-sm border transition-all duration-300",
          isDark
            ? "bg-neutral-900/50 border-neutral-800"
            : "bg-white border-gray-200"
        )}
      >
        <HoverGradient
          gradientSize={300}
          fromColor={isDark ? "#262626" : "#D9D9D955"}
          toColor={isDark ? "#262626" : "#D9D9D955"}
          opacity={0.8}
        >
          <div className="rounded-2xl border-none transition-all duration-300 p-6">
            <div className="space-y-6">
              {data.map((activity, index) => {
                const { icon: Icon, color } = getActivityIconAndColor(activity.action);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 * index }}
                    className="flex items-start space-x-4 relative"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center",
                          isDark ? "bg-neutral-800" : "bg-gray-100"
                        )}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: colorMap[color] }}
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isDark ? "text-white" : "text-gray-900"
                          )}
                        >
                          {activity.title}
                        </p>
                        <div
                          className={cn(
                            "flex items-center text-xs",
                            isDark ? "text-neutral-400" : "text-gray-500"
                          )}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {getRelativeTime(activity.timestamp)}
                        </div>
                      </div>
                      <p
                        className={cn(
                          "text-sm mt-1",
                          isDark ? "text-neutral-400" : "text-gray-600"
                        )}
                      >
                        {activity.description || "—"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </HoverGradient>
      </Card>
    </motion.section>
  );
}
