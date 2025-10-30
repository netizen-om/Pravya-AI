"use client"; // This component runs in the browser

import { SidebarProvider } from "../dashboard/sidebar-context";
// import { DashboardHeader } from "../dashboard/dashboard-header"; // Uncomment if you use it
import { WelcomeSection } from "../dashboard/welcome-section";
import { QuickStats } from "../dashboard/quick-stats";
import { RecentActivity } from "../dashboard/recent-activity";
import { PerformanceAnalytics } from "../dashboard/performance-analytics";
import { InterviewSuggestions } from "../dashboard/interview-suggestions";
import { ResumeInsights } from "../dashboard/resume-insights";
import dynamic from "next/dynamic";
import { getServerSession, Session } from "next-auth"; // Import the Session type
import {TodaysTip} from "../dashboard/today-tip";
import { DashboardFooter } from "../dashboard/Dashboard-footer";
import { authOptions } from "@repo/auth";
import { redirect } from "next/navigation";
import React from "react";

// Dynamically import the sidebar (client-side)
const DashboardSidebar = dynamic(
  () =>
    import("../dashboard/dashboard-sidebar").then(
      (mod) => mod.DashboardSidebar
    ),
  { ssr: false }
);

// Define the props interface
interface DashboardClientProps {
  session: Session;
}

// This is your Client Component. It is NOT async.
export const DashboardClient: React.FC<DashboardClientProps> = async() => {

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
     <div className="min-h-screen w-full bg-neutral-950 text-white"> 
        <SidebarProvider>
        {/* <DashboardHeader session={session} /> */}
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 transition-all duration-300 ease-in-out">
            <div className="mx-auto max-w-7xl px-6 md:px-8 py-8 space-y-10">
              <WelcomeSection session={session} />
              <QuickStats />
              <PerformanceAnalytics />
              <TodaysTip />
              <RecentActivity />
              <InterviewSuggestions />
              <ResumeInsights />
              <DashboardFooter />
              </div>
          </main>
        </div>
      </SidebarProvider>
     </div>
  )
}

