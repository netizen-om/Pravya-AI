"use server";

import { prisma } from "@repo/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function getDashboardMetrics() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Get total users (not deleted)
    const totalUsers = await prisma.user.count({
      where: { isDeleted: false },
    });

    // Get subscribed users
    const subscribedUsers = await prisma.subscription.count({
      where : {
        status : "ACTIVE"
      }
    })

    // Get total revenue (sum of all payments in INR, convert paise to rupees)
    const payments = await prisma.payment.findMany({
      select: { amount: true, currency: true },
    });
    const totalRevenue = payments.reduce((sum, payment) => {
      // Amount is in smallest currency unit (paise for INR)
      if (payment.currency === "INR") {
        return sum + payment.amount / 100; // Convert paise to rupees
      }
      return sum + payment.amount;
    }, 0);

    // Get total interviews (not deleted)
    const totalInterviews = await prisma.interview.count({
      where: { isDeleted: false },
    });

    return {
      success: true,
      metrics: {
        totalUsers,
        subscribedUsers,
        totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
        totalInterviews,
      },
    };
  } catch (error) {
    console.error("Get dashboard metrics error:", error);
    return { success: false, error: "Failed to fetch metrics" };
  }
}

export async function getUserGrowthData() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Get user growth for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by day
    const dailyCounts: { [key: string]: number } = {};
    users.forEach((user) => {
      const date = new Date(user.createdAt!).toISOString().split("T")[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    // Get cumulative counts
    let cumulative = 0;
    const growthData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split("T")[0];
      cumulative += dailyCounts[dateStr] || 0;
      growthData.push({
        date: `Day ${i + 1}`,
        users: cumulative,
      });
    }

    return { success: true, data: growthData };
  } catch (error) {
    console.error("Get user growth data error:", error);
    return { success: false, error: "Failed to fetch user growth data" };
  }
}

export async function getRevenueData() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Get revenue for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
        amount: true,
        currency: true,
      },
    });

    // Group by day
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyRevenue: { [key: string]: number } = {};

    payments.forEach((payment) => {
      const date = new Date(payment.createdAt);
      const dayName = dayNames[date.getDay()];
      const amount = payment.currency === "INR" ? payment.amount / 100 : payment.amount;
      dailyRevenue[dayName] = (dailyRevenue[dayName] || 0) + amount;
    });

    // Create data for last 7 days
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = dayNames[date.getDay()];
      revenueData.push({
        day: dayName,
        revenue: Math.round((dailyRevenue[dayName] || 0) * 100) / 100,
      });
    }

    return { success: true, data: revenueData };
  } catch (error) {
    console.error("Get revenue data error:", error);
    return { success: false, error: "Failed to fetch revenue data" };
  }
}

export async function getLatestSignups() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    const signups = users.map((user) => {
      const now = new Date();
      const created = new Date(user.createdAt!);
      const diffMs = now.getTime() - created.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let joined = "";
      if (diffHours < 1) {
        joined = "Just now";
      } else if (diffHours < 24) {
        joined = `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
      } else {
        joined = `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
      }

      return {
        email: user.email || "N/A",
        joined,
      };
    });

    return { success: true, signups };
  } catch (error) {
    console.error("Get latest signups error:", error);
    return { success: false, error: "Failed to fetch latest signups" };
  }
}

export async function getFailedJobs() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Get resumes with analysis status error or qdrant status failed
    const resumes = await prisma.resume.findMany({
      where: {
        isDeleted: false,
        OR: [
          { AnalysisStatus: "error" },
          { QdrantStatus: "failed" },
        ],
      },
      select: {
        id: true,
        user: {
          select: {
            email: true,
          },
        },
        AnalysisStatus: true,
        QdrantStatus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    const failedJobs = resumes.map((resume) => ({
      resumeId: resume.id,
      user: resume.user.email || "N/A",
      status: resume.AnalysisStatus === "error" || resume.QdrantStatus === "failed" ? "Error" : "Pending",
    }));

    return { success: true, failedJobs };
  } catch (error) {
    console.error("Get failed jobs error:", error);
    return { success: false, error: "Failed to fetch failed jobs" };
  }
}

