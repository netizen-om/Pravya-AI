"use server"

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

/**
 * Fetches the detailed view for a single main category.
 * The result is cached for 1 hour (3600 seconds).
 * @param categoryId The ID of the main category to fetch.
 */
export async function getCategoryDetails(categoryId: string) {
  // The cache key is dynamic, including the categoryId to ensure
  // each category's data is cached separately.
  return cache(
    async () => {
      try {
        console.log(`CACHE MISS: Fetching details for category ${categoryId} from DB.`);
        
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
        console.error(`Failed to fetch details for category ${categoryId}:`, error);
        return null;
      }
    },
    ["category-details", categoryId], // Note the dynamic key part.
    {
      revalidate: 3600,
    }
  )();
}

export async function getIntrviewDetails(interviewId : string) {
  
}