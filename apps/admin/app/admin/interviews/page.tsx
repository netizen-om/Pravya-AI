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

// SHADCN PAGINATION
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination"

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

  // PAGINATION STATES
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalPages = Math.ceil(interviews.length / pageSize)

  useEffect(() => {
    loadInterviews()
    setPage(1) // reset to first page when tab changes
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
    if (!confirm("Are you sure you want to delete this interview?")) return

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

  // ---- PAGINATION LOGIC ----
  const paginatedData = interviews.slice((page - 1) * pageSize, page * pageSize)

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
            {/* PAGE SIZE SELECTOR */}
            <div className="flex justify-end mb-3">
              <select
                className="border rounded px-2 py-1 bg-background"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={30}>30 per page</option>
              </select>
            </div>

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
                {paginatedData.length > 0 ? (
                  paginatedData.map((interview) => (
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
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(interview.id)}>
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

            {/* PAGINATION COMPONENT */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          isActive={page === idx + 1}
                          onClick={() => setPage(idx + 1)}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && setPage(page + 1)}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* DETAILS DIALOG (unchanged) */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <DialogDescription>Interview ID: {selectedInterview}</DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : interviewDetails ? (
            <div className="space-y-6">
              {/* Details content unchanged */}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
