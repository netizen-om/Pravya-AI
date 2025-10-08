"use client"

import { motion } from "framer-motion"
import { Play, Code, MessageSquare, Zap, Users, Database } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const suggestions = [
  {
    id: 1,
    title: "System Design Deep Dive",
    description: "Practice designing scalable systems with real-world scenarios",
    icon: Database,
    mode: "system-design",
  },
  {
    id: 2,
    title: "Behavioral Practice",
    description: "Master the STAR method with common behavioral questions",
    icon: MessageSquare,
    mode: "behavioral",
  },
  {
    id: 3,
    title: "DSA Drill",
    description: "Sharpen your data structures and algorithms skills",
    icon: Code,
    mode: "coding",
  },
  {
    id: 4,
    title: "Leadership Scenarios",
    description: "Practice leadership and management interview questions",
    icon: Users,
    mode: "leadership",
  },
  {
    id: 5,
    title: "Quick Fire Round",
    description: "Rapid-fire technical questions to test your knowledge",
    icon: Zap,
    mode: "quick-fire",
  },
  {
    id: 6,
    title: "Mock Panel Interview",
    description: "Simulate a real panel interview experience",
    icon: Users,
    mode: "panel",
  },
]

export function InterviewSuggestions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Suggested Interviews</h2>
        <Button variant="ghost" className="text-neutral-400 hover:text-white">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * index }}
          >
            <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:scale-[1.02] transition-all duration-200 group">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
                    <suggestion.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{suggestion.title}</h3>
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed">{suggestion.description}</p>

                <Button asChild className="w-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
                  <Link href={`/interview/start?mode=${suggestion.mode}`} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
