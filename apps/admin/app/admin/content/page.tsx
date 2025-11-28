"use client"

import { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, MoreHorizontal, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  createMainCategory,
  createSubCategory,
  createTag,
  createTemplate,
  getContentDashboardData,
} from "@/actions/content-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type NormalizedTag = {
  id: string
  name: string
}

type RawTag = {
  TagId: string
  name: string
}

type MainCategoryRecord = {
  mainCategoryId: string
  name: string
  subCategories: { subCategoryId: string }[]
}

type SubCategoryRecord = {
  subCategoryId: string
  name: string
  mainCategory: {
    mainCategoryId: string
    name: string
  }
}

type RawTemplateRecord = {
  interviewTemplateId: string
  title: string
  description: string | null
  estimatedDuration: number
  subCategory: {
    subCategoryId: string
    name: string
    mainCategory: {
      mainCategoryId: string
      name: string
    }
  }
  tags: RawTag[]
}

type RawContentPayload = {
  mainCategories: MainCategoryRecord[]
  subCategories: SubCategoryRecord[]
  tags: RawTag[]
  templates: RawTemplateRecord[]
}

type ContentDashboardData = {
  mainCategories: MainCategoryRecord[]
  subCategories: SubCategoryRecord[]
  tags: NormalizedTag[]
  templates: Array<Omit<RawTemplateRecord, "tags"> & { tags: NormalizedTag[] }>
}

const templateFormSchema = z.object({
  title: z.string().min(3, "Template title is required").max(120),
  description: z.string().max(500, "Description is too long").optional(),
  estimatedDuration: z.coerce
    .number({ invalid_type_error: "Estimated duration is required" })
    .int("Please use whole minutes")
    .min(5, "Minimum duration is 5 minutes")
    .max(240, "Maximum duration is 240 minutes"),
  subCategoryId: z.string().min(1, "Select a sub-category"),
  tagIds: z.array(z.string()).default([]),
})

const mainCategoryFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
})

const subCategoryFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  mainCategoryId: z.string().min(1, "Select a main category"),
})

const tagFormSchema = z.object({
  name: z.string().min(2, "Tag name is required").max(40),
})

type TemplateFormValues = z.infer<typeof templateFormSchema>
type MainCategoryFormValues = z.infer<typeof mainCategoryFormSchema>
type SubCategoryFormValues = z.infer<typeof subCategoryFormSchema>
type TagFormValues = z.infer<typeof tagFormSchema>

const defaultTemplateValues: TemplateFormValues = {
  title: "",
  description: "",
  estimatedDuration: 30,
  subCategoryId: "",
  tagIds: [],
}

const defaultMainCategoryValues: MainCategoryFormValues = {
  name: "",
}

const defaultSubCategoryValues: SubCategoryFormValues = {
  name: "",
  mainCategoryId: "",
}

const defaultTagValues: TagFormValues = {
  name: "",
}

const TEMPLATES_PER_PAGE = 8
const MAIN_CATEGORIES_PER_PAGE = 6
const SUB_CATEGORIES_PER_PAGE = 8
const TAGS_PER_PAGE = 12

type PaginationElement = number | "ellipsis-left" | "ellipsis-right"

function buildPaginationItems(current: number, total: number): PaginationElement[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const items: PaginationElement[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) {
    items.push("ellipsis-left")
  } else {
    for (let page = 2; page < start; page++) {
      items.push(page)
    }
  }

  for (let page = start; page <= end; page++) {
    items.push(page)
  }

  if (end < total - 1) {
    items.push("ellipsis-right")
  } else {
    for (let page = end + 1; page < total; page++) {
      items.push(page)
    }
  }

  items.push(total)
  return items
}

type PaginationControlsProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function PaginationControls({ page, totalPages, onPageChange, className }: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null
  }

  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return
    }
    onPageChange(nextPage)
  }

  const pageItems = buildPaginationItems(page, totalPages)

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault()
              changePage(page - 1)
            }}
            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
        {pageItems.map((item, index) =>
          typeof item === "number" ? (
            <PaginationItem key={`page-${item}`}>
              <PaginationLink
                href="#"
                isActive={page === item}
                onClick={(event) => {
                  event.preventDefault()
                  changePage(item)
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={`${item}-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault()
              changePage(page + 1)
            }}
            className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function normalizeContentData(payload: RawContentPayload): ContentDashboardData {
  const normalizeTags = (tags: RawTag[]): NormalizedTag[] =>
    tags.map((tag) => ({
      id: tag.TagId,
      name: tag.name,
    }))

  return {
    ...payload,
    tags: normalizeTags(payload.tags),
    templates: payload.templates.map((template) => ({
      ...template,
      tags: normalizeTags(template.tags),
    })),
  }
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState<"templates" | "categories" | "tags">("templates")
  const [data, setData] = useState<ContentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [mainDialogOpen, setMainDialogOpen] = useState(false)
  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)

  const [templateSubmitting, setTemplateSubmitting] = useState(false)
  const [mainSubmitting, setMainSubmitting] = useState(false)
  const [subSubmitting, setSubSubmitting] = useState(false)
  const [tagSubmitting, setTagSubmitting] = useState(false)

  const [templatePage, setTemplatePage] = useState(1)
  const [mainCategoryPage, setMainCategoryPage] = useState(1)
  const [subCategoryPage, setSubCategoryPage] = useState(1)
  const [tagPage, setTagPage] = useState(1)

  const templateForm = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: defaultTemplateValues,
  })
  const mainCategoryForm = useForm<MainCategoryFormValues>({
    resolver: zodResolver(mainCategoryFormSchema),
    defaultValues: defaultMainCategoryValues,
  })
  const subCategoryForm = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: defaultSubCategoryValues,
  })
  const tagForm = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: defaultTagValues,
  })

  const templates = data?.templates ?? []
  const mainCategories = data?.mainCategories ?? []
  const subCategories = data?.subCategories ?? []
  const tags = data?.tags ?? []

  const templateTotalPages = useMemo(
    () => Math.max(1, Math.ceil(templates.length / TEMPLATES_PER_PAGE)),
    [templates.length]
  )
  const mainCategoryTotalPages = useMemo(
    () => Math.max(1, Math.ceil(mainCategories.length / MAIN_CATEGORIES_PER_PAGE)),
    [mainCategories.length]
  )
  const subCategoryTotalPages = useMemo(
    () => Math.max(1, Math.ceil(subCategories.length / SUB_CATEGORIES_PER_PAGE)),
    [subCategories.length]
  )
  const tagTotalPages = useMemo(
    () => Math.max(1, Math.ceil(tags.length / TAGS_PER_PAGE)),
    [tags.length]
  )

  const paginatedTemplates = useMemo(() => {
    const start = (templatePage - 1) * TEMPLATES_PER_PAGE
    return templates.slice(start, start + TEMPLATES_PER_PAGE)
  }, [templatePage, templates])

  const paginatedMainCategories = useMemo(() => {
    const start = (mainCategoryPage - 1) * MAIN_CATEGORIES_PER_PAGE
    return mainCategories.slice(start, start + MAIN_CATEGORIES_PER_PAGE)
  }, [mainCategoryPage, mainCategories])

  const paginatedSubCategories = useMemo(() => {
    const start = (subCategoryPage - 1) * SUB_CATEGORIES_PER_PAGE
    return subCategories.slice(start, start + SUB_CATEGORIES_PER_PAGE)
  }, [subCategoryPage, subCategories])

  const paginatedTags = useMemo(() => {
    const start = (tagPage - 1) * TAGS_PER_PAGE
    return tags.slice(start, start + TAGS_PER_PAGE)
  }, [tagPage, tags])

  useEffect(() => {
    setTemplatePage((prev) => Math.min(Math.max(prev, 1), templateTotalPages))
  }, [templateTotalPages])

  useEffect(() => {
    setMainCategoryPage((prev) => Math.min(Math.max(prev, 1), mainCategoryTotalPages))
  }, [mainCategoryTotalPages])

  useEffect(() => {
    setSubCategoryPage((prev) => Math.min(Math.max(prev, 1), subCategoryTotalPages))
  }, [subCategoryTotalPages])

  useEffect(() => {
    setTagPage((prev) => Math.min(Math.max(prev, 1), tagTotalPages))
  }, [tagTotalPages])

  useEffect(() => {
    refreshContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshContent = async () => {
    try {
      setRefreshing(true)
      const result = await getContentDashboardData()
      if (result.success && result.data) {
        setData(normalizeContentData(result.data as RawContentPayload))
      } else {
        toast.error(result.error || "Failed to load content data")
      }
    } catch (error) {
      console.error("Content load error:", error)
      toast.error("Failed to load content data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleCreateTemplate = async (values: TemplateFormValues) => {
    try {
      setTemplateSubmitting(true)
      const result = await createTemplate(values)
      if (!result.success) {
        toast.error(result.error || "Could not create template")
        return
      }
      toast.success("Template created")
      templateForm.reset(defaultTemplateValues)
      setTemplateDialogOpen(false)
      await refreshContent()
    } catch (error) {
      console.error("Create template error:", error)
      toast.error("Could not create template")
    } finally {
      setTemplateSubmitting(false)
    }
  }

  const handleCreateMainCategory = async (values: MainCategoryFormValues) => {
    try {
      setMainSubmitting(true)
      const result = await createMainCategory(values)
      if (!result.success) {
        toast.error(result.error || "Could not create category")
        return
      }
      toast.success("Main category created")
      mainCategoryForm.reset(defaultMainCategoryValues)
      setMainDialogOpen(false)
      await refreshContent()
    } catch (error) {
      console.error("Create main category error:", error)
      toast.error("Could not create category")
    } finally {
      setMainSubmitting(false)
    }
  }

  const handleCreateSubCategory = async (values: SubCategoryFormValues) => {
    try {
      setSubSubmitting(true)
      const result = await createSubCategory(values)
      if (!result.success) {
        toast.error(result.error || "Could not create sub-category")
        return
      }
      toast.success("Sub-category created")
      subCategoryForm.reset(defaultSubCategoryValues)
      setSubDialogOpen(false)
      await refreshContent()
    } catch (error) {
      console.error("Create sub-category error:", error)
      toast.error("Could not create sub-category")
    } finally {
      setSubSubmitting(false)
    }
  }

  const handleCreateTag = async (values: TagFormValues) => {
    try {
      setTagSubmitting(true)
      const result = await createTag(values)
      if (!result.success) {
        toast.error(result.error || "Could not create tag")
        return
      }
      toast.success("Tag created")
      tagForm.reset(defaultTagValues)
      setTagDialogOpen(false)
      await refreshContent()
    } catch (error) {
      console.error("Create tag error:", error)
      toast.error("Could not create tag")
    } finally {
      setTagSubmitting(false)
    }
  }

  const tagUsageMap = useMemo(() => {
    const map = new Map<string, number>()
    templates.forEach((template) => {
      template.tags.forEach((tag) => {
        map.set(tag.id, (map.get(tag.id) || 0) + 1)
      })
    })
    return map
  }, [templates])

  const averageDuration = useMemo(() => {
    if (!templates.length) return null
    const total = templates.reduce((sum, template) => sum + template.estimatedDuration, 0)
    return Math.round(total / templates.length)
  }, [templates])

  const canCreateTemplate = Boolean(subCategories.length)
  const canCreateSubCategory = Boolean(mainCategories.length)

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground mt-1">Loading content configuration...</p>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Library</h1>
          <p className="text-muted-foreground mt-1">Create and organize templates, categories, and tags.</p>
        </div>
        <Button variant="outline" onClick={refreshContent} disabled={refreshing}>
          {refreshing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Refresh data
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-0 shadow-sm bg-gradient-to-b from-primary/10 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Templates</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {templates.length}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Main Categories</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {mainCategories.length}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Sub-Categories</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {subCategories.length}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Average Duration</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
              {averageDuration ? `${averageDuration} min` : "—"}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {activeTab === "templates" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    {templates.length ? (
                      <span>{templates.length} curated templates ready to use.</span>
                    ) : (
                      <span>No templates yet. Create one to kickstart your library.</span>
                    )}
                  </div>
                  <Dialog open={templateDialogOpen} onOpenChange={(open) => {
                    setTemplateDialogOpen(open)
                    if (!open) templateForm.reset(defaultTemplateValues)
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-primary text-primary-foreground"
                        disabled={!canCreateTemplate}
                        title={!canCreateTemplate ? "Create a sub-category first" : undefined}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        New Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">

                      <DialogHeader>
                        <DialogTitle>Create Template</DialogTitle>
                        <DialogDescription>Describe the interview template you want to add.</DialogDescription>
                      </DialogHeader>
                      <Form {...templateForm}>
                        <form onSubmit={templateForm.handleSubmit(handleCreateTemplate)} className="space-y-4">
                          <FormField
                            control={templateForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Senior Backend Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={templateForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add a short summary to help admins pick the right template."
                                    rows={4}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>Optional but recommended.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={templateForm.control}
                              name="estimatedDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estimated Duration (minutes)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={5}
                                      max={240}
                                      placeholder="30"
                                      value={field.value ?? ""}
                                      onChange={(event) => field.onChange(event.target.value)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={templateForm.control}
                              name="subCategoryId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sub-Category</FormLabel>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select sub-category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {mainCategories.map((mainCategory) => {
                                        const relatedSubCategories = subCategories.filter(
                                          (sub) => sub.mainCategory.mainCategoryId === mainCategory.mainCategoryId
                                        )

                                        if (!relatedSubCategories.length) return null

                                        return (
                                          <SelectGroup key={mainCategory.mainCategoryId}>
                                            <SelectLabel>{mainCategory.name}</SelectLabel>
                                            {relatedSubCategories.map((sub) => (
                                              <SelectItem key={sub.subCategoryId} value={sub.subCategoryId}>
                                                {sub.name}
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        )
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={templateForm.control}
                            name="tagIds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormDescription>Select multiple tags to highlight skills.</FormDescription>
                                <div className="flex flex-wrap gap-2">
                                  {tags.length ? (
                                    tags.map((tag) => {
                                      const isSelected = field.value?.includes(tag.id)
                                      return (
                                        <Button
                                          key={tag.id}
                                          type="button"
                                          variant={isSelected ? "default" : "outline"}
                                          size="sm"
                                          className={isSelected ? "bg-primary text-primary-foreground" : undefined}
                                          onClick={() => {
                                            if (isSelected) {
                                              field.onChange(field.value.filter((value) => value !== tag.id))
                                            } else {
                                              field.onChange([...(field.value ?? []), tag.id])
                                            }
                                          }}
                                        >
                                          {tag.name}
                                        </Button>
                                      )
                                    })
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      No tags yet. Create one from the Tags tab.
                                    </p>
                                  )}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button type="submit" disabled={templateSubmitting || !canCreateTemplate}>
                              {templateSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Create template
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTemplates.length ? (
                      paginatedTemplates.map((template) => (
                        <TableRow key={template.interviewTemplateId}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{template.title}</p>
                              {template.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">{template.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{template.subCategory.name}</span>
                              <span className="text-xs text-muted-foreground">{template.subCategory.mainCategory.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.length ? (
                                template.tags.map((tag) => (
                                  <Badge key={tag.id} variant="secondary">
                                    {tag.name}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline">No tags</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{template.estimatedDuration} min</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem disabled>Edit (coming soon)</DropdownMenuItem>
                                <DropdownMenuItem disabled variant="destructive">
                                  Remove (coming soon)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No templates yet. Use the “New Template” button to add one.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={templatePage}
                  totalPages={templateTotalPages}
                  onPageChange={setTemplatePage}
                  className="pt-2"
                />
              </div>
            )}

            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Main Categories</CardTitle>
                        <p className="text-sm text-muted-foreground">Group roles at the highest level.</p>
                      </div>
                      <Dialog open={mainDialogOpen} onOpenChange={(open) => {
                        setMainDialogOpen(open)
                        if (!open) mainCategoryForm.reset(defaultMainCategoryValues)
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>New Main Category</DialogTitle>
                          </DialogHeader>
                          <Form {...mainCategoryForm}>
                            <form onSubmit={mainCategoryForm.handleSubmit(handleCreateMainCategory)} className="space-y-4">
                              <FormField
                                control={mainCategoryForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Technology, Product, Growth..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit" disabled={mainSubmitting}>
                                  {mainSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Create category
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {paginatedMainCategories.length ? (
                        paginatedMainCategories.map((category) => (
                          <div
                            key={category.mainCategoryId}
                            className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3"
                          >
                            <div>
                              <p className="font-medium">{category.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {category.subCategories.length} sub-category
                                {category.subCategories.length === 1 ? "" : "ies"}
                              </p>
                            </div>
                            <Badge variant="outline">{category.subCategories.length}</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No main categories yet.</p>
                      )}
                      <PaginationControls
                        page={mainCategoryPage}
                        totalPages={mainCategoryTotalPages}
                        onPageChange={setMainCategoryPage}
                        className="pt-1"
                      />
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Sub-Categories</CardTitle>
                        <p className="text-sm text-muted-foreground">Map roles under each main category.</p>
                      </div>
                      <Dialog open={subDialogOpen} onOpenChange={(open) => {
                        setSubDialogOpen(open)
                        if (!open) subCategoryForm.reset(defaultSubCategoryValues)
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" disabled={!canCreateSubCategory} title={!canCreateSubCategory ? "Create a main category first" : undefined}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>New Sub-Category</DialogTitle>
                          </DialogHeader>
                          <Form {...subCategoryForm}>
                            <form onSubmit={subCategoryForm.handleSubmit(handleCreateSubCategory)} className="space-y-4">
                              <FormField
                                control={subCategoryForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Frontend, Data Science..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={subCategoryForm.control}
                                name="mainCategoryId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Main Category</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={!mainCategories.length}>
                                      <FormControl>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select a main category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {mainCategories.map((category) => (
                                          <SelectItem key={category.mainCategoryId} value={category.mainCategoryId}>
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit" disabled={subSubmitting || !canCreateSubCategory}>
                                  {subSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Create sub-category
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {paginatedSubCategories.length ? (
                        paginatedSubCategories.map((sub) => (
                          <div
                            key={sub.subCategoryId}
                            className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3"
                          >
                            <div>
                              <p className="font-medium">{sub.name}</p>
                              <p className="text-xs text-muted-foreground">{sub.mainCategory.name}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">Add a main category, then start creating sub-categories.</p>
                      )}
                      <PaginationControls
                        page={subCategoryPage}
                        totalPages={subCategoryTotalPages}
                        onPageChange={setSubCategoryPage}
                        className="pt-1"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "tags" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Tags keep templates searchable and on-theme. Add as many as you need.
                  </p>
                  <Dialog open={tagDialogOpen} onOpenChange={(open) => {
                    setTagDialogOpen(open)
                    if (!open) tagForm.reset(defaultTagValues)
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Tag
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Tag</DialogTitle>
                      </DialogHeader>
                      <Form {...tagForm}>
                        <form onSubmit={tagForm.handleSubmit(handleCreateTag)} className="space-y-4">
                          <FormField
                            control={tagForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tag name</FormLabel>
                                <FormControl>
                                  <Input placeholder="System Design, Leadership..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit" disabled={tagSubmitting}>
                              {tagSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Create tag
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag</TableHead>
                      <TableHead>Templates using it</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTags.length ? (
                      paginatedTags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell className="font-medium">{tag.name}</TableCell>
                          <TableCell>{tagUsageMap.get(tag.id) || 0}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No tags yet. Create your first tag to start organizing templates.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={tagPage}
                  totalPages={tagTotalPages}
                  onPageChange={setTagPage}
                  className="pt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
