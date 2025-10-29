"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MagicCard } from "../ui/magic-card";
import { cn } from "@/lib/utils";

const scoresData7Days = [
  { date: "Mon", score: 78 },
  { date: "Tue", score: 82 },
  { date: "Wed", score: 85 },
  { date: "Thu", score: 79 },
  { date: "Fri", score: 88 },
  { date: "Sat", score: 91 },
  { date: "Sun", score: 87 },
];

const scoresData30Days = [
  { date: "Week 1", score: 75 },
  { date: "Week 2", score: 82 },
  { date: "Week 3", score: 88 },
  { date: "Week 4", score: 87 },
];

const strengthsData = [
  { skill: "Communication", score: 92 },
  { skill: "Technical", score: 85 },
  { skill: "Problem-Solving", score: 78 },
  { skill: "Confidence", score: 88 },
];

export function PerformanceAnalytics() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState<"7days" | "30days">("7days");

  const scoresData = timeRange === "7days" ? scoresData7Days : scoresData30Days;

  const barColors = ["#3B82F6", "#22C55E", "#A855F7", "#FB923C"]; // blue, green, purple, orange

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className={cn(
            "text-2xl font-semibold",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Performance Analytics
        </h2>

        {/* Filter */}
        <div
          className={cn(
            "flex rounded-lg p-1",
            isDark ? "bg-neutral-900" : "bg-gray-100"
          )}
        >
          <Button
            variant={timeRange === "7days" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("7days")}
            className={cn(
              "text-sm transition-all",
              timeRange === "7days"
                ? isDark
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-gray-900 text-white hover:bg-gray-800"
                : isDark
                ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
            )}
          >
            Last 7 days
          </Button>
          <Button
            variant={timeRange === "30days" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("30days")}
            className={cn(
              "text-sm transition-all",
              timeRange === "30days"
                ? isDark
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-gray-900 text-white hover:bg-gray-800"
                : isDark
                ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
            )}
          >
            Last 30 days
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Scores Over Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
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
                "rounded-2xl border-none p-6 transition-all duration-300",
                isDark
                  ? "bg-neutral-900/70 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                  : "bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-md"
              )}
            >
              <h3
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                Scores Over Time
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoresData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "#404040" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={isDark ? "#a3a3a3" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={isDark ? "#a3a3a3" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={isDark ? "#ffffff" : "#111827"}
                      strokeWidth={2}
                      dot={{
                        fill: isDark ? "#ffffff" : "#111827",
                        r: 4,
                      }}
                      activeDot={{
                        r: 6,
                        fill: isDark ? "#ffffff" : "#111827",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>
          </Card>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
        >
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
                "rounded-2xl border-none p-6 transition-all duration-300",
                isDark
                  ? "bg-neutral-900/70 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                  : "bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-md"
              )}
            >
              <h3
                className={cn(
                  "text-lg font-semibold mb-2",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                Strengths & Weaknesses
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={strengthsData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "#404040" : "#e5e7eb"}
                    />
                    <XAxis
                      type="number"
                      stroke={isDark ? "#a3a3a3" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      stroke={isDark ? "#a3a3a3" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={110}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
                      {strengthsData.map((_, i) => (
                        <Cell key={i} fill={barColors[i % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
