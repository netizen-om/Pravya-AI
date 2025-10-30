"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText, BarChart3, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/ui/magic-card"; // Correct relative path
// 1. Import our custom hook
import { useHydrationSafeTheme } from "@/components/hooks/useHydrationSafeTheme" // Correct relative path

const activities = [
  {
    id: 1,
    type: "interview",
    title: "Completed Mock Interview",
    description: "System Design #23",
    timestamp: "2 hours ago",
    icon: CheckCircle,
    color: "blue",
  },
  {
    id: 2,
    type: "resume",
    title: "Resume Uploaded",
    description: "resume_om.pdf",
    timestamp: "1 day ago",
    icon: FileText,
    color: "green",
  },
  {
    id: 3,
    type: "analytics",
    title: "Analytics Report Generated",
    description: "Performance insights updated",
    timestamp: "2 days ago",
    icon: BarChart3,
    color: "purple",
  },
  {
    id: 4,
    type: "interview",
    title: "Completed Mock Interview",
    description: "Behavioral Practice #12",
    timestamp: "3 days ago",
    icon: CheckCircle,
    color: "orange",
  },
];

export function RecentActivity() {
  // 2. Call our hook
  const { theme, isMounted } = useHydrationSafeTheme();
  const isDark = theme === "dark";

  const colorMap: Record<string, string> = {
    blue: "#3B82F6",
    green: "#22C55E",
    purple: "#A855F7",
    orange: "#FB923C",
  };

  // 3. Render skeleton on server / initial client render
  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Header Skeleton */}
        <div className="h-8 w-56 rounded-lg bg-neutral-800 animate-pulse" />
        {/* Card Skeleton */}
        <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[400px] animate-pulse" />
      </motion.section>
    );
  }

  // 4. Render the full component once mounted
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
            ? "bg-neutral-950/90 border-neutral-800"
            : "bg-white border-gray-200"
        )}
      >
        <MagicCard
          gradientColor={isDark ? "#262626" : "#D9D9D955"}
          className={cn(
            "rounded-2xl border-none transition-all duration-300 p-6",
            isDark
              ? "bg-neutral-900/70 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
              : "bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-md"
          )}
        >
          <div className="space-y-6">
            {activities.map((activity, index) => (
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
                    <activity.icon
                      className="h-4 w-4"
                      style={{ color: colorMap[activity.color] }}
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
                      {activity.timestamp}
                    </div>
                  </div>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      isDark ? "text-neutral-400" : "text-gray-600"
                    )}
                  >
                    {activity.description}
                  </p>
                </div>

                {/* Connector line */}
                {index < activities.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-[18px] mt-9 w-px h-full -bottom-6", // Adjusted height
                      isDark ? "bg-neutral-800" : "bg-gray-200"
                    )}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </MagicCard>
      </Card>
    </motion.section>
  );
}
