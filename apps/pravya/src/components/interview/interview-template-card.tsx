"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartSessionDialog } from "./start-session-dialog";
import { cn } from "@/lib/utils"; // used for combining conditional classes
import { MagicCard } from "../ui/magic-card";
import { HoverGradient } from "../HoverGradient";
import { useHydrationSafeTheme } from "../hooks/useHydrationSafeTheme";

interface Template {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

interface InterviewTemplateCardProps {
  template: Template;
  backgroundColor?: string; // optional background color prop
  isDark: boolean;
}

export function InterviewTemplateCard({
  template,
  backgroundColor = "bg-zinc-900",
  isDark,
}: InterviewTemplateCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card
          className={cn(
            "h-full bg-white dark:border-zinc-800 dark:text-white dark:hover:border-zinc-700 flex flex-col transition-colors",
            backgroundColor// apply dynamic background
          )}
        >
          <HoverGradient
            gradientSize={300}
            fromColor={isDark ? "#262626" : "#D9D9D955"}
            toColor={isDark ? "#262626" : "#D9D9D955"}
            opacity={0.8}
          >
            <CardHeader className="pb-2">
              <CardTitle
                title={template.title}
                className="text-lg font-semibold truncate cursor-default"
              >
                {template.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1">
              <CardDescription className="dark:text-zinc-400 line-clamp-2 cursor-default">
                {template.description}
              </CardDescription>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 w-full">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-default"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                onClick={() => setIsDialogOpen(true)}
                className={cn(
                  "w-full",
                  isDark
                    ? "bg-white text-neutral-900 ring-neutral-700 focus:ring-neutral-700"
                    : "bg-neutral-900 text-white hover:text-white hover:opacity-80 hover:bg-neutral-900"
                )}
              >
                Start Session
              </Button>
            </CardFooter>
          </HoverGradient>
        </Card>
      </motion.div>

      <StartSessionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={template}
      />
    </>
  );
}
