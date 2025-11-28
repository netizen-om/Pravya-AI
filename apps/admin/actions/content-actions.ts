"use server"

import { prisma } from "@repo/db"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { getCurrentAdmin } from "@/lib/auth"

const mainCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters")
    .transform((value) => value.trim()),
})

const subCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be under 80 characters")
    .transform((value) => value.trim()),
  mainCategoryId: z.string().min(1, "Please select a main category"),
})

const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Tag must be at least 2 characters")
    .max(40, "Tag must be under 40 characters")
    .transform((value) => value.trim()),
})

const templateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be under 120 characters")
    .transform((value) => value.trim()),
  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .transform((value) => (value ? value.trim() : undefined)),
  estimatedDuration: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(5, "Duration must be at least 5 minutes")
    .max(240, "Duration must be under 240 minutes"),
  subCategoryId: z.string().min(1, "Please select a sub-category"),
  tagIds: z.array(z.string()).default([]),
})

type TemplateInput = z.infer<typeof templateSchema>

const unauthorizedResponse = { success: false, error: "Unauthorized" } as const

function formatPrismaError(error: unknown, fallbackMessage: string) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return "Record already exists."
  }
  return fallbackMessage
}

function formatValidationError(error: z.ZodError<unknown>) {
  return error.issues[0]?.message || "Invalid input"
}

async function ensureAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return null
  }
  return admin
}

export async function getContentDashboardData() {
  try {
    const admin = await ensureAdmin()
    if (!admin) {
      return unauthorizedResponse
    }

    const [mainCategories, subCategories, tags, templates] = await Promise.all([
      prisma.mainCategory.findMany({
        include: { subCategories: { select: { subCategoryId: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.subCategory.findMany({
        include: {
          mainCategory: {
            select: {
              mainCategoryId: true,
              name: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.tag.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.interviewTemplate.findMany({
        include: {
          subCategory: {
            include: {
              mainCategory: true,
            },
          },
          tags: true,
        },
        orderBy: { title: "asc" },
      }),
    ])

    return {
      success: true,
      data: {
        mainCategories,
        subCategories,
        tags,
        templates,
      },
    }
  } catch (error) {
    console.error("getContentDashboardData error:", error)
    return { success: false, error: "Failed to load content data" }
  }
}

export async function createMainCategory(input: z.infer<typeof mainCategorySchema>) {
  try {
    const admin = await ensureAdmin()
    if (!admin) {
      return unauthorizedResponse
    }

    const parsed = mainCategorySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: formatValidationError(parsed.error) }
    }

    const mainCategory = await prisma.mainCategory.create({
      data: {
        name: parsed.data.name,
      },
    })

    await revalidatePath("/admin/content")
    return { success: true, data: mainCategory }
  } catch (error) {
    console.error("createMainCategory error:", error)
    return {
      success: false,
      error: formatPrismaError(error, "Failed to create main category"),
    }
  }
}

export async function createSubCategory(input: z.infer<typeof subCategorySchema>) {
  try {
    const admin = await ensureAdmin()
    if (!admin) {
      return unauthorizedResponse
    }

    const parsed = subCategorySchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: formatValidationError(parsed.error) }
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name: parsed.data.name,
        mainCategory: {
          connect: { mainCategoryId: parsed.data.mainCategoryId },
        },
      },
      include: {
        mainCategory: true,
      },
    })

    await revalidatePath("/admin/content")
    return { success: true, data: subCategory }
  } catch (error) {
    console.error("createSubCategory error:", error)
    return {
      success: false,
      error: formatPrismaError(error, "Failed to create sub-category"),
    }
  }
}

export async function createTag(input: z.infer<typeof tagSchema>) {
  try {
    const admin = await ensureAdmin()
    if (!admin) {
      return unauthorizedResponse
    }

    const parsed = tagSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: formatValidationError(parsed.error) }
    }

    const tag = await prisma.tag.create({
      data: {
        name: parsed.data.name,
      },
    })

    await revalidatePath("/admin/content")
    return { success: true, data: tag }
  } catch (error) {
    console.error("createTag error:", error)
    return {
      success: false,
      error: formatPrismaError(error, "Failed to create tag"),
    }
  }
}

export async function createTemplate(input: TemplateInput) {
  try {
    const admin = await ensureAdmin()
    if (!admin) {
      return unauthorizedResponse
    }

    const parsed = templateSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: formatValidationError(parsed.error) }
    }

    const { title, description, estimatedDuration, subCategoryId, tagIds } = parsed.data
    const uniqueTagIds = Array.from(new Set(tagIds ?? []))

    const template = await prisma.interviewTemplate.create({
      data: {
        title,
        description: description || null,
        estimatedDuration,
        subCategory: {
          connect: { subCategoryId },
        },
        ...(uniqueTagIds.length > 0 && {
          tags: {
            connect: uniqueTagIds.map((TagId) => ({ TagId })),
          },
        }),
      },
      include: {
        subCategory: {
          include: {
            mainCategory: true,
          },
        },
        tags: true,
      },
    })

    await revalidatePath("/admin/content")
    return { success: true, data: template }
  } catch (error) {
    console.error("createTemplate error:", error)
    return {
      success: false,
      error: formatPrismaError(error, "Failed to create template"),
    }
  }
}


