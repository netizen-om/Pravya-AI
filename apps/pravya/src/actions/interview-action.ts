"use server";

import { interviewAnalyseQueue } from "@/lib/queues";
import { prisma } from "@repo/db";
import { unstable_cache as cache } from "next/cache"; // 1. Import the cache function


/**
 * Fetches all main categories and includes a preview of their associated templates.
 * The result is cached for 1 hour (3600 seconds).
 */
export const getMainCategoriesWithTemplates = cache(
  async () => {
    try {
      // This log will only appear in your console when the cache is empty or stale.
      console.log("CACHE MISS: Fetching main categories from the database.");

      const categories = await prisma.mainCategory.findMany({
        include: {
          subCategories: {
            include: {
              templates: {
                take: 4,
                include: {
                  tags: true,
                },
              },
            },
          },
        },
      });

      const formattedData = categories.map((mainCat) => {
        const allTemplates = mainCat.subCategories.flatMap(
          (subCat) => subCat.templates
        );
        return {
          mainCategoryId: mainCat.mainCategoryId,
          name: mainCat.name,
          templates: allTemplates.slice(0, 4).map((template) => ({
            id: template.interviewTemplateId,
            title: template.title,
            description: template.description,
            tags: template.tags.map((tag) => tag.name),
          })),
        };
      });
      return formattedData;
    } catch (error) {
      console.error("Failed to fetch main categories:", error);
      return [];
    }
  },
  ["main-categories-with-templates"], // 2. A unique key for this specific cache.
  {
    revalidate: 3600, // 3. Cache duration in seconds (1 hour).
  }
);

export async function getCategoryDetails(categoryId: string) {
  // The cache key is dynamic, including the categoryId to ensure
  // each category's data is cached separately.
  return cache(
    async () => {
      try {
        console.log(
          `CACHE MISS: Fetching details for category ${categoryId} from DB.`
        );

        const category = await prisma.mainCategory.findUnique({
          where: {
            mainCategoryId: categoryId,
          },
          include: {
            subCategories: {
              include: {
                templates: {
                  include: {
                    tags: true,
                  },
                },
              },
            },
          },
        });

        if (!category) {
          return null;
        }

        return {
          mainCategoryName: category.name,
          subCategories: category.subCategories.map((subCat) => ({
            name: subCat.name,
            templates: subCat.templates.map((template) => ({
              id: template.interviewTemplateId,
              title: template.title,
              description: template.description,
              tags: template.tags.map((tag) => tag.name),
            })),
          })),
        };
      } catch (error) {
        console.error(
          `Failed to fetch details for category ${categoryId}:`,
          error
        );
        return null;
      }
    },
    ["category-details", categoryId], // Note the dynamic key part.
    {
      revalidate: 3600,
    }
  )();
}

export async function getInterviewDetails(interviewId: string) {
  const interview = await prisma.interview.findUnique({
    where: { interviewId },
    select: {
      role: true, // or 'title' if your field name is title
      questions: {
        orderBy: {
          order: "asc",
        },
        select: {
          questionText: true,
        },
      },
    },
  });

  console.log(interview);

  // Return a clean structure
  return {
    title: interview?.role || "", // or interview?.title
    questions: interview?.questions.map((q) => q.questionText) || [],
  };
}

export async function addInterviewTranscribe(
  interviewId: string,
  transcribe: {
    id: string;
    role: "user" | "assistant";
    text: string;
    interim?: boolean;
  }[]
) {
  try {
    console.log("USER transcribe : ", transcribe);

    const interview = await prisma.interview.update({
      where: { interviewId: interviewId },
      data: { transcribe: transcribe },
      include : { template : true }
    });

    if (!interview || !interview.transcribe) {
      throw new Error("Interview or Transcribe no found to process feedback");
    }

    const cleanedTranscript: { role: "user" | "assistant"; text: string }[] =
      interview.transcribe.map(({ role, text }) => ({
        role,
        text,
      }));

    const questionAnswerPairs = [];
    for (let i = 0; i < cleanedTranscript.length; i++) {
      if (
        cleanedTranscript[i].role === "assistant" &&
        cleanedTranscript[i + 1]?.role === "user"
      ) {
        questionAnswerPairs.push({
          questionId: `q_${i + 1}`, // Generate a simple unique ID
          questionText: cleanedTranscript[i].text,
          userAnswerTranscript: cleanedTranscript[i + 1].text,
        });
        i++; // Skip the answer we just processed
      }
    }

    await prisma.userActivity.create({
      data: {
        userId: interview.userId,
        action: "INTERVIEW_COMPLETED",
        targetType: "INTERVIEW",
        targetId: interview.interviewId,
        details: interview.template.title,
      },
    });

    if (2 <= questionAnswerPairs.length) {
      throw new Error("No valid question/answer pairs found in transcript.");
    }

    await interviewAnalyseQueue.add("interview-analyse", {
      interviewId: interviewId,
    });

    console.log("Transcribe aded succesfully");

    return interview;
  } catch (error) {
    console.error("Error updating interview transcribe:", error);
    throw error;
  }
}

export async function getFeedback(feedbackId: string) {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        feedbackId: feedbackId,
      },
    });

    return feedback;
  } catch (error) {
    console.log("ERROR", error);
  }
}

export async function check2(interviewId: string) {
  try {
    await interviewAnalyseQueue.add("interview-analyse", {
      interviewId: interviewId,
    });

    console.log("Queued");
  } catch (error) {
    console.error("Error updating interview transcribe:", error);
    throw error;
  }
}
