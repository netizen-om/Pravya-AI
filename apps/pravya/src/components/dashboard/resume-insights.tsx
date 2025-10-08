"use client"

import { motion } from "framer-motion"
import { FileText, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const skills = ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "MongoDB", "GraphQL"]

const improvements = [
  "Add more quantifiable achievements to demonstrate impact",
  "Include specific technologies used in each project",
  "Strengthen the summary section with key accomplishments",
]

export function ResumeInsights() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.4 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white">Resume Insights</h2>

      <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6">
        <div className="space-y-6">
          {/* Extracted Skills */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Extracted Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                >
                  <Badge variant="secondary" className="bg-neutral-900 text-neutral-300 border-neutral-700">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggested Improvements */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-white">Suggested Improvements</h3>
            <div className="space-y-2">
              {improvements.map((improvement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 * index }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-neutral-400 leading-relaxed">{improvement}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-neutral-800">
            <Button asChild variant="ghost" className="text-white hover:bg-neutral-900 group">
              <Link href="/resume/analysis" className="flex items-center gap-2">
                View Full Resume Insights
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.section>
  )
}
