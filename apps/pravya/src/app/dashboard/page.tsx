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
import NewDashboard from "@/components/new-dashboard/Dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/auth/sign-in")
  }

  return (
    // <SidebarProvider>
    //   <div
    //     className="min-h-screen w-full absolute bg-black text-white"
        
    //     style={
    //       {
    //         //  background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%), linear-gradient(120deg, #0f0e17 0%, #1a1b26 100%)",
    //         // "--background": "0 0% 0%",
    //         // backgroundImage: `
    //         // radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 60%),
    //         // radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 70%),
    //         // radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 80%)`,
    //         // background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
    //          background: `
    //       radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
    //       radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
    //       radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
    //       radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
    //       #000000
    //     `,

    //         "--foreground": "0 0% 100%",
    //         "--card": "0 0% 7%",
    //         "--card-foreground": "0 0% 100%",
    //         "--popover": "0 0% 7%",
    //         "--popover-foreground": "0 0% 100%",
    //         "--primary": "0 0% 100%",
    //         "--primary-foreground": "0 0% 0%",
    //         "--secondary": "0 0% 9%",
    //         "--secondary-foreground": "0 0% 100%",
    //         "--muted": "0 0% 9%",
    //         "--muted-foreground": "0 0% 60%",
    //         "--accent": "0 0% 9%",
    //         "--accent-foreground": "0 0% 100%",
    //         "--destructive": "0 62.8% 30.6%",
    //         "--destructive-foreground": "0 0% 100%",
    //         "--border": "0 0% 20%",
    //         "--input": "0 0% 20%",
    //         "--ring": "0 0% 100%",
    //         "--radius": "0.5rem",
    //       } as React.CSSProperties
    //     }
    //   >
        
    //     <DashboardHeader session={session} />
    //     <div className="flex">
          // <DashboardSidebar />
          // <main className="flex-1 transition-all duration-300 ease-in-out">
          //   <div className="mx-auto max-w-7xl px-6 md:px-8 py-8 space-y-10">
          //     <WelcomeSection session={session} />
          //     <QuickStats />
          //     <RecentActivity />
          //     <PerformanceAnalytics />
          //     <InterviewSuggestions />
          //     <ResumeInsights />
          //     {/* <LearningHubPreview /> */}
          //     <Gamification />
          //   </div>
          // </main>
    //     </div>
    //   </div>
    // </SidebarProvider>
    // <>
    //   <Dashboard />
    // </>
    <>
      <NewDashboard />
    </>
  )
}
