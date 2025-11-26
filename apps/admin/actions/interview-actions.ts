"use server";

import { prisma } from "@repo/db";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getInterviews(filter?: "all" | "completed" | "pending" | "error") {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const where: any = { isDeleted: false };
    
    if (filter === "completed") {
      where.status = "COMPLETED";
    } else if (filter === "pending") {
      where.status = "PENDING";
    } else if (filter === "error") {
      where.status = "ERROR";
    }

    const interviews = await prisma.interview.findMany({
      where,
      select: {
        interviewId: true,
        user: {
          select: {
            email: true,
          },
        },
        template: {
          select: {
            title: true,
          },
        },
        status: true,
        feedback: {
          select: {
            overallScore: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedInterviews = interviews.map((interview) => ({
      id: interview.interviewId,
      user: interview.user.email || "N/A",
      template: interview.template?.title || "Personalised",
      status: interview.status.charAt(0).toUpperCase() + interview.status.slice(1),
      score: interview.feedback?.overallScore ? interview.feedback.overallScore : null,
      date: interview.createdAt ? new Date(interview.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : "N/A",
    }));

    return { success: true, interviews: formattedInterviews };
  } catch (error) {
    console.error("Get interviews error:", error);
    return { success: false, error: "Failed to fetch interviews" };
  }
}

export async function getInterviewDetails(interviewId: string) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const interview = await prisma.interview.findUnique({
      where: { interviewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        template: {
          select: {
            title: true,
            description: true,
            estimatedDuration: true,
          },
        },
        questions: {
          orderBy: {
            order: "asc",
          },
        },
        feedback: true,
       
      },
    });

    if (!interview) {
      return { success: false, error: "Interview not found" };
    }

    return { success: true, interview };
  } catch (error) {
    console.error("Get interview details error:", error);
    return { success: false, error: "Failed to fetch interview details" };
  }
}

export async function deleteInterview(interviewId: string) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Soft delete interview
    await prisma.interview.update({
      where: { interviewId },
      data: { isDeleted: true },
    });

    revalidatePath("/admin/interviews");
    return { success: true };
  } catch (error) {
    console.error("Delete interview error:", error);
    return { success: false, error: "Failed to delete interview" };
  }
}

