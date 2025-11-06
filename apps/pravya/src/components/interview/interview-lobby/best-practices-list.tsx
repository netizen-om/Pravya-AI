"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const bestPractices = [
  "Find a quiet, well-lit room to avoid distractions.",
  "Do not interrupt the AI interviewer. Wait for it to finish speaking before you respond.",
  "Speak clearly and at a natural pace. Treat this as a real interview.",
  "Wait for the audio visualizer to go flat before you reply. Good luck!",
]

export function BestPracticesList() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-neutral-900 dark:text-white">Best Practices</h3>
      <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
        {bestPractices.map((practice, index) => (
          <motion.li key={index} variants={itemVariants} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-neutral-700 dark:text-neutral-300">{practice}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
