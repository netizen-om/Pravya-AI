"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { getInterviews, getInterviewDetails, deleteInterview } from "@/actions/interview-actions"
import { toast } from "sonner"
import { format } from "date-fns"

interface Interview {
  id: string
  user: string
  template: string
  status: string
  score: number | null
  date: string
}

export default function InterviewManagementPage() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending" | "error">("all")
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null)
  const [interviewDetails, setInterviewDetails] = useState<any>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    loadInterviews()
  }, [activeTab])

  async function loadInterviews() {
    try {
      setLoading(true)
      const result = await getInterviews(activeTab)
      if (result.success && result.interviews) {
        setInterviews(result.interviews)
      } else {
        toast.error(result.error || "Failed to load interviews")
      }
    } catch (error) {
      console.error("Error loading interviews:", error)
      toast.error("Failed to load interviews")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (interviewId: string) => {
    setSelectedInterview(interviewId)
    setDetailsOpen(true)
    setDetailsLoading(true)
    try {
      const result = await getInterviewDetails(interviewId)
      if (result.success && result.interview) {
        setInterviewDetails(result.interview)
      } else {
        toast.error(result.error || "Failed to load interview details")
        setDetailsOpen(false)
      }
    } catch (error) {
      console.error("Error loading interview details:", error)
      toast.error("Failed to load interview details")
      setDetailsOpen(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleDelete = async (interviewId: string) => {
    if (!confirm("Are you sure you want to delete this interview?")) {
      return
    }

    try {
      const result = await deleteInterview(interviewId)
      if (result.success) {
        toast.success("Interview deleted successfully")
        loadInterviews()
      } else {
        toast.error(result.error || "Failed to delete interview")
      }
    } catch (error) {
      console.error("Error deleting interview:", error)
      toast.error("Failed to delete interview")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-primary">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Interview Management</h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Interview Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage AI interviews</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="error">Error</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interview ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.length > 0 ? (
                  interviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-mono text-sm">{interview.id}</TableCell>
                      <TableCell className="text-muted-foreground">{interview.user}</TableCell>
                      <TableCell>{interview.template}</TableCell>
                      <TableCell>{getStatusBadge(interview.status)}</TableCell>
                      <TableCell>{interview.score ? interview.score.toFixed(1) : "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{interview.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-0">
                            <DropdownMenuItem onClick={() => handleViewDetails(interview.id)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(interview.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No interviews found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>
              Interview ID: {selectedInterview}
            </DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : interviewDetails ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-base">{interviewDetails.user.name || "N/A"} ({interviewDetails.user.email || "N/A"})</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Template</p>
                  <p className="text-base">{interviewDetails.template.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-base">{getStatusBadge(interviewDetails.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-base">
                    {interviewDetails.createdAt
                      ? format(new Date(interviewDetails.createdAt), "PPp")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="text-base">{interviewDetails.role || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Level</p>
                  <p className="text-base">{interviewDetails.level || "N/A"}</p>
                </div>
              </div>

              {interviewDetails.questions && interviewDetails.questions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Questions</p>
                  <div className="space-y-2">
                    {interviewDetails.questions.map((q: any, idx: number) => (
                      <div key={q.questionId} className="p-3 border rounded">
                        <p className="font-medium">Question {idx + 1}</p>
                        <p className="text-sm text-muted-foreground">{q.questionText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interviewDetails.feedback && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Feedback</p>
                  <div className="p-4 border rounded space-y-3">
                    <div>
                      <p className="font-medium">Overall Score: {interviewDetails.feedback.overallScore / 10}/10</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Summary</p>
                      <p className="text-sm text-muted-foreground">{interviewDetails.feedback.summary}</p>
                    </div>
                    {interviewDetails.feedback.keyStrengths && interviewDetails.feedback.keyStrengths.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Key Strengths</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {interviewDetails.feedback.keyStrengths.map((strength: string, idx: number) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {interviewDetails.feedback.improvementAreas && interviewDetails.feedback.improvementAreas.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Improvement Areas</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {interviewDetails.feedback.improvementAreas.map((area: string, idx: number) => (
                            <li key={idx}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-sm font-medium">Communication: {interviewDetails.feedback.communicationScore / 10}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Technical: {interviewDetails.feedback.technicalScore / 10}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Problem Solving: {interviewDetails.feedback.problemSolvingScore / 10}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Behavioral: {interviewDetails.feedback.behavioralScore / 10}/10</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Confidence: {interviewDetails.feedback.confidenceScore / 10}/10</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
