"use client"

import { motion } from "framer-motion"
import { BookOpen, Play, ArrowRight, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const resources = [
  {
    id: 1,
    title: "Top 10 System Design Interview Questions",
    type: "Article",
    duration: "8 min read",
    description: "Master the most common system design questions asked by top tech companies",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Answer Behavioral Questions with STAR",
    type: "Video",
    duration: "12 min watch",
    description: "Learn the STAR method to structure compelling behavioral interview responses",
    icon: Play,
  },
  {
    id: 3,
    title: "Coding Interview Patterns Guide",
    type: "Article",
    duration: "15 min read",
    description: "Essential patterns and techniques for solving coding interview problems",
    icon: BookOpen,
  },
]

export function LearningHubPreview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Learning Hub</h2>
        <Button asChild variant="ghost" className="text-neutral-400 hover:text-white group">
          <Link href="/learning" className="flex items-center gap-2">
            Go to Learning Hub
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 * index }}
          >
            <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:scale-[1.02] transition-all duration-200 group cursor-pointer">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
                    <resource.icon className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-neutral-900 text-neutral-300 border-neutral-700">
                    {resource.type}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-white leading-tight">{resource.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{resource.description}</p>
                </div>

                <div className="flex items-center text-xs text-neutral-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {resource.duration}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
