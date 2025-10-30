"use client"; // This component runs in the browser

import React from "react";
import { SidebarProvider } from "./sidebar-context";
// import { DashboardHeader } from "../dashboard/dashboard-header"; // Uncomment if you use it
import { WelcomeSection } from "./welcome-section";
import { QuickStats } from "./quick-stats";
import { RecentActivity } from "./recent-activity";
import { PerformanceAnalytics } from "./performance-analytics";
import { InterviewSuggestions } from "./interview-suggestions";
import { ResumeInsights } from "./resume-insights";
import dynamic from "next/dynamic";
import { Session } from "next-auth"; // Import the Session type
import {TodaysTip} from "./today-tip";
import { DashboardFooter } from "./Dashboard-footer";

// Dynamically import the sidebar (client-side)
const DashboardSidebar = dynamic(
  () =>
    import("./dashboard-sidebar").then(
      (mod) => mod.DashboardSidebar
    ),
  { ssr: false }
);

// Define the props interface
interface DashboardClientProps {
  session: Session;
}

// This is your Client Component. It is NOT async.
export const DashboardClient: React.FC<DashboardClientProps> = ({
  session,
}) => {
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
  );
};

