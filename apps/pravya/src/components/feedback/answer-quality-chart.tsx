"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverGradient } from "../HoverGradient";

interface AnswerQualityChartProps {
  questions: Array<{
    questionText: string;
    specificFeedback: {
      relevance: { score: number };
      clarity: { score: number };
      depthAndExamples: { score: number };
      structure: { score: number };
    };
  }>;
  isDark: boolean;
}

export default function AnswerQualityChart({ questions, isDark }: AnswerQualityChartProps) {
  const chartData = questions.slice(0, 5).map((q, idx) => ({
    name: `Q${idx + 1}`,
    Relevance: q.specificFeedback.relevance.score,
    Clarity: q.specificFeedback.clarity.score,
    Depth: q.specificFeedback.depthAndExamples.score,
    Structure: q.specificFeedback.structure.score,
  }));

  // ✅ Keep same light theme colors, enhance dark mode gradients
  const colors = isDark
    ? {
        Relevance: "url(#gradBlueDark)",
        Clarity: "url(#gradGreenDark)",
        Depth: "url(#gradAmberDark)",
        Structure: "url(#grad VioletDark)",
      }
    : {
        Relevance: "url(#gradBlueLight)",
        Clarity: "url(#gradGreenLight)",
        Depth: "url(#gradAmberLight)",
        Structure: "url(#gradVioletLight)",
      };

  const chartVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card
        className={`border-none overflow-hidden transition-all duration-500 ${
          isDark
            ? "dark:bg-neutral-900 dark:border-neutral-800"
            : "bg-gradient-to-br from-white to-neutral-100 shadow-[0_0_25px_rgba(59,130,246,0.2)]"
        }`}
      >
        <HoverGradient
          gradientSize={400}
          fromColor={isDark ? "#0F0F10" : "#E5E7EB"}
          toColor={isDark ? "#1C1C1E" : "#F9FAFB"}
          opacity={0.8}
        >
          <CardHeader>
            <CardTitle
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-neutral-800"
              }`}
            >
              Answer Quality Breakdown
            </CardTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Visual comparison of scores across different answer dimensions
            </p>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, right: 20, left: 30, bottom: 10 }}
              >
                {/* GRADIENT DEFINITIONS */}
                <defs>
                  {/* Light Theme Gradients (same as before) */}
                  <linearGradient id="gradBlueLight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="gradGreenLight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="gradAmberLight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="gradVioletLight" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C084FC" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>

                  {/* 🌙 Enhanced Dark Theme Gradients */}
                  <linearGradient id="gradBlueDark" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1E40AF" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                  <linearGradient id="gradGreenDark" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#064E3B" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="gradAmberDark" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#78350F" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                  <linearGradient id="gradVioletDark" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4C1D95" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#27272A" : "#E5E7EB"}
                />

                <XAxis
                  type="number"
                  domain={[0, 10]}
                  tick={{ fontSize: 12, fill: isDark ? "#9CA3AF" : "#6B7280" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: isDark ? "#A1A1AA" : "#6B7280" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#18181B" : "#F9FAFB",
                    borderColor: isDark ? "#27272A" : "#E5E7EB",
                    borderRadius: "10px",
                    color: isDark ? "#F9FAFB" : "#111827",
                  }}
                />

                {/* Bars with Animation */}
                {Object.keys(colors).map((key, i) => (
                  <motion.g
                    key={key}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                    style={{ transformOrigin: "left" }}
                  >
                    <Bar
                      dataKey={key}
                      barSize={12}
                      radius={[8, 8, 8, 8]}
                      fill={colors[key as keyof typeof colors]}
                      animationDuration={900}
                    />
                  </motion.g>
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </HoverGradient>
      </Card>
    </motion.div>
  );
}
