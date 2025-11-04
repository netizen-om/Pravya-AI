"use client"

import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InterviewHistoryTabs() {
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

        {/* Completed Tab */}
        <TabsContent value="completed">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Card 1 */}
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>Senior React Developer</CardTitle>
                <CardDescription>Completed: Oct 26, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-900 dark:text-neutral-200">
                  Overall Score: <span className="text-emerald-500 font-semibold">88/100</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button className="dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white">View Full Report</Button>
              </CardFooter>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>Behavioral Interview</CardTitle>
                <CardDescription>Completed: Oct 24, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-900 dark:text-neutral-200">
                  Overall Score: <span className="text-emerald-500 font-semibold">76/100</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button className="dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white">View Full Report</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>No Pending Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-500 dark:text-neutral-400">
                  You have no scheduled interviews. Start a new one from a template or use your resume!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Incomplete Tab */}
        <TabsContent value="incomplete">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
              <CardHeader>
                <CardTitle>System Design Basics</CardTitle>
                <CardDescription>Last activity: 2 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-500 dark:text-neutral-400">
                  You left this interview halfway. Resume to continue where you left off.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary">Resume Interview</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
