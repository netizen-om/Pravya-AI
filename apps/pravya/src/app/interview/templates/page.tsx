"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InterviewTemplateCard } from "@/components/interview/interview-template-card"
import { getMainCategoriesWithTemplates } from "@/actions/interview-action"
import { useHydrationSafeTheme } from "@/components/hooks/useHydrationSafeTheme"
import { Card } from "@/components/ui/card"
import Loader from "@/components/loader/loader"
import { BackButton } from "@/components/BackButton"

interface Template {
  id: string
  title: string
  description: string
  tags: string[]
}

interface Category {
  mainCategoryId: string
  name: string
  templates: Template[]
}

export default function InterviewsPage() {

  const { theme, isMounted } = useHydrationSafeTheme();
  const isDark = theme === "dark";



  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMainCategoriesWithTemplates()
        setCategories(data)
        setFilteredCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const filtered = categories
      .map((category) => ({
        ...category,
        templates: category.templates.filter(
          (template) =>
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        ),
      }))
      .filter((category) => category.templates.length > 0)

    setFilteredCategories(filtered)
  }, [searchQuery, categories])

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

    if (!isMounted) {
    return (
      <Loader title="hi" />
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <BackButton />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Interview Library</h1>
          <p className="mt-4 text-lg text-zinc-400">
            Browse our expertly crafted interview templates to prepare for your next role.
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
              placeholder="Search all templates (e.g., React, Senior, Sales...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dark:border-zinc-800 dark:bg-zinc-900 pl-10 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>
        </motion.div>

        {/* Categories */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">
            {filteredCategories.map((category) => (
              <motion.div key={category.mainCategoryId} variants={itemVariants}>
                {/* Category Header */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{category.name}</h2>
                  <Button variant="ghost" className="text-zinc-400 hover:text-white" asChild>
                    <Link href={`/interview/templates/${category.mainCategoryId}`} prefetch={true}>
                      View All
                    </Link>
                  </Button>
                </div>

                {/* Scrollable Cards Container */}
                <div className="group relative">
                  <div className="flex gap-4 overflow-x-hidden pb-4 ">
                    {category.templates.map((template) => (
                      <div key={template.id} className="flex-shrink-0 w-80">
                        <InterviewTemplateCard template={template} isDark={isDark}/>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredCategories.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
            <p className="text-zinc-400">No templates found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
