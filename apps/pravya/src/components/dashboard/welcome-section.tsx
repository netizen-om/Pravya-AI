"use client";

import { motion } from "framer-motion";
import { Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import type { Session } from "next-auth";
// Use relative path to avoid alias resolution issues
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useState, useEffect } from "react"; // Import hooks

interface WelcomeSectionProps {
  session: Session;
}

export function WelcomeSection({ session }: WelcomeSectionProps) {
  const [isMounted, setIsMounted] = useState(false); // Track mount state
  
  // When component mounts on client, set isMounted to true
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Render a placeholder/skeleton on the server and initial client render
  // This prevents the hydration mismatch and CLS (layout shift)
  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6"
      >
        <Card className="bg-transparent border-none shadow-none p-0">
          <div
            className={cn(
              "rounded-2xl border p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300",
              "bg-neutral-900/70 border-neutral-800" // Default to dark skeleton
            )}
            style={{ minHeight: "230px" }} // Reserve space
          />
        </Card>
      </motion.section>
    );
  }

  // Once mounted, render the full, correctly-themed component
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card className="bg-transparent border-none shadow-none p-0">
        <MagicCard
          gradientColor={isDark ? "#262626" : "#D9D9D955"}
          className={cn(
            "rounded-2xl border p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-300",
            isDark
              ? "bg-neutral-900/70 border-neutral-800"
              : "bg-white/70 border-gray-200 backdrop-blur-md"
          )}
        >
          <div className="text-center space-y-6">
            {/* ====== Welcome text ====== */}
            <div className="space-y-2">
              <h1
                className={cn(
                  "text-3xl md:text-4xl font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                Welcome back, {session.user.name?.split(" ")[0] || "there"} 👋
              </h1>
              <p
                className={cn(
                  "text-lg",
                  isDark ? "text-neutral-400" : "text-gray-600"
                )}
              >
                Ready to level up your interview game today?
              </p>
            </div>

            {/* ====== Buttons ====== */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              {/* Start Mock Interview */}
              <Button
                asChild
                className={cn(
                  "hover:scale-105 transition-all duration-200 ring-1 focus:ring-1",
                  isDark
                    ? "bg-neutral-900 text-white hover:bg-neutral-800 ring-neutral-700 focus:ring-neutral-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200 ring-gray-300 focus:ring-gray-400"
                )}
              >
                <Link
                  href="/interview/start"
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Mock Interview
                </Link>
              </Button>

              {/* Upload Resume */}
              <Button
                asChild
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all duration-200",
                  isDark
                    ? "border-neutral-700 text-white hover:bg-neutral-900"
                    : "border-gray-300 text-gray-900 hover:bg-gray-100"
                )}
              >
                <Link href="/resume/upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Resume
                </Link>
              </Button>
            </div>
          </div>
        </MagicCard>
      </Card>
    </motion.section>
  );
}

