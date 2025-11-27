"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InterviewTemplateCard } from "../interview/interview-template-card";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { HoverGradient } from "../HoverGradient";
import type { SuggestedTemplate } from "@/actions/dashboard-action";

interface InterviewSuggestionsProps {
  isDark: boolean;
  data: SuggestedTemplate[];
}

export function InterviewSuggestions({ isDark, data }: InterviewSuggestionsProps) {
  const bgColor = "dark:bg-zinc-900/70";

  // Handle empty state
  if (!data || data.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2
            className={cn(
              "text-2xl font-semibold",
              isDark ? "text-white" : "text-gray-900"
            )}
          >
            Suggested Interviews
          </h2>
          <Link href={"/interview/templates"}>
            <Button
              variant="ghost"
              className={cn(
                isDark
                  ? "text-neutral-400 hover:text-neutral-400"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              View All
            </Button>
          </Link>
        </div>

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
            <div className="flex flex-col items-center justify-center py-12 text-center p-6">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                  isDark ? "bg-neutral-800" : "bg-gray-100"
                )}
              >
                <Sparkles
                  className={cn(
                    "h-6 w-6",
                    isDark ? "text-neutral-500" : "text-gray-400"
                  )}
                />
              </div>
              <p
                className={cn(
                  "text-sm font-medium mb-1",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                No templates available
              </p>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDark ? "text-neutral-400" : "text-gray-500"
                )}
              >
                Check back later for interview suggestions
              </p>
              <Link href="/interview/templates">
                <Button
                  className={cn(
                    isDark
                      ? "bg-neutral-800 text-white hover:bg-neutral-700"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  )}
                >
                  Browse Templates
                </Button>
              </Link>
            </div>
          </HoverGradient>
        </Card>
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
          Suggested Interviews
        </h2>
        <Link href={"/interview/templates"}>
          <Button
            variant="ghost"
            className={cn(
              isDark
                ? "text-neutral-400 hover:text-neutral-400"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            View All
          </Button>
        </Link>
      </div>

      {/* Flex container for cards */}
      <div className="flex flex-wrap gap-4 justify-start items-stretch">
        {data.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * index }}
            className="flex-grow sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.5rem)] flex"
          >
            <div className="flex flex-col w-full h-full rounded-2xl border-none p-6 transition-all duration-300">
              <InterviewTemplateCard
                isDark={isDark}
                template={suggestion}
                backgroundColor={bgColor}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
