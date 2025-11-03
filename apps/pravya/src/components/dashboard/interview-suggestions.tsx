"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InterviewTemplateCard } from "../interview/interview-template-card";
import Link from "next/link";

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

interface InterviewSuggestionsProps {
  isDark : boolean
}

export function InterviewSuggestions({ isDark } : InterviewSuggestionsProps) {
  
  const bgColor = "dark:bg-zinc-900/70";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-semibold text-white`}>
          Suggested Interviews
        </h2>
        <Link href={"/interview/templates"}>
        <Button
          variant="ghost"
          className={`text-neutral-400 hover:text-neutral-400`}
        >
          View All
        </Button>
        </Link>
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
