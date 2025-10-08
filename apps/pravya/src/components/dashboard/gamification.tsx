"use client"

import { motion } from "framer-motion"
import { Trophy, Target, Zap, Star, Award, Medal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const badges = [
  { id: 1, name: "First Interview", icon: Target, earned: true },
  { id: 2, name: "Week Streak", icon: Zap, earned: true },
  { id: 3, name: "High Scorer", icon: Trophy, earned: true },
  { id: 4, name: "System Design Pro", icon: Award, earned: false },
  { id: 5, name: "Coding Master", icon: Medal, earned: false },
  { id: 6, name: "Interview Legend", icon: Star, earned: false },
]

const milestones = [
  { name: "Complete 50 interviews", current: 23, target: 50 },
  { name: "Achieve 90% average score", current: 87, target: 90 },
  { name: "Practice 30 days in a row", current: 3, target: 30 },
]

export function Gamification() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white">Achievements</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges */}
        <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Badges Earned</h3>

            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 * index }}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 ${
                    badge.earned ? "bg-neutral-900 hover:bg-neutral-800" : "bg-neutral-950 opacity-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      badge.earned ? "bg-white text-black" : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    <badge.icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs text-center ${badge.earned ? "text-white" : "text-neutral-500"}`}>
                    {badge.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Progress Milestones */}
        <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Next Milestones</h3>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 * index }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{milestone.name}</span>
                    <span className="text-xs text-neutral-400">
                      {milestone.current}/{milestone.target}
                    </span>
                  </div>
                  <Progress value={(milestone.current / milestone.target) * 100} className="h-2 bg-neutral-800" />
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </motion.section>
  )
}
