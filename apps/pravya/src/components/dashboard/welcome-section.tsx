"use client";

import { motion } from "framer-motion";
import { Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import type { Session } from "next-auth";
import { MagicCard } from "@/components/ui/magic-card";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface WelcomeSectionProps {
  session: Session;
}

export function WelcomeSection({ session }: WelcomeSectionProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!isMounted) {
    return (
      <Card className="bg-transparent border-none shadow-none p-0">
        <div
          className={cn(
            "rounded-2xl border p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
            "bg-neutral-900/70 border-neutral-800"
          )}
          style={{ minHeight: "230px" }}
        />
      </Card>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative space-y-6"
    >
      {/* === Floating Gradient Glow === */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className={cn(
            "absolute w-72 h-72 rounded-full blur-[120px]",
            isDark ? "bg-neutral-800" : "bg-gray-300"
          )}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, 20, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={cn(
            "absolute w-64 h-64 rounded-full blur-[100px] right-0 top-0",
            isDark ? "bg-neutral-700" : "bg-gray-200"
          )}
          animate={{
            x: [0, -20, 30, 0],
            y: [0, -10, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* === Main Magic Card === */}
      <Card className="bg-transparent border-none shadow-none p-0">
        <motion.div
          whileHover={{ y: -2, rotateX: 2, rotateY: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <MagicCard
            gradientColor={isDark ? "#262626" : "#D9D9D955"}
            className={cn(
              "rounded-2xl border p-8 backdrop-blur-md transition-all duration-300",
              isDark
                ? "bg-neutral-900/70 border-neutral-800"
                : "bg-white/70 border-gray-200"
            )}
          >
            <div className="text-center space-y-6">
              {/* ====== Animated Welcome text ====== */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <h1
                  className={cn(
                    "text-3xl md:text-4xl font-bold tracking-tight",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  Welcome back, {session.user.name?.split(" ")[0] || "there"} 👋
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "text-lg",
                    isDark ? "text-neutral-400" : "text-gray-600"
                  )}
                >
                  Ready to level up your interview game today?
                </motion.p>
              </motion.div>

              {/* ====== Buttons with slight delay animation ====== */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button
                  asChild
                  className={cn(
                    "hover:scale-[1.03] transition-all duration-200 ring-1 focus:ring-1",
                    isDark
                      ? "bg-neutral-900 text-white hover:bg-neutral-800 ring-neutral-700 focus:ring-neutral-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200 ring-gray-300 focus:ring-gray-400"
                  )}
                >
                  <Link href="/interview/start" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Mock Interview
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    "hover:scale-[1.03] transition-all duration-200",
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
              </motion.div>
            </div>
          </MagicCard>
        </motion.div>
      </Card>
    </motion.section>
  );
}
