"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock data for scores over time
const scoresData7Days = [
  { date: "Mon", score: 78 },
  { date: "Tue", score: 82 },
  { date: "Wed", score: 85 },
  { date: "Thu", score: 79 },
  { date: "Fri", score: 88 },
  { date: "Sat", score: 91 },
  { date: "Sun", score: 87 },
]

const scoresData30Days = [
  { date: "Week 1", score: 75 },
  { date: "Week 2", score: 82 },
  { date: "Week 3", score: 88 },
  { date: "Week 4", score: 87 },
]

// Mock data for strengths & weaknesses
const strengthsData = [
  { skill: "Communication", score: 92 },
  { skill: "Technical", score: 85 },
  { skill: "Problem-Solving", score: 78 },
  { skill: "Confidence", score: 88 },
]

export function PerformanceAnalytics() {
  const [timeRange, setTimeRange] = useState<"7days" | "30days">("7days")

  const scoresData = timeRange === "7days" ? scoresData7Days : scoresData30Days

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Performance Analytics</h2>

        {/* Time Range Filter */}
        <div className="flex bg-neutral-900 rounded-lg p-1">
          <Button
            variant={timeRange === "7days" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("7days")}
            className={`text-sm ${
              timeRange === "7days"
                ? "bg-white text-black hover:bg-white/90"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            Last 7 days
          </Button>
          <Button
            variant={timeRange === "30days" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("30days")}
            className={`text-sm ${
              timeRange === "30days"
                ? "bg-white text-black hover:bg-white/90"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            Last 30 days
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Scores Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Scores Over Time</h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoresData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis dataKey="date" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#ffffff"
                      strokeWidth={2}
                      dot={{ fill: "#ffffff", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#ffffff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Strengths & Weaknesses Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
        >
          <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Strengths & Weaknesses</h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strengthsData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis
                      type="number"
                      stroke="#a3a3a3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      stroke="#a3a3a3"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Bar dataKey="score" fill="#ffffff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
}
