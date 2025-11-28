"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unstable_cache as cache } from "next/cache";
import { ActivityAction } from "@prisma/client";

// Types for dashboard data
export interface QuickStatsData {
  interviewsThisMonth: number;
  averageScore: number | null;
  lastResume: {
    fileName: string;
    uploadedDaysAgo: number;
  } | null;
  streak: number;
}

export interface RecentActivityItem {
  id: string;
  type: "interview" | "resume" | "payment" | "subscription";
  title: string;
  description: string;
  timestamp: Date;
  action: ActivityAction;
}

export interface PerformanceData {
  scoresOverTime: {
    date: string;
    interviewScore: number;
    atsScore: number | null;
  }[];
  strengthsData: {
    skill: string;
    score: number;
  }[];
}

export interface InterviewTrendData {
  day: string;
  value: number;
}

export interface SuggestedTemplate {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface DashboardData {
  quickStats: QuickStatsData;
  recentActivity: RecentActivityItem[];
  performance: PerformanceData;
  interviewTrend: InterviewTrendData[];
  suggestedTemplates: SuggestedTemplate[];
}

// Helper to get day name
function getDayName(date: Date): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
}

// Helper to get relative time description
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

// Helper to map activity action to display info
function getActivityDisplayInfo(action: ActivityAction): {
  type: "interview" | "resume" | "payment" | "subscription";
  title: string;
} {
  switch (action) {
    case "INTERVIEW_COMPLETED":
      return { type: "interview", title: "Completed Mock Interview" };
    case "INTERVIEW_DELETED":
      return { type: "interview", title: "Deleted Interview" };
    case "RESUME_UPLOADED":
      return { type: "resume", title: "Resume Uploaded" };
    case "RESUME_DELETED":
      return { type: "resume", title: "Resume Deleted" };
    case "PAYMENT_SUCCESS":
      return { type: "payment", title: "Payment Successful" };
    case "PAYMENT_FAILED":
      return { type: "payment", title: "Payment Failed" };
    case "SUBSCRIPTION_STARTED":
      return { type: "subscription", title: "Subscription Started" };
    case "PASSWORD_RESET_REQUEST":
      return { type: "subscription", title: "Password Reset Requested" };
    default:
      return { type: "interview", title: "Activity" };
  }
}

