"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, FileText, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MagicCard } from "../../components/ui/magic-card";
import { HoverGradient } from "../HoverGradient";

interface QuickStatsProps {
  isDark: boolean;
}

const stats = [
  {
    title: "Interviews Taken",
    value: "23",
    icon: Target,
    description: "This month",
    color: "blue",
  },
  {
    title: "Average Score",
    value: "87%",
    icon: TrendingUp,
    description: "Last 10 interviews",
    color: "purple",
  },
  {
    title: "Last Resume",
    value: "resume_v2.pdf",
    icon: FileText,
    description: "Uploaded 2 days ago",
    href: "/resume/analysis",
    color: "green",
  },
  {
    title: "Streak",
    value: "3 days",
    icon: Flame,
    description: "Practiced in a row",
    color: "orange",
  },
];

// Define a mapping for Tailwind colors to be applied safely
const colorMap: Record<string, string> = {
  blue: "text-blue-500",
  purple: "text-purple-500",
  green: "text-green-500",
  orange: "text-orange-500",
};

export function QuickStats({ isDark }: QuickStatsProps) {
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
                  "bg-neutral-900/50 border-neutral-800 rounded-2xl hover:scale-[1.02] transition-transform duration-200 group border-none shadow-none"
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
  stat: (typeof stats)[0];
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
