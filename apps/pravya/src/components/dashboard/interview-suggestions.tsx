"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { InterviewTemplateCard } from "../interview/interview-template-card";
import { MagicCard } from "../ui/magic-card";
import { useHydrationSafeTheme } from "../hooks/useHydrationSafeTheme";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

const suggestions = [
  {
    id: "1",
    title: "System Design Deep Dive",
    description:
      "Practice designing scalable systems with real-world scenarios",
    tags: ["architecture", "scalability", "backend"],
  },
  {
    id: "2",
    title: "Behavioral Practice",
    description: "Master the STAR method with common behavioral questions",
    tags: ["communication", "soft-skills", "self-awareness"],
  },
  {
    id: "3",
    title: "DSA Drill",
    description: "Sharpen your data structures and algorithms skills",
    tags: ["algorithms", "problem-solving", "data-structures"],
  },
  {
    id: "4",
    title: "Leadership Scenarios",
    description: "Practice leadership and management interview questions",
    tags: ["management", "decision-making", "teamwork"],
  },
  {
    id: "5",
    title: "Quick Fire Round",
    description: "Rapid-fire technical questions to test your knowledge",
    tags: ["technical", "rapid", "assessment"],
  },
  {
    id: "6",
    title: "Mock Panel Interview",
    description: "Simulate a real panel interview experience",
    tags: ["simulation", "realistic", "multi-interviewer"],
  },
];

export function InterviewSuggestions() {
  const { theme, isMounted } = useHydrationSafeTheme();

  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
        className="space-y-6"
      >
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 rounded-lg bg-neutral-800 animate-pulse" />
          <div className="flex rounded-lg p-1 bg-neutral-900">
            <div className="h-8 w-24 rounded-md bg-neutral-800" />
            <div className="h-8 w-24 rounded-md" />
          </div>
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[348px] animate-pulse" />
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[348px] animate-pulse" />
        </div>
      </motion.section>
    );
  }

  const isDark = theme === "dark";
  const textColor = theme === "light" ? "text-neutral-900" : "text-white";
  const subTextColor =
    theme === "light" ? "text-neutral-600" : "text-neutral-400";
  const bgColor = theme === "light" ? "bg-neutral-100" : "bg-zinc-950";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-semibold ${textColor}`}>
          Suggested Interviews
        </h2>
        <Button
          variant="ghost"
          className={`${subTextColor} hover:${textColor}`}
        >
          View All
        </Button>
      </div>

      {/* Flex container for cards */}
      <div className="flex flex-wrap gap-4 justify-start items-stretch">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * index }}
            className="flex-grow sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.5rem)] flex"
          >
            <div className="flex flex-col w-full h-full">
              <MagicCard
                gradientColor={isDark ? "#262626" : "#D9D9D955"}
                className={cn(
                  "rounded-2xl border-none p-6 transition-all duration-300",
                  isDark
                    ? "bg-neutral-900/70 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                    : "bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-md"
                )}
              >
              <InterviewTemplateCard
                template={suggestion}
                backgroundColor={bgColor}
              />
            </MagicCard>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
