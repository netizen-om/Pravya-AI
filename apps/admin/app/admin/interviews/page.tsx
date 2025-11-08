"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const interviews = [
  {
    id: "INT-001",
    user: "john.doe@company.com",
    template: "Senior Dev",
    status: "Completed",
    score: 8.5,
    date: "Dec 5, 2024",
  },
  {
    id: "INT-002",
    user: "jane.smith@startup.io",
    template: "Product Manager",
    status: "Pending",
    score: null,
    date: "Dec 4, 2024",
  },
  {
    id: "INT-003",
    user: "alex.johnson@tech.co",
    template: "Data Scientist",
    status: "Completed",
    score: 7.2,
    date: "Dec 3, 2024",
  },
  {
    id: "INT-004",
    user: "maria.garcia@design.com",
    template: "UX Designer",
    status: "Error",
    score: null,
    date: "Dec 2, 2024",
  },
]

export default function InterviewManagementPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredInterviews = interviews.filter((interview) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return interview.status === "Completed"
    if (activeTab === "pending") return interview.status === "Pending"
    if (activeTab === "error") return interview.status === "Error"
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-primary">Completed</Badge>
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Interview Management</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage AI interviews</p>
      </div>

      <motion.div initforegroundial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                {filteredInterviews.map((interview) => (
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
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
