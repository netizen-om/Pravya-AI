"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { HoverGradient } from "../HoverGradient";

interface OverallPerformanceProps {
  performance: {
    overallScore: number;
    summary: string;
    keyStrengths: string[];
    keyAreasForImprovement: string[];
  };
}

interface OverallPerformancePropsExtended extends OverallPerformanceProps {
  isDark: boolean;
}

// 🟢 Centralized color configuration for easy customization
const COLORS = {
  light: {
    low: {
      text: "text-red-600",
      ring: "#dc2626",
      bg: "bg-red-100/60",
      border: "border-red-300",
      alertText: "text-red-800",
    },
    medium: {
      text: "text-amber-900",
      ring: "#f59e0b",
      bg: "bg-amber-400/60",
      border: "border-amber-500",
      alertText: "text-orange-800",
    },
    high: {
      text: "text-green-600",
      ring: "#059669",
      bg: "bg-green-200/70",
      border: "border-green-300",
      alertText: "text-green-800",
    },
  },
  dark: {
    low: {
      text: "text-red-500",
      ring: "#ef4444",
      bg: "bg-red-950",
      border: "border-red-900",
      alertText: "text-red-300",
    },
    medium: {
      text: "text-orange-400",
      ring: "#fb923c",
      bg: "bg-orange-950",
      border: "border-orange-900",
      alertText: "text-orange-300",
    },
    high: {
      text: "text-green-600",
      ring: "#16a34a",
      bg: "bg-green-950",
      border: "border-green-900",
      alertText: "text-green-300",
    },
  },
};

// 🧮 Helper to select colors based on score and theme
function getColorSet(score: number, isDark: boolean) {
  const theme = isDark ? COLORS.dark : COLORS.light;
  if (score <= 40) return theme.low;
  if (score <= 70) return theme.medium;
  return theme.high;
}

export default function OverallPerformance({ performance, isDark }: OverallPerformancePropsExtended) {

  const colorSet = getColorSet(performance.overallScore, isDark);

  const parentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div className="space-y-6" variants={parentVariants} initial="hidden" animate="visible">
      {/* Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <HoverGradient
            gradientSize={300}
            fromColor={isDark ? "#1a1a1a" : "#E5E5E555"}
            toColor={isDark ? "#1a1a1a" : "#E5E5E555"}
            opacity={1}
          >
            <CardHeader>
              <CardTitle className="text-lg text-neutral-900 dark:text-white">
                Overall Performance
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Score Gauge */}
              <motion.div
                className="flex flex-col items-center justify-center py-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="relative flex items-center justify-center w-48 h-48"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(${colorSet.ring} ${
                        performance.overallScore * 3.6
                      }deg, ${isDark ? "#141414" : "#f3f4f6"} 0deg)`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-2 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center"
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.p
                      className={`text-3xl font-bold ${colorSet.text}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {performance.overallScore}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Dynamic Summary */}
              <motion.div variants={itemVariants}>
                <Alert
                  className={`${colorSet.bg} ${colorSet.border} border ${colorSet.text}`}
                >
                  <AlertCircle className={`h-4 w-4 ${colorSet.text}`} />
                  <AlertTitle className={`font-semibold ${colorSet.text}`}>
                    Summary
                  </AlertTitle>
                  <AlertDescription className={`mt-2 text-sm ${colorSet.alertText}`}>
                    {performance.summary}
                  </AlertDescription>
                </Alert>
              </motion.div>
            </CardContent>
          </HoverGradient>
        </Card>
      </motion.div>

      {/* Strengths & Improvements */}
      <motion.div className="space-y-4" variants={parentVariants}>
        {/* Strengths */}
        <motion.div variants={itemVariants}>
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <HoverGradient
              gradientSize={300}
              fromColor={isDark ? "#1a1a1a" : "#E5E5E555"}
              toColor={isDark ? "#1a1a1a" : "#E5E5E555"}
              opacity={0.8}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-neutral-900 dark:text-white">
                  <CheckCircle2 className="h-5 w-5 text-green-700/90 dark:text-green-400" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.ul className="space-y-3" variants={parentVariants} initial="hidden" animate="visible">
                  {performance.keyStrengths.map((strength, idx) => (
                    <motion.li
                      key={idx}
                      className="flex gap-3 text-sm"
                      variants={itemVariants}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-700/90 dark:text-green-400 mt-0.5" />
                      <span className="text-neutral-700 dark:text-neutral-300">{strength}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </HoverGradient>
          </Card>
        </motion.div>

        {/* Areas for Improvement */}
        <motion.div variants={itemVariants}>
          <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <HoverGradient
              gradientSize={300}
              fromColor={isDark ? "#1a1a1a" : "#E5E5E555"}
              toColor={isDark ? "#1a1a1a" : "#E5E5E555"}
              opacity={0.8}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-neutral-900 dark:text-white">
                  <AlertCircle className="h-5 w-5 text-amber-700/90 dark:text-amber-400" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.ul className="space-y-3" variants={parentVariants} initial="hidden" animate="visible">
                  {performance.keyAreasForImprovement.map((area, idx) => (
                    <motion.li
                      key={idx}
                      className="flex gap-3 text-sm"
                      variants={itemVariants}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-700/90 dark:text-amber-400 mt-0.5" />
                      <span className="text-neutral-700 dark:text-neutral-300">{area}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </CardContent>
            </HoverGradient>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
