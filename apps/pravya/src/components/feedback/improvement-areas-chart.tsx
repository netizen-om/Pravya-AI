"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface ImprovementAreasChartProps {
  questions: Array<{
    questionText: string
    specificFeedback: {
      relevance: { score: number }
      clarity: { score: number }
      depthAndExamples: { score: number }
      structure: { score: number }
    }
  }>
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16"]

export default function ImprovementAreasChart({ questions }: ImprovementAreasChartProps) {
  // Calculate areas needing most improvement
  const improvements = {
    Relevance: 0,
    Clarity: 0,
    "Depth & Examples": 0,
    Structure: 0,
  }

  questions.forEach((q) => {
    improvements["Relevance"] += 10 - q.specificFeedback.relevance.score
    improvements["Clarity"] += 10 - q.specificFeedback.clarity.score
    improvements["Depth & Examples"] += 10 - q.specificFeedback.depthAndExamples.score
    improvements["Structure"] += 10 - q.specificFeedback.structure.score
  })

  const chartData = Object.entries(improvements)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Improvement Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toFixed(1)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-neutral-600 dark:text-neutral-400">
              Excellent performance across all dimensions!
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
