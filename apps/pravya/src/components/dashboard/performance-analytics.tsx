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
import { cn } from "@/lib/utils";
import { HoverGradient } from "../HoverGradient";
import { BarChart3 } from "lucide-react";
import type { PerformanceData } from "@/actions/dashboard-action";

interface PerformanceAnalyticsProps {
  isDark: boolean;
  data: PerformanceData | null;
}

export function PerformanceAnalytics({ isDark, data }: PerformanceAnalyticsProps) {
  const scoresData = data?.scoresOverTime || [];
  const strengthsData = data?.strengthsData || [];
  
  const hasScoresData = scoresData.length > 0;
  const hasStrengthsData = strengthsData.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-start">
        <h2
          className={cn(
            "text-2xl font-semibold",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Performance Analytics
        </h2>
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
            className={"rounded-2xl broder-none transition-all duration-300 bg-white dark:bg-neutral-900/50 dark:border-neutral-800"}
          >
            <HoverGradient
              gradientSize={300}
              fromColor={isDark ? "#262626" : "#D9D9D955"}
              toColor={isDark ? "#262626" : "#D9D9D955"}
              opacity={0.8}
            >
              <div className="rounded-2xl border-none p-6 transition-all duration-300">
                <h3
                  className={cn(
                    "text-lg font-semibold mb-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  Scores Over Time
                </h3>

                <div className="h-56">
                  {hasScoresData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scoresData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={"#404040"}
                        />
                        <XAxis
                          dataKey="date"
                          stroke={"#a3a3a3"}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke={"#a3a3a3"}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 100]}
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
                            color: "#a3a3a3",
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
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <BarChart3
                        className={cn(
                          "h-10 w-10 mb-3",
                          isDark ? "text-neutral-600" : "text-gray-300"
                        )}
                      />
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-neutral-400" : "text-gray-500"
                        )}
                      >
                        Complete interviews to see your score trends
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </HoverGradient>
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
              <div className="rounded-2xl border-none p-6 transition-all duration-300">
                <h3
                  className={cn(
                    "text-lg font-semibold mb-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  Strengths & Weaknesses
                </h3>

                <div className="h-56">
                  {hasStrengthsData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={strengthsData}
                      >
                        <PolarGrid stroke={isDark ? "#404040" : "#e5e7eb"} />
                        <PolarAngleAxis
                          dataKey="skill"
                          stroke={isDark ? "#a3a3a3" : "#6b7280"}
                          fontSize={13}
                        />
                        <PolarRadiusAxis
                          angle={60}
                          domain={[0, 100]}
                          stroke={isDark ? "#a3a3a3" : "#6b7280"}
                          tickCount={5}
                        />
                        <Radar
                          name="Skill Score"
                          dataKey="score"
                          stroke={isDark ? "#22C55E" : "#3B82F6"}
                          fill={
                            isDark
                              ? "url(#radarGradientDark)"
                              : "url(#radarGradientLight)"
                          }
                          fillOpacity={0.5}
                          animationBegin={200}
                          animationDuration={1000}
                        />
                        <defs>
                          <linearGradient
                            id="radarGradientLight"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#60A5FA"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3B82F6"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                          <linearGradient
                            id="radarGradientDark"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#22C55E"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#15803D"
                              stopOpacity={0.2}
                            />
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
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <BarChart3
                        className={cn(
                          "h-10 w-10 mb-3",
                          isDark ? "text-neutral-600" : "text-gray-300"
                        )}
                      />
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-neutral-400" : "text-gray-500"
                        )}
                      >
                        Complete interviews to see your skill analysis
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </HoverGradient>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
