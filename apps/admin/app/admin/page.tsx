"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Star, DollarSign, Mic } from "lucide-react"

const kpiData = [
  { label: "Total Users", value: "1,420", icon: Users, color: "text-accent" },
  { label: "Subscribed Users", value: "120", icon: Star, color: "text-primary" },
  { label: "Total Revenue", value: "$5,600", icon: DollarSign, color: "text-primary" },
  { label: "Interviews Done", value: "2,850", icon: Mic, color: "text-accent" },
]

const userGrowthData = [
  { date: "Day 1", users: 120 },
  { date: "Day 5", users: 290 },
  { date: "Day 10", users: 520 },
  { date: "Day 15", users: 680 },
  { date: "Day 20", users: 890 },
  { date: "Day 25", users: 1200 },
  { date: "Day 30", users: 1420 },
]

const revenueData = [
  { day: "Mon", revenue: 400 },
  { day: "Tue", revenue: 480 },
  { day: "Wed", revenue: 520 },
  { day: "Thu", revenue: 690 },
  { day: "Fri", revenue: 890 },
  { day: "Sat", revenue: 720 },
  { day: "Sun", revenue: 600 },
]

const latestSignups = [
  { email: "john.doe@company.com", joined: "2 hours ago" },
  { email: "jane.smith@startup.io", joined: "5 hours ago" },
  { email: "alex.johnson@tech.co", joined: "1 day ago" },
  { email: "maria.garcia@design.com", joined: "2 days ago" },
]

const failedJobs = [
  { resumeId: "RES-001", user: "john.doe@company.com", status: "Error" },
  { resumeId: "RES-042", user: "alex.johnson@tech.co", status: "Error" },
  { resumeId: "RES-085", user: "maria.garcia@design.com", status: "Error" },
]

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your platform overview.</p>
      </div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {kpiData.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    </div>
                    <div className={`p-3 bg-muted rounded-lg ${kpi.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>New Users (Last 30 Days)</CardTitle>
              <CardDescription>Total platform signups</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-primary)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Revenue (Last 7 Days)</CardTitle>
              <CardDescription>Daily revenue distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="revenue" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Live Feeds */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Latest Signups</CardTitle>
              <CardDescription>Recent user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestSignups.map((signup, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{signup.email}</TableCell>
                      <TableCell className="text-muted-foreground">{signup.joined}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Failed Jobs</CardTitle>
              <CardDescription>Recent processing errors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resume ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failedJobs.map((job, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{job.resumeId}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{job.user}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{job.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
