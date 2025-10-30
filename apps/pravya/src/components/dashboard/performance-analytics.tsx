"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MagicCard } from "../ui/magic-card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useHydrationSafeTheme } from "@/components/hooks/useHydrationSafeTheme";

// 7-day data (Interview + ATS)
const scoresData7Days = [
  { date: "Mon", interviewScore: 78, atsScore: 84 },
  { date: "Tue", interviewScore: 82, atsScore: 81 },
  { date: "Wed", interviewScore: 85, atsScore: 88 },
  { date: "Thu", interviewScore: 79, atsScore: 83 },
  { date: "Fri", interviewScore: 88, atsScore: 90 },
  { date: "Sat", interviewScore: 91, atsScore: 86 },
  { date: "Sun", interviewScore: 87, atsScore: 92 },
];

// 30-day data (Weekly average)
const scoresData30Days = [
  { date: "Week 1", interviewScore: 75, atsScore: 80 },
  { date: "Week 2", interviewScore: 82, atsScore: 85 },
  { date: "Week 3", interviewScore: 88, atsScore: 90 },
  { date: "Week 4", interviewScore: 87, atsScore: 88 },
];

// Enhanced Radar data
const strengthsData = [
  { skill: "Communication", score: 92 },
  { skill: "Technical", score: 85 },
  { skill: "Problem-Solving", score: 78 },
  { skill: "Confidence", score: 88 },
  { skill: "Soft Skills", score: 90 },
  { skill: "Hard Skills", score: 82 },
];

export function PerformanceAnalytics() {
  const { theme, isMounted } = useHydrationSafeTheme();
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState<"7days" | "30days">("7days");

  const scoresData = timeRange === "7days" ? scoresData7Days : scoresData30Days;

  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 rounded-lg bg-neutral-800 animate-pulse" />
          <div className="flex rounded-lg p-1 bg-neutral-900">
            <div className="h-8 w-24 rounded-md bg-neutral-800" />
            <div className="h-8 w-24 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[348px] animate-pulse" />
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[348px] animate-pulse" />
        </div>
      </motion.section>
    );
  }

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
        {/* Scores Over Time (Interview + ATS) */}
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

              <div className="h-56">
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
                      domain={[60, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#18181b" : "#f9fafb",
                        borderRadius: "8px",
                        border: "none",
                        color: isDark ? "#fff" : "#000",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{
                        fontSize: "12px",
                        color: isDark ? "#a3a3a3" : "#6b7280",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="interviewScore"
                      name="Interview Score"
                      stroke={isDark ? "#22C55E" : "#2563EB"}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="atsScore"
                      name="Resume ATS Score"
                      stroke={isDark ? "#38BDF8" : "#0EA5E9"}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
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

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strengthsData}>
                    <PolarGrid stroke={isDark ? "#404040" : "#e5e7eb"} />
                    <PolarAngleAxis
                      dataKey="skill"
                      stroke={isDark ? "#a3a3a3" : "#6b7280"}
                      fontSize={13}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke={isDark ? "#a3a3a3" : "#6b7280"}
                      tickCount={5}
                    />
                    <Radar
                      name="Skill Score"
                      dataKey="score"
                      stroke={isDark ? "#22C55E" : "#3B82F6"}
                      fill={isDark ? "url(#radarGradientDark)" : "url(#radarGradientLight)"}
                      fillOpacity={0.5}
                      animationBegin={200}
                      animationDuration={1000}
                    />
                    <defs>
                      <linearGradient id="radarGradientLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="radarGradientDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#15803D" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#18181b" : "#f9fafb",
                        borderRadius: "8px",
                        border: "none",
                        color: isDark ? "#fff" : "#000",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </MagicCard>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
  