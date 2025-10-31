"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AnswerQualityChartProps {
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

export default function AnswerQualityChart({ questions }: AnswerQualityChartProps) {
  const chartData = questions.slice(0, 5).map((q, idx) => ({
    name: `Q${idx + 1}`,
    relevance: q.specificFeedback.relevance.score,
    clarity: q.specificFeedback.clarity.score,
    depth: q.specificFeedback.depthAndExamples.score,
    structure: q.specificFeedback.structure.score,
  }))

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Answer Quality by Dimension</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-neutral-800" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} className="dark:fill-neutral-400" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: "#6b7280" }} className="dark:fill-neutral-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f3f4f6",
                  borderColor: "#d1d5db",
                  borderRadius: "8px",
                }}
                className="dark:bg-neutral-800 dark:border-neutral-700"
              />
              <Legend />
              <Bar dataKey="relevance" fill="#3b82f6" name="Relevance" radius={[8, 8, 0, 0]} />
              <Bar dataKey="clarity" fill="#10b981" name="Clarity" radius={[8, 8, 0, 0]} />
              <Bar dataKey="depth" fill="#f59e0b" name="Depth" radius={[8, 8, 0, 0]} />
              <Bar dataKey="structure" fill="#8b5cf6" name="Structure" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
