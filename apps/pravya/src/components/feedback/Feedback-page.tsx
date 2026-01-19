"use client";

import { motion } from "framer-motion";
import type { DetailedInterviewFeedback } from "@/utlis/zod";
import Header from "@/components/feedback/header";
import OverallPerformance from "@/components/feedback/overall-performance";
import DashboardMetrics from "@/components/feedback/dashboard-metrics";
import CommunicationDelivery from "@/components/feedback/communication-delivery";
import QuestionBreakdown from "@/components/feedback/question-breakdown";
import RoleSpecificFit from "@/components/feedback/role-specific-fit";
import AnswerQualityChart from "@/components/feedback/answer-quality-chart";
import ImprovementAreasChart from "@/components/feedback/improvement-areas-chart";
import { useHydrationSafeTheme } from "../hooks/useHydrationSafeTheme";
import { BackButton } from "../BackButton";

interface FeedbackPageProps {
  feedback: DetailedInterviewFeedback;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function FeedbackPage({ feedback }: FeedbackPageProps) {
  const { resolvedTheme, isMounted } = useHydrationSafeTheme();
  const isDark = resolvedTheme === "dark";

  // 3. Render skeleton on server / initial client render
  if (!isMounted) {
    return (
      <></>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
     
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-8">
            <DashboardMetrics metrics={feedback.dashboardMetrics} isDark={isDark}/>
            <AnswerQualityChart questions={feedback.questionBreakdown} isDark={isDark}/>
            <ImprovementAreasChart questions={feedback.questionBreakdown} isDark={isDark}/>
            <CommunicationDelivery data={feedback.communicationAndDelivery} isDark={isDark}/>
            <QuestionBreakdown questions={feedback.questionBreakdown} isDark={isDark}/>
            <RoleSpecificFit roleData={feedback.roleSpecificFit} isDark={isDark}/>
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block flex-shrink-0 w-96">
            <div className="sticky top-8 space-y-8">
              <OverallPerformance performance={feedback.overallPerformance} isDark={isDark} />
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
