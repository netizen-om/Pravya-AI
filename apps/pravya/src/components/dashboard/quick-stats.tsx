"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, FileText, Flame, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HoverGradient } from "../HoverGradient";
import type { QuickStatsData } from "@/actions/dashboard-action";

interface QuickStatsProps {
  isDark: boolean;
  data: QuickStatsData | null;
}

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  color: string;
  href?: string;
}

// Define a mapping for Tailwind colors to be applied safely
const colorMap: Record<string, string> = {
  blue: "text-blue-500",
  purple: "text-purple-500",
  green: "text-green-500",
  orange: "text-orange-500",
};

// Helper to format stats from data
function buildStats(data: QuickStatsData | null): StatItem[] {
  if (!data) {
    return [
      {
        title: "Interviews Taken",
        value: "0",
        icon: Target,
        description: "This month",
        color: "blue",
      },
      {
        title: "Average Score",
        value: "—",
        icon: TrendingUp,
        description: "Complete interviews to see",
        color: "purple",
      },
      {
        title: "Last Resume",
        value: "No resume",
        icon: FileText,
        description: "Upload a resume to get started",
        color: "green",
        href: "/resume/upload",
      },
      {
        title: "Streak",
        value: "0 days",
        icon: Flame,
        description: "Start practicing!",
        color: "orange",
      },
    ];
  }

  const resumeDescription = data.lastResume
    ? data.lastResume.uploadedDaysAgo === 0
      ? "Uploaded today"
      : data.lastResume.uploadedDaysAgo === 1
      ? "Uploaded 1 day ago"
      : `Uploaded ${data.lastResume.uploadedDaysAgo} days ago`
    : "Upload a resume to get started";

  return [
    {
      title: "Interviews Taken",
      value: data.interviewsThisMonth.toString(),
      icon: Target,
      description: "This month",
      color: "blue",
    },
    {
      title: "Average Score",
      value: data.averageScore !== null ? `${data.averageScore}%` : "—",
      icon: TrendingUp,
      description: data.averageScore !== null ? "Last 10 interviews" : "Complete interviews to see",
      color: "purple",
    },
    {
      title: "Last Resume",
      value: data.lastResume?.fileName || "No resume",
      icon: FileText,
      description: resumeDescription,
      color: "green",
      href: data.lastResume ? undefined : "/resume/upload",
    },
    {
      title: "Streak",
      value: `${data.streak} day${data.streak !== 1 ? "s" : ""}`,
      icon: Flame,
      description: data.streak > 0 ? "Practiced in a row" : "Start practicing!",
      color: "orange",
    },
  ];
}

export function QuickStats({ isDark, data }: QuickStatsProps) {
  const stats = buildStats(data);
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="space-y-6"
    >
      <h2 className={"text-2xl font-semibold"}>Quick Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * index }}
          >
            <div className="border rounded-2xl transition-all duration-300">
              <Card
                className={
                  "border-neutral-400 bg-white dark:bg-neutral-900/50 dark:border-neutral-800 rounded-2xl hover:scale-[1.02] transition-transform duration-200 group border-none shadow-none"
                }
              >
                <HoverGradient
                  gradientSize={300}
                  fromColor={isDark ? "#262626" : "#D9D9D955"}
                  toColor={isDark ? "#262626" : "#D9D9D955"}
                  opacity={0.8}
                >
                  <div className="p-6">
                    {stat.href ? (
                      <Link href={stat.href} className="block">
                        <StatContent stat={stat} isDark={isDark} />
                      </Link>
                    ) : (
                      <StatContent stat={stat} isDark={isDark} />
                    )}
                  </div>
                </HoverGradient>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function StatContent({
  stat,
  isDark,
}: {
  stat: StatItem;
  isDark: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <stat.icon
          // Use the color map to safely apply Tailwind class
          className={cn("h-5 w-5", colorMap[stat.color] || "text-gray-500")}
        />
        <div className="text-right">
          <div
            className={cn(
              "text-2xl font-bold",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            {stat.value}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h3
          className={cn("font-medium", isDark ? "text-white" : "text-gray-800")}
        >
          {stat.title}
        </h3>
        <p
          className={cn(
            "text-sm",
            isDark ? "text-neutral-400" : "text-gray-500"
          )}
        >
          {stat.description}
        </p>
      </div>
    </div>
  );
}
