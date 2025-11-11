"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InterviewHistoryCard } from "./interview-history-card"

type Item = {
  id: string
  title: string
  tags: string[]
  score?: number | null
  status: "COMPLETED" | "PENDING" | "INCOMPLETE"
  feedbackId?: string | null
}

export function InterviewHistoryTabs() {
  const [isLoading, setIsLoading] = useState(true)
  const [completed, setCompleted] = useState<Item[]>([])
  const [pending, setPending] = useState<Item[]>([])
  const [incomplete, setIncomplete] = useState<Item[]>([])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setIsLoading(true)

        // ✅ FIXED FETCH STRING
        const res = await fetch("/api/interviews/list", { cache: "no-store" })
        const json = await res.json()

        if (!active) return
        if (json?.success) {
          setCompleted(json.data.completed || [])
          setPending(json.data.pending || [])
          setIncomplete(json.data.incomplete || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Tabs defaultValue="completed" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Completed</span>
          </TabsTrigger>

          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Pending</span>
          </TabsTrigger>

          <TabsTrigger value="incomplete" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Incomplete</span>
          </TabsTrigger>
        </TabsList>

        {/* COMPLETED TAB */}
        <TabsContent value="completed">
          {isLoading ? (
            <div className="text-sm text-neutral-500">Loading...</div>
          ) : completed.length === 0 ? (
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>No completed interviews</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-500 dark:text-neutral-400">
                Run an interview and view the full feedback here.
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {completed.map((item) => (
                <InterviewHistoryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  tags={item.tags}
                  score={item.score}
                  status={item.status}
                  feedbackId={item.feedbackId}
                />
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* PENDING TAB */}
        <TabsContent value="pending">
          {isLoading ? (
            <div className="text-sm text-neutral-500">Loading...</div>
          ) : pending.length === 0 ? (
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>No pending interviews</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-500 dark:text-neutral-400">
                You have no scheduled interviews. Start a new one from a template or use your resume.
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {pending.map((item) => (
                <InterviewHistoryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  tags={item.tags}
                  score={item.score}
                  status={item.status}
                  feedbackId={item.feedbackId}
                />
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* INCOMPLETE TAB */}
        <TabsContent value="incomplete">
          {isLoading ? (
            <div className="text-sm text-neutral-500">Loading...</div>
          ) : incomplete.length === 0 ? (
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>No incomplete interviews</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-500 dark:text-neutral-400">
                Great! You don't have any incomplete interviews.
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {incomplete.map((item) => (
                <InterviewHistoryCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  tags={item.tags}
                  score={item.score}
                  status={item.status}
                  feedbackId={item.feedbackId}
                  disableFeedback
                />
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
