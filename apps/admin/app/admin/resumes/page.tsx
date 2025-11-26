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
import { MoreHorizontal, Trash2, ExternalLink } from "lucide-react"
import { getResumes, getResumeDetails, deleteResume } from "@/actions/resume-actions"
import { toast } from "sonner"
import { format } from "date-fns"

// Shadcn Pagination
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination"

interface Resume {
  id: string
  user: string
  fileName: string
  analysisStatus: string
  qdrantStatus: string
  date: string
}

export default function ResumeManagementPage() {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending-analysis" | "error">("all")
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResume, setSelectedResume] = useState<string | null>(null)
  const [resumeDetails, setResumeDetails] = useState<any>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // PAGINATION
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const totalPages = Math.ceil(resumes.length / pageSize)

  useEffect(() => {
    loadResumes()
    setPage(1)
  }, [activeTab])

  async function loadResumes() {
    try {
      setLoading(true)
      const result = await getResumes(activeTab)
      if (result.success && result.resumes) {
        setResumes(result.resumes)
      } else {
        toast.error(result.error || "Failed to load resumes")
      }
    } catch (error) {
      console.error("Error loading resumes:", error)
      toast.error("Failed to load resumes")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (resumeId: string) => {
    setSelectedResume(resumeId)
    setDetailsOpen(true)
    setDetailsLoading(true)
    try {
      const result = await getResumeDetails(resumeId)
      if (result.success && result.resume) {
        setResumeDetails(result.resume)
      } else {
        toast.error(result.error || "Failed to load resume details")
        setDetailsOpen(false)
      }
    } catch (error) {
      console.error("Error loading resume details:", error)
      toast.error("Failed to load resume details")
      setDetailsOpen(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return

    try {
      const result = await deleteResume(resumeId)
      if (result.success) {
        toast.success("Resume deleted successfully")
        loadResumes()
      } else {
        toast.error(result.error || "Failed to delete resume")
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast.error("Failed to delete resume")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Indexed":
        return <Badge className="bg-primary">Success</Badge>
      case "Pending Analysis":
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Error":
      case "Failed":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // PAGINATION SLICING
  const paginatedData = resumes.slice((page - 1) * pageSize, page * pageSize)

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold">Resume Management</h1>
        <p className="text-muted-foreground mt-1">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resume Management</h1>
        <p className="text-muted-foreground mt-1">Track resume analysis and vector ingestion</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending-analysis">Pending</TabsTrigger>
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
                  <TableHead>Resume ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Analysis</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((resume) => (
                    <TableRow key={resume.id}>
                      <TableCell className="font-mono text-sm">{resume.id}</TableCell>
                      <TableCell className="text-muted-foreground">{resume.user}</TableCell>
                      <TableCell className="text-sm">{resume.fileName}</TableCell>
                      <TableCell>{getStatusBadge(resume.analysisStatus)}</TableCell>
                      <TableCell className="text-muted-foreground">{resume.date}</TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="border-0">
                            <DropdownMenuItem onClick={() => handleViewDetails(resume.id)}>
                              View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(resume.id)}
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
                      No resumes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* PAGINATION BAR */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && setPage(page - 1)}
                        className={page === 1 ? "opacity-50 pointer-events-none" : ""}
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
                        className={page === totalPages ? "opacity-50 pointer-events-none" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* DETAILS DIALOG */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Details</DialogTitle>
            <DialogDescription>Resume ID: {selectedResume}</DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : resumeDetails ? (
            <div className="space-y-6">
              {/* DETAILS INFO */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-base">{resumeDetails.user.name} ({resumeDetails.user.email})</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">File Name</p>
                  <p className="text-base">{resumeDetails.fileName}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Analysis Status</p>
                  <p className="text-base">{getStatusBadge(resumeDetails.AnalysisStatus)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Qdrant Status</p>
                  <p className="text-base">{getStatusBadge(resumeDetails.QdrantStatus)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created At</p>
                  <p className="text-base">
                    {format(new Date(resumeDetails.createdAt), "PPp")}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">File URL</p>
                  <a
                    href={resumeDetails.fileUrl}
                    target="_blank"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View File
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* ANALYSIS */}
              {resumeDetails.ResumeAnalysis && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Analysis Results</p>

                  <div className="p-4 border rounded space-y-3">
                    {resumeDetails.ResumeAnalysis.atsScore !== null && (
                      <p className="font-medium">ATS Score: {resumeDetails.ResumeAnalysis.atsScore}/100</p>
                    )}

                    {resumeDetails.ResumeAnalysis.analysis && (
                      <pre className="bg-muted p-3 rounded text-xs max-h-96 overflow-auto">
                        {JSON.stringify(resumeDetails.ResumeAnalysis.analysis, null, 2)}
                      </pre>
                    )}
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
