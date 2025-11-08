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
import { MoreHorizontal, Trash2, Download, ExternalLink } from "lucide-react"
import { getResumes, getResumeDetails, deleteResume } from "@/actions/resume-actions"
import { toast } from "sonner"
import { format } from "date-fns"

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

  useEffect(() => {
    loadResumes()
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
    if (!confirm("Are you sure you want to delete this resume?")) {
      return
    }

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

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Resume Management</h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resume ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Analysis</TableHead>
                  <TableHead>Vector DB</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes.length > 0 ? (
                  resumes.map((resume) => (
                    <TableRow key={resume.id}>
                      <TableCell className="font-mono text-sm">{resume.id}</TableCell>
                      <TableCell className="text-muted-foreground">{resume.user}</TableCell>
                      <TableCell className="text-sm">{resume.fileName}</TableCell>
                      <TableCell>{getStatusBadge(resume.analysisStatus)}</TableCell>
                      <TableCell>{getStatusBadge(resume.qdrantStatus)}</TableCell>
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
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Resume Details</DialogTitle>
            <DialogDescription>
              Resume ID: {selectedResume}
            </DialogDescription>
          </DialogHeader>
          {detailsLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : resumeDetails ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-base">{resumeDetails.user.name || "N/A"} ({resumeDetails.user.email || "N/A"})</p>
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
                    {resumeDetails.createdAt
                      ? format(new Date(resumeDetails.createdAt), "PPp")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">File URL</p>
                  <a
                    href={resumeDetails.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View File
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {resumeDetails.ResumeAnalysis && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Analysis Results</p>
                  <div className="p-4 border rounded space-y-3">
                    {resumeDetails.ResumeAnalysis.atsScore !== null && (
                      <div>
                        <p className="font-medium">ATS Score: {resumeDetails.ResumeAnalysis.atsScore}/100</p>
                      </div>
                    )}
                    {resumeDetails.ResumeAnalysis.analysis && (
                      <div>
                        <p className="text-sm font-medium mb-1">Analysis Data</p>
                        <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
                          {JSON.stringify(resumeDetails.ResumeAnalysis.analysis, null, 2)}
                        </pre>
                      </div>
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
