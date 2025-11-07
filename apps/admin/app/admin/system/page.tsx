"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

const queueStatus = [
  { name: "Interview Feedback Queue", status: "Active", pending: 15, icon: Loader2 },
  { name: "Resume Analysis Queue", status: "Active", pending: 4, icon: CheckCircle },
  { name: "RAG Ingest Queue", status: "Active", pending: 2, icon: CheckCircle },
]

const failedJobs = [
  { interviewId: "INT-004", user: "maria.garcia@design.com", error: "Audio processing failed" },
  { interviewId: "INT-008", user: "unknown@user.com", error: "Timeout" },
]

const failedResumes = [
  { resumeId: "RES-001", user: "john.doe@company.com", error: "Unsupported file format" },
  { resumeId: "RES-042", user: "alex.johnson@tech.co", error: "OCR failure" },
]

export default function SystemHealthPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">System Health</h1>
        <p className="text-muted-foreground mt-1">Monitor queue status and system logs</p>
      </div>

      {/* Queue Status */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {queueStatus.map((queue, i) => {
          const Icon = queue.icon
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{queue.name}</p>
                      <p className="text-2xl font-bold mt-2">{queue.pending}</p>
                      <p className="text-xs text-muted-foreground mt-1">Pending Jobs</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon
                        className={`w-6 h-6 ${queue.status === "Active" ? "text-primary animate-spin" : "text-primary"}`}
                      />
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Active</Badge>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Error Logs */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Failed Interview Jobs</CardTitle>
            <CardDescription>Recent interview processing errors</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interview ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failedJobs.map((job, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">{job.interviewId}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{job.user}</TableCell>
                    <TableCell className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {job.error}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Failed Resume Jobs</CardTitle>
            <CardDescription>Recent resume processing errors</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resume ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failedResumes.map((resume, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">{resume.resumeId}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{resume.user}</TableCell>
                    <TableCell className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {resume.error}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
