"use client"

import { motion } from "framer-motion"
import { CheckCircle, FileText, BarChart3, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

const activities = [
  {
    id: 1,
    type: "interview",
    title: "Completed Mock Interview",
    description: "System Design #23",
    timestamp: "2 hours ago",
    icon: CheckCircle,
  },
  {
    id: 2,
    type: "resume",
    title: "Resume uploaded",
    description: "resume_om.pdf",
    timestamp: "1 day ago",
    icon: FileText,
  },
  {
    id: 3,
    type: "analytics",
    title: "Analytics report generated",
    description: "Performance insights updated",
    timestamp: "2 days ago",
    icon: BarChart3,
  },
  {
    id: 4,
    type: "interview",
    title: "Completed Mock Interview",
    description: "Behavioral Practice #12",
    timestamp: "3 days ago",
    icon: CheckCircle,
  },
]

export function RecentActivity() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>

      <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6">
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 * index }}
              className="flex items-start space-x-4"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <div className="flex items-center text-xs text-neutral-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
                <p className="text-sm text-neutral-400 mt-1">{activity.description}</p>
              </div>

              {index < activities.length - 1 && <div className="absolute left-10 mt-8 w-px h-6 bg-neutral-800" />}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.section>
  )
}
