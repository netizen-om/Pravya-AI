"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface DashboardMetricsProps {
  metrics: {
    communication: { score: number; comment: string }
    technicalCommunication: { score: number; comment: string }
    hardSkills: { score: number; comment: string }
    problemSolving: { score: number; comment: string }
    softSkills: { score: number; comment: string }
    confidence: { score: number; comment: string }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

const metricLabels = {
  communication: "Communication",
  technicalCommunication: "Technical Communication",
  hardSkills: "Hard Skills",
  problemSolving: "Problem Solving",
  softSkills: "Soft Skills",
  confidence: "Confidence",
}

export default function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const radarData = [
    { name: "Communication", value: metrics.communication.score },
    { name: "Tech Comm", value: metrics.technicalCommunication.score },
    { name: "Hard Skills", value: metrics.hardSkills.score },
    { name: "Problem Solving", value: metrics.problemSolving.score },
    { name: "Soft Skills", value: metrics.softSkills.score },
    { name: "Confidence", value: metrics.confidence.score },
  ]

  const metricsArray = Object.entries(metrics).map(([key, value]) => ({
    key,
    label: metricLabels[key as keyof typeof metricLabels],
    ...value,
  }))

  return (
    <motion.div className="space-y-6" variants={itemVariants} initial="hidden" animate="visible">
      {/* Radar Chart */}
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" className="dark:stroke-neutral-800" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                className="dark:fill-neutral-400"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fill: "#6b7280" }}
                className="dark:fill-neutral-400"
              />
              <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {metricsArray.map((metric, idx) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-neutral-900 dark:text-white">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metric.score}</span>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">/ 10</span>
                </div>
                <Progress value={(metric.score / 10) * 100} className="h-2" />
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{metric.comment}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
