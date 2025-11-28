"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Star, DollarSign, Mic } from "lucide-react";
import {
  getDashboardMetrics,
  getUserGrowthData,
  getRevenueData,
  getLatestSignups,
  getFailedJobs,
} from "@/actions/dashboard-actions";
import { toast } from "sonner";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    subscribedUsers: 0,
    totalRevenue: 0,
    totalInterviews: 0,
  });
  const [userGrowthData, setUserGrowthData] = useState<
    { date: string; users: number }[]
  >([]);
  const [revenueData, setRevenueData] = useState<
    { day: string; revenue: number }[]
  >([]);
  const [latestSignups, setLatestSignups] = useState<
    { email: string; joined: string }[]
  >([]);
  const [failedJobs, setFailedJobs] = useState<
    { resumeId: string; user: string; status: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [metricsRes, growthRes, revenueRes, signupsRes, jobsRes] =
          await Promise.all([
            getDashboardMetrics(),
            getUserGrowthData(),
            getRevenueData(),
            getLatestSignups(),
            getFailedJobs(),
          ]);

        if (metricsRes.success) {
          setMetrics(metricsRes.metrics);
        }
        if (growthRes.success) {
          setUserGrowthData(growthRes.data);
        }
        if (revenueRes.success) {
          setRevenueData(revenueRes.data);
        }
        if (signupsRes.success) {
          setLatestSignups(signupsRes.signups?.slice(0, 5));
        }
        if (jobsRes.success) {
          setFailedJobs(jobsRes.failedJobs);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const kpiData = [
    {
      label: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-purple-500",
    },
    {
      label: "Subscribed Users",
      value: metrics.subscribedUsers.toLocaleString(),
      icon: Star,
      color: "text-blue-500",
    },
    {
      label: "Total Revenue",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "Interviews",
      value: metrics.totalInterviews.toLocaleString(),
      icon: Mic,
      color: "text-orange-500",
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your platform overview.
        </p>
      </div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {kpiData.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {kpi.label}
                      </p>
                      <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                    </div>
                    <div className={`p-3 bg-muted rounded-lg ${kpi.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-muted-foreground)"
                  />
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      color: "var(--foreground)",
                      boxShadow: "0px 10px 20px rgba(0,0,0,0.12)",
                    }}
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="var(--primary)"
                    radius={[6, 6, 0, 0]}
                    className="transition-all hover:opacity-80"
                  />
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
                  {latestSignups.length > 0 ? (
                    latestSignups.map((signup, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {signup.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {signup.joined}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground"
                      >
                        No recent signups
                      </TableCell>
                    </TableRow>
                  )}
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
                  {failedJobs.length > 0 ? (
                    failedJobs.map((job, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-sm">
                          {job.resumeId}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {job.user}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{job.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No failed jobs
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
