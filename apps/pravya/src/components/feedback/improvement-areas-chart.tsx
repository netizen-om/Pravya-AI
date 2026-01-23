"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { HoverGradient } from "../HoverGradient";

interface ImprovementAreasChartProps {
  questions: Array<{
    questionText: string;
    specificFeedback: {
      relevance: { score: number };
      clarity: { score: number };
      depthAndExamples: { score: number };
      structure: { score: number };
    };
  }>;
}

interface ImprovementAreasChartPropsExtended extends ImprovementAreasChartProps {
  isDark: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.8, bounce: 0.3 },
  },
};

// ✨ Aesthetic premium gradient-based color palette (looks godlike on both themes)

export default function ImprovementAreasChart({
  questions,
  isDark,
}: ImprovementAreasChartPropsExtended) {
  const COLORS = [
    isDark ? "#EF4444" : "#3B82F6", // red-500 for dark mode (relevance)
    isDark ? "#FB923C" : "#10B981", // orange-400 (clarity)
    isDark ? "#16A34A" : "#F59E0B", // green-600 (depth)
    isDark ? "#8B5CF6" : "#8B5CF6", // violet-500 (structure)
  ];

  const improvements = {
    Relevance: 0,
    Clarity: 0,
    "Depth & Examples": 0,
    Structure: 0,
  };

  questions.forEach((q) => {
    improvements["Relevance"] += 10 - q.specificFeedback.relevance.score;
    improvements["Clarity"] += 10 - q.specificFeedback.clarity.score;
    improvements["Depth & Examples"] +=
      10 - q.specificFeedback.depthAndExamples.score;
    improvements["Structure"] += 10 - q.specificFeedback.structure.score;
  });

  const chartData = Object.entries(improvements)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0);

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <HoverGradient
          gradientSize={300}
          fromColor={isDark ? "#262626" : "#D9D9D955"}
          toColor={isDark ? "#262626" : "#D9D9D955"}
          opacity={0.8}
        >
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">
              Improvement Opportunities
            </CardTitle>
          </CardHeader>

          <CardContent className=" opacity-90">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    innerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name }) => name}
                    isAnimationActive={true}
                    animationBegin={200}
                    animationDuration={900}
                    animationEasing="ease-out"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        style={{
                          filter: isDark
                            ? "brightness(1.1) drop-shadow(0px 0px 8px rgba(255,255,255,0.1))"
                            : "drop-shadow(0px 0px 6px rgba(0,0,0,0.08))",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#18181B" : "#F9FAFB",
                      borderColor: isDark ? "#27272A" : "#E5E7EB",
                      borderRadius: "8px",
                      boxShadow: isDark
                        ? "0 0 10px rgba(0,0,0,0.6)"
                        : "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                    itemStyle={{
                      color: isDark ? "#FFFFFF" : "#111827",
                      fontSize: "16px",
                    }}
                    labelStyle={{
                      color: isDark ? "#FFFFFF" : "#374151",
                      fontWeight: 1200,
                    }}
                    formatter={(value: number) => value.toFixed(1)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-neutral-600 dark:text-neutral-400">
                Excellent performance across all dimensions!
              </div>
            )}
          </CardContent>
        </HoverGradient>
      </Card>
    </motion.div>
  );
}
