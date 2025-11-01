"use client"; // This component runs in the browser

import { motion } from "framer-motion";
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
import { TodaysTip } from "./today-tip";
import { DashboardFooter } from "./Dashboard-footer";
import { useHydrationSafeTheme } from "../hooks/useHydrationSafeTheme";
import { Card } from "../ui/card";

// Dynamically import the sidebar (client-side)
const DashboardSidebar = dynamic(
  () => import("./dashboard-sidebar").then((mod) => mod.DashboardSidebar),
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
  const { theme, isMounted } = useHydrationSafeTheme();
  const isDark = theme === "dark";

  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 rounded-lg bg-neutral-800 animate-pulse" />
          <div className="flex rounded-lg p-1 bg-neutral-900">
            <div className="h-8 w-24 rounded-md bg-neutral-800" />
            <div className="h-8 w-24 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[348px] animate-pulse" />
          <Card className="rounded-2xl border-neutral-800 bg-neutral-900/70 h-[348px] animate-pulse" />
        </div>
      </motion.section>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      <SidebarProvider>
        {/* <DashboardHeader session={session} /> */}
        <div className="flex">
          <DashboardSidebar isDark={isDark}/>
          <main className="flex-1 transition-all duration-300 ease-in-out">
            <div className="mx-auto max-w-7xl px-6 md:px-8 py-8 space-y-10">
              <WelcomeSection session={session} isDark={isDark}/>
              <QuickStats isDark={isDark}/>
              <PerformanceAnalytics isDark={isDark}/>
              <TodaysTip isDark={isDark}/>
              <RecentActivity isDark={isDark}/>
              <InterviewSuggestions isDark={isDark}/>
              <ResumeInsights isDark={isDark}/>
              <DashboardFooter />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};
