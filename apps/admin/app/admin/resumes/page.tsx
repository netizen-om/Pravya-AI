"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download } from "lucide-react"

const resumes = [
  {
    id: "RES-001",
    user: "john.doe@company.com",
    fileName: "john_doe_resume.pdf",
    analysisStatus: "Completed",
    qdrantStatus: "Indexed",
    date: "Dec 5, 2024",
  },
  {
    id: "RES-002",
    user: "jane.smith@startup.io",
    fileName: "jane_smith_cv.pdf",
    analysisStatus: "Pending Analysis",
    qdrantStatus: "Pending",
    date: "Dec 4, 2024",
  },
  {
    id: "RES-003",
    user: "alex.johnson@tech.co",
    fileName: "alex_resume.pdf",
    analysisStatus: "Completed",
    qdrantStatus: "Indexed",
    date: "Dec 3, 2024",
  },
  {
    id: "RES-004",
    user: "maria.garcia@design.com",
    fileName: "maria_portfolio.pdf",
    analysisStatus: "Error",
    qdrantStatus: "Failed",
    date: "Dec 2, 2024",
  },
]

export default function ResumeManagementPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredResumes = resumes.filter((resume) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return resume.analysisStatus === "Completed"
    if (activeTab === "pending-analysis") return resume.analysisStatus === "Pending Analysis"
    if (activeTab === "error") return resume.analysisStatus === "Error"
    return true
  })

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

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resume Management</h1>
        <p className="text-muted-foreground mt-1">Track resume analysis and vector ingestion</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                {filteredResumes.map((resume) => (
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download File
                          </DropdownMenuItem>
                          <DropdownMenuItem>Re-process Analysis</DropdownMenuItem>
                          <DropdownMenuItem>Re-ingest to Vector DB</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
