"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useHydrationSafeTheme } from "../hooks/useHydrationSafeTheme";
import { HoverGradient } from "../HoverGradient";

const skills = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "AWS",
  "Docker",
  "MongoDB",
  "GraphQL",
];

const improvements = [
  "Add more quantifiable achievements to demonstrate impact",
  "Include specific technologies used in each project",
  "Strengthen the summary section with key accomplishments",
];

export function ResumeInsights() {
  const { theme, isMounted } = useHydrationSafeTheme();
  const isDark = theme === "dark";

  // 3. Render skeleton on server / initial client render
  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Header Skeleton */}
        <div className="h-8 w-64 rounded-lg bg-neutral-800 animate-pulse" />
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[160px] animate-pulse" />
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[160px] animate-pulse" />
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[160px] animate-pulse" />
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[160px] animate-pulse" />
        </div>
      </motion.section>
    );
  }
  // Define adaptive colors
  const colors = {
    textPrimary: isDark ? "text-white" : "text-neutral-900",
    textSecondary: isDark ? "text-neutral-400" : "text-neutral-600",
    border: isDark ? "border-neutral-800" : "border-neutral-200",
    bgCard: isDark ? "bg-neutral-950/90" : "bg-white/90",
    badgeBg: isDark ? "bg-neutral-900" : "bg-neutral-100",
    badgeText: isDark ? "text-neutral-300" : "text-neutral-700",
    divider: isDark ? "bg-neutral-700" : "bg-neutral-300",
    hoverBg: isDark ? "hover:bg-neutral-900" : "hover:bg-neutral-100",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.4 }}
      className="space-y-6 relative overflow-hidden"
    >
      <h2
        className={`text-2xl font-semibold flex items-center gap-2 ${colors.textPrimary}`}
      >
        Resume Insights
        <motion.div
          className={`h-px w-16 ${colors.divider}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </h2>

      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative"
      >
        {/* Glass morph effect with animated shimmer */}
        <div
          className={`absolute inset-0 ${colors.bgCard} backdrop-blur-sm rounded-2xl border ${colors.border} overflow-hidden`}
        >
          <motion.div
            className="absolute top-0 left-[-50%] w-[200%] h-full opacity-[0.05] bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{
              x: ["-50%", "50%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "linear",
            }}
          />
        </div>
        <HoverGradient
          gradientSize={300}
          fromColor={isDark ? "#262626" : "#D9D9D955"}
          toColor={isDark ? "#262626" : "#D9D9D955"}
          opacity={0.8}
        >
          <Card className="relative bg-transparent rounded-2xl p-6 z-10">
            <div className="space-y-6">
              {/* Extracted Skills */}
              <div className="space-y-3">
                <h3
                  className={`text-lg font-medium flex items-center gap-2 ${colors.textPrimary}`}
                >
                  <FileText className="h-5 w-5" />
                  Extracted Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.05 * index }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        variant="secondary"
                        className={`${colors.badgeBg} ${colors.badgeText} border ${colors.border}`}
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Suggested Improvements */}
              <div className="space-y-3">
                <h3
                  className={`text-lg font-medium flex items-center gap-2 ${colors.textPrimary}`}
                >
                  Suggested Improvements
                  <motion.div
                    className={`h-px w-10 ${colors.divider}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </h3>
                <div className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.05 * index,
                        ease: "easeOut",
                      }}
                      className="flex items-start space-x-2"
                    >
                      <motion.div
                        className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                          isDark ? "bg-neutral-400" : "bg-neutral-500"
                        }`}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      />
                      <p
                        className={`text-sm leading-relaxed ${colors.textSecondary}`}
                      >
                        {improvement}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <motion.div
                className={`pt-4 border-t ${colors.border}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  className={`${colors.textPrimary} ${colors.hoverBg} group`}
                >
                  <Link
                    href="/resume/analysis"
                    className="flex items-center gap-2"
                  >
                    View Full Resume Insights
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </Card>
        </HoverGradient>
      </motion.div>
    </motion.section>
  );
}
