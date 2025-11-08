"use server";

import { prisma } from "@repo/db";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getResumes(filter?: "all" | "completed" | "pending-analysis" | "error") {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const where: any = { isDeleted: false };
    
    if (filter === "completed") {
      where.AnalysisStatus = "completed";
      where.QdrantStatus = "indexed";
    } else if (filter === "pending-analysis") {
      where.OR = [
        { AnalysisStatus: "pending" },
        { AnalysisStatus: "uploadeding" },
      ];
    } else if (filter === "error") {
      where.OR = [
        { AnalysisStatus: "error" },
        { QdrantStatus: "failed" },
      ];
    }

    const resumes = await prisma.resume.findMany({
      where,
      select: {
        id: true,
        user: {
          select: {
            email: true,
          },
        },
        fileName: true,
        AnalysisStatus: true,
        QdrantStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedResumes = resumes.map((resume) => ({
      id: resume.id,
      user: resume.user.email || "N/A",
      fileName: resume.fileName,
      analysisStatus: resume.AnalysisStatus === "completed" ? "Completed" : 
                     resume.AnalysisStatus === "pending" ? "Pending Analysis" : "Error",
      qdrantStatus: resume.QdrantStatus === "indexed" ? "Indexed" :
                   resume.QdrantStatus === "pending" ? "Pending" : "Failed",
      date: resume.createdAt ? new Date(resume.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : "N/A",
    }));

    return { success: true, resumes: formattedResumes };
  } catch (error) {
    console.error("Get resumes error:", error);
    return { success: false, error: "Failed to fetch resumes" };
  }
}

export async function getResumeDetails(resumeId: string) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ResumeAnalysis: true,
      },
    });

    if (!resume) {
      return { success: false, error: "Resume not found" };
    }

    return { success: true, resume };
  } catch (error) {
    console.error("Get resume details error:", error);
    return { success: false, error: "Failed to fetch resume details" };
  }
}

export async function deleteResume(resumeId: string) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    // Soft delete resume
    await prisma.resume.update({
      where: { id: resumeId },
      data: { isDeleted: true },
    });

    revalidatePath("/admin/resumes");
    return { success: true };
  } catch (error) {
    console.error("Delete resume error:", error);
    return { success: false, error: "Failed to delete resume" };
  }
}

