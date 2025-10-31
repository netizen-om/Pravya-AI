"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

interface OverallPerformanceProps {
  performance: {
    overallScore: number
    summary: string
    keyStrengths: string[]
    keyAreasForImprovement: string[]
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function OverallPerformance({ performance }: OverallPerformanceProps) {
  const chartData = [
    {
      name: "Score",
      value: performance.overallScore,
      fill: "#3b82f6",
    },
  ]

  return (
    <motion.div className="space-y-6" variants={itemVariants} initial="hidden" animate="visible">
      {/* Score Card */}
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-lg text-neutral-900 dark:text-white">Overall Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6">
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={chartData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} fill="#3b82f6" angleAxisId={0} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-500">{performance.overallScore}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">out of 100</p>
            </div>
          </div>

          <Alert className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-900 dark:text-blue-200">Summary</AlertTitle>
            <AlertDescription className="mt-2 text-sm text-blue-800 dark:text-blue-300">
              {performance.summary}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Strengths and Improvements */}
      <div className="space-y-4">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-neutral-900 dark:text-white">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              Key Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {performance.keyStrengths.map((strength, idx) => (
                <motion.li
                  key={idx}
                  className="flex gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-neutral-900 dark:text-white">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {performance.keyAreasForImprovement.map((area, idx) => (
                <motion.li
                  key={idx}
                  className="flex gap-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300">{area}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
