"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Brain, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PersonalisedInterviewDialog } from "./personalised-interview-dialog"

export function PageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8"
    >
      {/* Left Side - Branding & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-neutral-800 dark:bg-neutral-200 rounded-lg">
          <Brain className="w-6 h-6 text-white dark:text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Pravya AI Interviews</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Review past sessions or start a new one.</p>
        </div>
      </div>

      {/* Right Side - CTAs */}
      <div className="flex gap-3">
        <Link href="/interview/templates">
          <Button variant="outline" className="gap-2 bg-transparent">
            <LayoutGrid className="w-4 h-4" />
            Browse Templates
          </Button>
        </Link>
        <PersonalisedInterviewDialog />
      </div>
    </motion.div>
  )
}
