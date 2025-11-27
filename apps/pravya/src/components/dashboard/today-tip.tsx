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
import { Lightbulb, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverGradient } from "../HoverGradient";
import type { InterviewTrendData } from "@/actions/dashboard-action";

interface TodaysTipProps {
  isDark: boolean;
  interviewTrend: InterviewTrendData[];
}

export function TodaysTip({ isDark, interviewTrend }: TodaysTipProps) {
  const hasTrendData = interviewTrend && interviewTrend.length > 0;
  const totalInterviews = interviewTrend?.reduce((sum, day) => sum + day.value, 0) || 0;

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
          className="glassmorphism border-amber-500 dark:border-amber-900 bg-amber-300/60 dark:bg-amber-950"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2  text-amber-800 dark:text-amber-200">
              <Lightbulb className="h-5 w-5" />
              Today's Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className=" text-amber-700 dark:text-amber-200">
              Structure your answers using the <b>STAR method</b> —{" "}
              <b>Situation</b>, <b>Task</b>, <b>Action</b>, and <b>Result</b>.
              This helps you explain experiences clearly and confidently.
            </p>
          </CardContent>
        </Card>

        {/* === Right: Interview Activity Trend === */}
        <Card
          className={cn(
            "rounded-2xl transition-all duration-300 backdrop-blur-md",
            isDark
              ? "bg-neutral-900/50 border-neutral-800"
              : "bg-white/70 border-gray-200"
          )}
        >
          <HoverGradient
            gradientSize={300}
            fromColor={isDark ? "#262626" : "#D9D9D955"}
            toColor={isDark ? "#262626" : "#D9D9D955"}
            opacity={0.8}
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
              {hasTrendData && totalInterviews > 0 ? (
                <>
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
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <TrendingUp
                    className={cn(
                      "h-8 w-8 mb-2",
                      isDark ? "text-neutral-600" : "text-gray-300"
                    )}
                  />
                  <p
                    className={cn(
                      "text-xs",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    Complete interviews to see your activity trend
                  </p>
                </div>
              )}
            </CardContent>
          </HoverGradient>
        </Card>
      </div>
    </motion.section>
  );
}
