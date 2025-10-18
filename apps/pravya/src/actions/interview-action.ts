"use server"

import { prisma } from "@repo/db";
/**
 * Fetches all main categories and includes a preview of their associated templates.
 */
export async function getMainCategoriesWithTemplates() {
  try {
    const categories = await prisma.mainCategory.findMany({
      // Include the nested relations to get all the data we need in one query
      include: {
        subCategories: {
          include: {
            templates: {
              // Limit the number of templates per sub-category for the preview
              take: 4, 
              include: {
                tags: true, // Also fetch the tags for each template
              },
            },
          },
        },
      },
    })

    // Transform the raw database data to match the shape your frontend expects
    const formattedData = categories.map((mainCat) => {
      // Flatten the templates from all sub-categories into a single array
      const allTemplates = mainCat.subCategories.flatMap((subCat) => subCat.templates);

      return {
        mainCategoryId: mainCat.mainCategoryId,
        name: mainCat.name,
        // Take the first 4-5 templates as a preview for the main page
        templates: allTemplates.slice(0, 4).map((template) => ({
          id: template.interviewTemplateId,
          title: template.title,
          description: template.description,
          // Convert the array of Tag objects to an array of strings
          tags: template.tags.map((tag) => tag.name),
        })),
      }
    })

    return formattedData
  } catch (error) {
    console.error("Failed to fetch main categories:", error)
    return [] // Return an empty array on error
  }
}

/**
 * Fetches the detailed view for a single main category, including all its
 * sub-categories and their respective templates.
 * @param categoryId The ID of the main category to fetch.
 */
export async function getCategoryDetails(categoryId: string) {
  try {
    const category = await prisma.mainCategory.findUnique({
      where: {
        mainCategoryId: categoryId,
      },
      include: {
        // Include all sub-categories belonging to this main category
        subCategories: {
          include: {
            // Include all templates within each sub-category
            templates: {
              include: {
                tags: true, // And their tags
              },
            },
          },
        },
      },
    })

    if (!category) {
      return null // Or handle the "not found" case as needed
    }

    // Transform the data to match the expected shape
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
    }
  } catch (error) {
    console.error(`Failed to fetch details for category ${categoryId}:`, error)
    return null // Return null on error
  }
}