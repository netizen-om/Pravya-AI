"use client"
import { PageHeader } from "@/components/interview/interview-tab-page-header"
import { InterviewHistoryTabs } from "@/components/interview/interview-history-tabs"

export default function InterviewPage() {
  return (
    <div className="w-full bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white min-h-screen">
      <div className="p-4 md:p-8">
        <PageHeader />
        <InterviewHistoryTabs />
      </div>
    </div>
  )
}
