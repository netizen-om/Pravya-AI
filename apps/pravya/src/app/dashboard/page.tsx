import type React from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { WelcomeSection } from "@/components/dashboard/welcome-section"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PerformanceAnalytics } from "@/components/dashboard/performance-analytics"
import { InterviewSuggestions } from "@/components/dashboard/interview-suggestions"
import { ResumeInsights } from "@/components/dashboard/resume-insights"
// import { LearningHubPreview } from "@/components/dashboard/learning-hub-preview"
import { Gamification } from "@/components/dashboard/gamification"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Dashboard from "@/components/dashboard/Old-Dashboard"
import {DashboardClient} from "@/components/new-dashboard/Dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    <>
      <DashboardClient session={session} />
    </>
  )
}
