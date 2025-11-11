"use server";

import { prisma } from "@repo/db";

export interface LearningHubQuestion {
  id: string;
  questionText: string;
  category: string;
  tags: string[];
  questionId: string;
}

export interface LearningHubFilters {
  searchTerm?: string;
  tagSearch?: string; // Search by tags
  mainCategoryId?: string;
  subCategoryId?: string;
  page?: number;
  pageSize?: number;
}

export interface MainCategory {
  mainCategoryId: string;
  name: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  subCategoryId: string;
  name: string;
}

export interface LearningHubResponse {
  questions: LearningHubQuestion[];
  totalPages: number;
  totalCount: number;
  mainCategories: MainCategory[];
}

/**
 * Fetches questions for the learning hub with filtering and pagination
 */
export async function getLearningHubQuestions(
  filters: LearningHubFilters = {}
): Promise<LearningHubResponse> {
  try {
    const {
      searchTerm = "",
      tagSearch = "",
      mainCategoryId = null,
      subCategoryId = null,
      page = 1,
      pageSize = 10,
    } = filters;

    // Build where clause for filtering
    const where: any = {
      interview: {
        isDeleted: false,
        template: {},
      },
    };

    // Add MainCategory and SubCategory filter
    if (subCategoryId) {
      // If subCategory is selected, filter by it directly (it's unique)
      where.interview.template.subCategory = {
        subCategoryId: subCategoryId,
      };
    } else if (mainCategoryId) {
      // If only mainCategory is selected, filter by mainCategoryId
      where.interview.template.subCategory = {
        mainCategoryId: mainCategoryId,
      };
    }

    // Add search term filter (question text)
    if (searchTerm) {
      where.questionText = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }

    // Add tag search filter
    if (tagSearch) {
      where.interview.template.tags = {
        some: {
          name: {
            contains: tagSearch,
            mode: "insensitive",
          },
        },
      };
    }

    // Get total count for pagination
    const totalCount = await prisma.question.count({
      where,
    });

    // Fetch questions with related data
    const questions = await prisma.question.findMany({
      where,
      include: {
        interview: {
          include: {
            template: {
              include: {
                subCategory: {
                  include: {
                    mainCategory: true,
                  },
                },
                tags: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Transform questions to match UI format
    const formattedQuestions: LearningHubQuestion[] = questions.map((q) => ({
      id: q.questionId,
      questionId: q.questionId,
      questionText: q.questionText,
      category: q.interview.template.subCategory.name,
      tags: q.interview.template.tags.map((t) => t.name),
    }));

    // Get all MainCategories with their SubCategories
    // We'll get all categories and filter by checking if they have questions
    const mainCategoriesData = await prisma.mainCategory.findMany({
      include: {
        subCategories: {
          include: {
            templates: {
              include: {
                Interview: {
                  where: {
                    isDeleted: false,
                  },
                  select: {
                    interviewId: true,
                    questions: {
                      select: {
                        questionId: true,
                      },
                      take: 1, // Just check if questions exist
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Filter to only include MainCategories and SubCategories that have questions
    const mainCategories: MainCategory[] = mainCategoriesData
      .map((mainCat) => {
        const subCategoriesWithQuestions = mainCat.subCategories
          .filter((subCat) => {
            // Check if any template has interviews with questions
            return subCat.templates.some((template) =>
              template.Interview.some((interview) => interview.questions.length > 0)
            );
          })
          .map((subCat) => ({
            subCategoryId: subCat.subCategoryId,
            name: subCat.name,
          }));

        if (subCategoriesWithQuestions.length === 0) {
          return null;
        }

        return {
          mainCategoryId: mainCat.mainCategoryId,
          name: mainCat.name,
          subCategories: subCategoriesWithQuestions,
        };
      })
      .filter((cat): cat is MainCategory => cat !== null);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      questions: formattedQuestions,
      totalPages,
      totalCount,
      mainCategories,
    };
  } catch (error) {
    console.error("Error fetching learning hub questions:", error);
    return {
      questions: [],
      totalPages: 0,
      totalCount: 0,
      categories: [],
      tags: [],
    };
  }
}

/**
 * Gets AI answer for a question
 * First checks if answer exists in DB, otherwise calls the API
 */
export async function getAIAnswer(questionId: string): Promise<{
  success: boolean;
  answer?: string;
  error?: string;
}> {
  try {
    // First, check if answer exists in database
    const question = await prisma.question.findUnique({
      where: { questionId },
      select: { AIanswer: true },
    });

    if (!question) {
      return {
        success: false,
        error: "Question not found",
      };
    }

    // If answer exists, return it
    if (question.AIanswer) {
      return {
        success: true,
        answer: question.AIanswer,
      };
    }

    // If answer doesn't exist, call the API
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/interview/questions/get-ai-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questionId }),
        }
      );

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();

      // The API returns: { statusCode, data, message, success }
      // The controller passes parameters in wrong order: ApiResponse(statusCode, message, answer)
      // So: data.message contains the answer, data.data contains the status message
      let answer: string | null = null;
      let errorMessage: string = "Failed to generate AI answer";
      
      if (data.success) {
        // The answer is in the message field (longer string)
        // The status message is in the data field (shorter string)
        const messageStr = typeof data.message === 'string' ? data.message : '';
        const dataStr = typeof data.data === 'string' ? data.data : '';
        
        // Use the longer string as the answer (answers are typically longer than status messages)
        if (messageStr.length > dataStr.length && messageStr.length > 50) {
          answer = messageStr;
        } else if (dataStr.length > messageStr.length && dataStr.length > 50) {
          answer = dataStr;
        } else if (messageStr.length > 50) {
          answer = messageStr;
        } else if (dataStr.length > 50) {
          answer = dataStr;
        }
        
        // Get error message from the shorter string if answer not found
        if (!answer) {
          errorMessage = messageStr || dataStr || errorMessage;
        }
      } else {
        errorMessage = data.message || data.data || errorMessage;
      }

      if (answer) {
        // Update the question with the new answer
        await prisma.question.update({
          where: { questionId },
          data: { AIanswer: answer },
        });

        return {
          success: true,
          answer: answer,
        };
      }

      return {
        success: false,
        error: errorMessage,
      };
    } catch (apiError) {
      console.error("Error calling AI answer API:", apiError);
      return {
        success: false,
        error: "Failed to fetch AI answer. Please try again later.",
      };
    }
  } catch (error) {
    console.error("Error getting AI answer:", error);
    return {
      success: false,
      error: "An error occurred while fetching the answer",
    };
  }
}

