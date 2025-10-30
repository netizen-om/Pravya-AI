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
}

export function InterviewTemplateCard({
  template,
  backgroundColor = "bg-zinc-900", // default color
}: InterviewTemplateCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Card
          className={cn(
            "h-full border-zinc-800 text-white hover:border-zinc-700 flex flex-col transition-colors",
            backgroundColor // apply dynamic background
          )}
          >
          <HoverGradient gradientSize={300} fromColor={isDark ? "#262626" : "#D9D9D955"} toColor={isDark ? "#262626" : "#D9D9D955"} opacity={0.8}>
          <CardHeader className="pb-2">
            <CardTitle
              title={template.title}
              className="text-lg font-semibold truncate cursor-default"
            >
              {template.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1">
            <CardDescription className="text-zinc-400 line-clamp-2 cursor-default">
              {template.description}
            </CardDescription>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 w-full">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 cursor-default"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-white text-zinc-950 hover:bg-zinc-100"
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
