"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { HoverGradient } from "../HoverGradient";

interface DashboardMetricsProps {
  metrics: {
    communication: { score: number; comment: string };
    technicalCommunication: { score: number; comment: string };
    hardSkills: { score: number; comment: string };
    problemSolving: { score: number; comment: string };
    softSkills: { score: number; comment: string };
    confidence: { score: number; comment: string };
  };
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const metricLabels = {
  communication: "Communication",
  technicalCommunication: "Technical Communication",
  hardSkills: "Hard Skills",
  problemSolving: "Problem Solving",
  softSkills: "Soft Skills",
  confidence: "Confidence",
};

interface DashboardMetricsPropsExtended extends DashboardMetricsProps {
  isDark: boolean;
}

export default function DashboardMetrics({
  metrics,
  isDark,
}: DashboardMetricsPropsExtended) {
  const radarData = [
    { name: "Communication", value: metrics.communication.score },
    { name: "Tech Comm", value: metrics.technicalCommunication.score },
    { name: "Hard Skills", value: metrics.hardSkills.score },
    { name: "Problem Solving", value: metrics.problemSolving.score },
    { name: "Soft Skills", value: metrics.softSkills.score },
    { name: "Confidence", value: metrics.confidence.score },
  ];

  const metricsArray = Object.entries(metrics).map(([key, value]) => ({
    key,
    label: metricLabels[key as keyof typeof metricLabels],
    ...value,
  }));


  return (
    <motion.div
      className="space-y-6"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Radar Chart */}
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <HoverGradient
          gradientSize={300}
          fromColor={isDark ? "#262626" : "#D9D9D955"}
          toColor={isDark ? "#262626" : "#D9D9D955"}
          opacity={0.8}
        >
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke={isDark ? "#404040" : "#e5e7eb"} />
                <PolarAngleAxis
                  dataKey="name"
                  stroke={isDark ? "#a3a3a3" : "#6b7280"}
                  fontSize={13}
                />
                <PolarRadiusAxis
                  angle={60}
                  domain={[0, 10]}
                  stroke={isDark ? "#a3a3a3" : "#6b7280"}
                  tickCount={5}
                />
                <Radar
                  name="Skill Score"
                  dataKey="value"
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
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="radarGradientDark"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
          </CardContent>
        </HoverGradient>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {metricsArray.map((metric, idx) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-full">
              <HoverGradient
                gradientSize={300}
                fromColor={isDark ? "#262626" : "#D9D9D955"}
                toColor={isDark ? "#262626" : "#D9D9D955"}
                opacity={0.8}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-neutral-900 dark:text-white">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-2xl font-bold ${
                        metric.score <= 4
                          ? "text-red-600 dark:text-red-500"
                          : metric.score <= 7
                          ? "text-orange-400 dark:text-orange-400"
                          : "text-green-600 dark:text-green-600"
                      }`}
                    >
                      {metric.score}
                    </span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      / 10
                    </span>
                  </div>
                  <Progress
                    value={(metric.score / 10) * 100}
                    className={`h-2 ${
                      metric.score <= 4
                        ? "[&>div]:bg-red-600"
                        : metric.score <= 7
                        ? "[&>div]:bg-orange-400"
                        : "[&>div]:bg-green-500"
                    }`}
                  />
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {metric.comment}
                  </p>
                </CardContent>
              </HoverGradient>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
