"use client"

import { motion } from "framer-motion"
import { Play, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import type { Session } from "next-auth"

interface WelcomeSectionProps {
  session: Session
}

export function WelcomeSection({ session }: WelcomeSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome back, {session.user.name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-lg text-neutral-400">Ready to level up your interview game today?</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              asChild
              className="bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-105 transition-all duration-200 ring-1 ring-neutral-700 focus:ring-neutral-700"
            >
              <Link href="/interview/start" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Mock Interview
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-neutral-700 text-white hover:bg-neutral-900 hover:scale-105 transition-all duration-200 bg-transparent"
            >
              <Link href="/resume/upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.section>
  )
}
