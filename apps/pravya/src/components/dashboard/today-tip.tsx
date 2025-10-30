"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHydrationSafeTheme } from "@/components/hooks/useHydrationSafeTheme";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

// Tiny trend data for Interview Mode Activity
const interviewTrend = [
  { day: "Monday", value: 3 },
  { day: "Tuesday", value: 4 },
  { day: "Wednesday", value: 0 },
  { day: "Thursday", value: 5 },
  { day: "Friday", value: 3 },
  { day: "Saturday", value: 6 },
  { day: "Sunday", value: 4 },
];

export function TodaysTip() {
  const { theme, isMounted } = useHydrationSafeTheme();
  const isDark = theme === "dark";

  // Skeleton while waiting for hydration
  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[180px] animate-pulse" />
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[180px] animate-pulse" />
        </div>
      </motion.section>
    );
  }

  // Final component
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* === Left: Today's Tip === */}
        <Card
          className="glassmorphism"
          style={{
            background:
              "linear-gradient(135deg, rgba(180, 83, 9, 0.2) 0%, rgba(146, 64, 14, 0.2) 100%)",
            borderColor: "rgba(180, 83, 9, 0.5)",
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Lightbulb className="h-5 w-5" />
              Today's Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">
              Structure your answers using the{" "}
              <b>STAR method</b> — <b>Situation</b>, <b>Task</b>, <b>Action</b>,
              and <b>Result</b>. This helps you explain experiences clearly and
              confidently.
            </p>
          </CardContent>
        </Card>

        {/* === Right: Interview Activity Trend === */}
        <Card
          className={cn(
            "rounded-2xl transition-all duration-300 backdrop-blur-md",
            isDark
              ? "bg-neutral-950/70 border-neutral-800"
              : "bg-white/70 border-gray-200"
          )}
        >
          <CardHeader>
            <CardTitle
              className={cn(
                "text-sm font-medium",
                isDark ? "text-gray-200" : "text-gray-800"
              )}
            >
              Interview Activity Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[100px]">
            <div className="w-full h-[70px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interviewTrend}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#171717" : "#f9f9f9",
                      borderRadius: "8px",
                      border: "none",
                      color: isDark ? "#fff" : "#000",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isDark ? "#38BDF8" : "#3B82F6"}
                    strokeWidth={2.2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p
              className={cn(
                "text-xs mt-2",
                isDark ? "text-gray-400" : "text-gray-500"
              )}
            >
              Your weekly interview activity pattern
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
