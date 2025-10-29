import React from "react";
import { SidebarProvider } from "../dashboard/sidebar-context";
import { DashboardHeader } from "../dashboard/dashboard-header";
import { authOptions } from "@repo/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "../dashboard/dashboard-sidebar";
import { WelcomeSection } from "../dashboard/welcome-section";
import { QuickStats } from "../dashboard/quick-stats";
import { RecentActivity } from "../dashboard/recent-activity";
import { PerformanceAnalytics } from "../dashboard/performance-analytics";
import { InterviewSuggestions } from "../dashboard/interview-suggestions";
import { ResumeInsights } from "../dashboard/resume-insights";
import { Gamification } from "../dashboard/gamification";

const NewDashboard = async() => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      <SidebarProvider>
        <DashboardHeader session={session} />
        <div className="flex">
            <DashboardSidebar />
          <main className="flex-1 transition-all duration-300 ease-in-out">
            <div className="mx-auto max-w-7xl px-6 md:px-8 py-8 space-y-10">
              <WelcomeSection session={session} />
              <QuickStats />
              <RecentActivity />
              <PerformanceAnalytics />
              <InterviewSuggestions />
              <ResumeInsights />
              {/* <LearningHubPreview /> */}
              <Gamification />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default NewDashboard;
