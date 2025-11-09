"use server";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export const deleteResume = async (resumeId: string) => {
  if (!resumeId) {
    throw new Error("Missing resume ID");
  }

  try {
    await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data: {
        isDeleted: true,
      },
    });

    revalidatePath("/resume/upload");
    return { success: true };
  } catch (error) {
    console.error("Failed to Delete Resume");
    console.error("Error : ", error);
    return { success: false };
  }
};
