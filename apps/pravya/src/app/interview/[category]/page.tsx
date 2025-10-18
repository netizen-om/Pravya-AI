"use client"

import { useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { InterviewTemplateCard } from "@/components/interview/interview-template-card"
import { getCategoryDetails } from "@/actions/interview-action"

interface Template {
  id: string
  title: string
  description: string
  tags: string[]
}

interface SubCategory {
  name: string
  templates: Template[]
}

interface CategoryData {
  mainCategoryName: string
  subCategories: SubCategory[]
}

function SkeletonGrid() {
  return (
    <div className="space-y-16">
      {[1, 2].map((section) => (
        <div key={section}>
          <Skeleton className="mb-8 h-8 w-48 bg-zinc-800" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-64 bg-zinc-800" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CategoryContent({
  params,
}: {
  params: { category: string }
}) {
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [filteredData, setFilteredData] = useState<CategoryData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const data = await getCategoryDetails(params.category)
        setCategoryData(data)
        setFilteredData(data)
      } catch (error) {
        console.error("Failed to fetch category details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryDetails()
  }, [params.category])

  useEffect(() => {
    if (!categoryData) return

    const filtered: CategoryData = {
      mainCategoryName: categoryData.mainCategoryName,
      subCategories: categoryData.subCategories
        .map((subCategory) => ({
          ...subCategory,
          templates: subCategory.templates.filter(
            (template) =>
              template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
          ),
        }))
        .filter((subCategory) => subCategory.templates.length > 0),
    }

    setFilteredData(filtered)
  }, [searchQuery, categoryData])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {categoryData?.mainCategoryName || "Loading..."} Interviews
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Explore all templates in this category to find the perfect interview preparation.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder={`Search ${categoryData?.mainCategoryName || "templates"} (e.g., React, Senior, Sales...)`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
          />
        </div>
      </motion.div>

      {/* Sub-Categories Grid */}
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">
          {filteredData?.subCategories.map((subCategory) => (
            <motion.div key={subCategory.name} variants={itemVariants}>
              {/* Sub-Category Header */}
              <h2 className="mb-8 text-2xl font-semibold">{subCategory.name}</h2>

              {/* Templates Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {subCategory.templates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InterviewTemplateCard template={template} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredData?.subCategories.length === 0 && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
          <p className="text-zinc-400">No templates found matching your search.</p>
        </motion.div>
      )}
    </>
  )
}

export default function CategoryDetailPage({
  params,
}: {
  params: { category: string }
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<SkeletonGrid />}>
          <CategoryContent params={params} />
        </Suspense>
      </div>
    </div>
  )
}
