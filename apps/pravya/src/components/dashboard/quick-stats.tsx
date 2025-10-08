"use client"

import { motion } from "framer-motion"
import { TrendingUp, Target, FileText, Flame } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const stats = [
  {
    title: "Interviews Taken",
    value: "23",
    icon: Target,
    description: "This month",
  },
  {
    title: "Average Score",
    value: "87%",
    icon: TrendingUp,
    description: "Last 10 interviews",
  },
  {
    title: "Last Resume",
    value: "resume_v2.pdf",
    icon: FileText,
    description: "Uploaded 2 days ago",
    href: "/resume/analysis",
  },
  {
    title: "Streak",
    value: "3 days",
    icon: Flame,
    description: "Practiced in a row",
  },
]

export function QuickStats() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white">Quick Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * index }}
          >
            <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-200 group">
              {stat.href ? (
                <Link href={stat.href} className="block">
                  <StatContent stat={stat} />
                </Link>
              ) : (
                <StatContent stat={stat} />
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

function StatContent({ stat }: { stat: (typeof stats)[0] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <stat.icon className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" />
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{stat.value}</div>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-white">{stat.title}</h3>
        <p className="text-sm text-neutral-400">{stat.description}</p>
      </div>
    </div>
  )
}