// Calculate streak from interviews
async function calculateStreak(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all completed interviews ordered by date
  const interviews = await prisma.interview.findMany({
    where: {
      userId,
      status: "COMPLETED",
      isDeleted: false,
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (interviews.length === 0) return 0;

  // Get unique dates
  const uniqueDates = new Set<string>();
  interviews.forEach((interview) => {
    const date = new Date(interview.createdAt);
    date.setHours(0, 0, 0, 0);
    uniqueDates.add(date.toISOString().split("T")[0]);
  });

  const sortedDates = Array.from(uniqueDates).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (sortedDates.length === 0) return 0;

  // Check if the most recent activity is today or yesterday
  const mostRecentDate = new Date(sortedDates[0]);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // If no activity today or yesterday, streak is 0
  if (mostRecentDate.getTime() < yesterday.getTime()) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(sortedDates[i + 1]);
    const diffDays = Math.round((current.getTime() - next.getTime()) / 86400000);

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// The main cached dashboard data fetcher
async function fetchDashboardDataForUser(userId: string): Promise<DashboardData> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Execute all queries in parallel for optimization
  const [
    interviewsThisMonth,
    last10InterviewsWithFeedback,
    lastResume,
    recentActivities,
    last7DaysInterviews,
    suggestedTemplates,
    resumeWithAnalysis,
  ] = await Promise.all([
    // Count interviews this month
    prisma.interview.count({
      where: {
        userId,
        status: "COMPLETED",
        isDeleted: false,
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),

    // Last 10 completed interviews with feedback for average score
    prisma.interview.findMany({
      where: {
        userId,
        status: "COMPLETED",
        isDeleted: false,
        feedback: {
          isNot: null,
        },
      },
      select: {
        createdAt: true,
        feedback: {
          select: {
            overallScore: true,
            communicationScore: true,
            technicalScore: true,
            problemSolvingScore: true,
            behavioralScore: true,
            confidenceScore: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),

    // Last uploaded resume
    prisma.resume.findFirst({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        fileName: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    // Recent activities (last 5)
    prisma.userActivity.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    // Interviews in last 7 days for trend
    prisma.interview.findMany({
      where: {
        userId,
        status: "COMPLETED",
        isDeleted: false,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    }),

    // Suggested templates (random 6)
    prisma.interviewTemplate.findMany({
      include: {
        tags: true,
      },
      take: 6,
    }),

    // Latest resume with analysis for ATS score
    prisma.resume.findFirst({
      where: {
        userId,
        isDeleted: false,
        ResumeAnalysis: {
          isNot: null,
        },
      },
      select: {
        ResumeAnalysis: {
          select: {
            atsScore: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  // Calculate streak
  const streak = await calculateStreak(userId);

  // Process Quick Stats
  const averageScore =
    last10InterviewsWithFeedback.length > 0
      ? Math.round(
          last10InterviewsWithFeedback.reduce(
            (sum, interview) => sum + (interview.feedback?.overallScore || 0),
            0
          ) / last10InterviewsWithFeedback.length
        )
      : null;

  const lastResumeData = lastResume
    ? {
        fileName: lastResume.fileName,
        uploadedDaysAgo: Math.floor(
          (now.getTime() - lastResume.createdAt.getTime()) / 86400000
        ),
      }
    : null;

  // Process Performance Data - Scores over time
  const scoresOverTime = last10InterviewsWithFeedback
    .slice(0, 7)
    .reverse()
    .map((interview, index) => {
      const date = new Date(interview.createdAt);
      return {
        date: getDayName(date).slice(0, 3),
        interviewScore: interview.feedback?.overallScore || 0,
        atsScore: resumeWithAnalysis?.ResumeAnalysis?.atsScore || null,
      };
    });

  // Calculate average strengths from all feedback
  const strengthsData =
    last10InterviewsWithFeedback.length > 0
      ? [
          {
            skill: "Communication",
            score: Math.round(
              last10InterviewsWithFeedback.reduce(
                (sum, i) => sum + (i.feedback?.communicationScore || 0),
                0
              ) / last10InterviewsWithFeedback.length
            ),
          },
          {
            skill: "Technical",
            score: Math.round(
              last10InterviewsWithFeedback.reduce(
                (sum, i) => sum + (i.feedback?.technicalScore || 0),
                0
              ) / last10InterviewsWithFeedback.length
            ),
          },
          {
            skill: "Problem-Solving",
            score: Math.round(
              last10InterviewsWithFeedback.reduce(
                (sum, i) => sum + (i.feedback?.problemSolvingScore || 0),
                0
              ) / last10InterviewsWithFeedback.length
            ),
          },
          {
            skill: "Behavioral",
            score: Math.round(
              last10InterviewsWithFeedback.reduce(
                (sum, i) => sum + (i.feedback?.behavioralScore || 0),
                0
              ) / last10InterviewsWithFeedback.length
            ),
          },
          {
            skill: "Confidence",
            score: Math.round(
              last10InterviewsWithFeedback.reduce(
                (sum, i) => sum + (i.feedback?.confidenceScore || 0),
                0
              ) / last10InterviewsWithFeedback.length
            ),
          },
        ]
      : [];

  // Process Interview Trend (last 7 days)
  const dayCountMap = new Map<string, number>();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Initialize all days with 0
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dayCountMap.set(getDayName(date), 0);
  }

  // Count interviews per day
  last7DaysInterviews.forEach((interview) => {
    const dayName = getDayName(new Date(interview.createdAt));
    dayCountMap.set(dayName, (dayCountMap.get(dayName) || 0) + 1);
  });

  const interviewTrend: InterviewTrendData[] = Array.from(dayCountMap.entries()).map(
    ([day, value]) => ({ day, value })
  );

  // Process Recent Activities
  const recentActivity: RecentActivityItem[] = recentActivities.map((activity) => {
    const displayInfo = getActivityDisplayInfo(activity.action);
    return {
      id: activity.id,
      type: displayInfo.type,
      title: displayInfo.title,
      description: activity.details || "",
      timestamp: activity.createdAt,
      action: activity.action,
    };
  });

  // Process Suggested Templates
  const formattedTemplates: SuggestedTemplate[] = suggestedTemplates.map((template) => ({
    id: template.interviewTemplateId,
    title: template.title,
    description: template.description || "",
    tags: template.tags.map((tag) => tag.name),
  }));

  return {
    quickStats: {
      interviewsThisMonth,
      averageScore,
      lastResume: lastResumeData,
      streak,
    },
    recentActivity,
    performance: {
      scoresOverTime,
      strengthsData,
    },
    interviewTrend,
    suggestedTemplates: formattedTemplates,
  };
}

// Cached version of dashboard data fetcher
export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return null;

  // Create a cached function with user-specific key
  const cachedFetch = cache(
    async () => fetchDashboardDataForUser(userId),
    [`dashboard-data-${userId}`],
    {
      revalidate: 30, // 30 seconds cache
    }
  );

  return cachedFetch();
}

