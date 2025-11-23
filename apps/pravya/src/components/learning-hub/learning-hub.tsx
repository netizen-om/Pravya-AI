"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileQuestion, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionCard } from "./question-card";
import { getLearningHubQuestions, type LearningHubQuestion, type MainCategory } from "@/actions/learning-hub-action";
import { BackButton } from "../BackButton";

export function LearningHubPage() {
  const [questions, setQuestions] = useState<LearningHubQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<{ subCategoryId: string; name: string }[]>([]);

  // Update available subcategories when main category changes
  useEffect(() => {
    if (selectedMainCategory) {
      const mainCat = mainCategories.find(cat => cat.mainCategoryId === selectedMainCategory);
      if (mainCat) {
        setAvailableSubCategories(mainCat.subCategories);
      } else {
        setAvailableSubCategories([]);
      }
      // Reset subcategory when main category changes
      setSelectedSubCategory(null);
    } else {
      setAvailableSubCategories([]);
      setSelectedSubCategory(null);
    }
  }, [selectedMainCategory, mainCategories]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        const result = await getLearningHubQuestions({
          searchTerm: searchTerm || undefined,
          tagSearch: tagSearch || undefined,
          mainCategoryId: selectedMainCategory || undefined,
          subCategoryId: selectedSubCategory || undefined,
          page: currentPage,
          pageSize: 10,
        });
        
        setQuestions(result.questions);
        setTotalPages(result.totalPages);
        setMainCategories(result.mainCategories);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchQuestions();
    }, (searchTerm || tagSearch) ? 500 : 0); // Debounce search

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, tagSearch, selectedMainCategory, selectedSubCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <BackButton />
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Learning Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse, search, and practice questions from our entire library.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Inputs */}
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Question Text Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by question text..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-11"
              />
            </div>

            {/* Tag Search */}
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by tags..."
                value={tagSearch}
                onChange={(e) => {
                  setTagSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-col gap-3 md:flex-row">
            {/* Main Category Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full md:w-auto bg-transparent"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedMainCategory 
                    ? mainCategories.find(cat => cat.mainCategoryId === selectedMainCategory)?.name || "Main Category"
                    : "Main Category"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <Command>
                  <CommandInput placeholder="Search main category..." />
                  <CommandGroup>
                    <CommandItem onSelect={() => {
                      setSelectedMainCategory(null);
                      setSelectedSubCategory(null);
                      setCurrentPage(1);
                    }}>
                      All Main Categories
                    </CommandItem>
                    {mainCategories.map((category) => (
                      <CommandItem
                        key={category.mainCategoryId}
                        onSelect={() => {
                          setSelectedMainCategory(
                            category.mainCategoryId === selectedMainCategory ? null : category.mainCategoryId
                          );
                          setCurrentPage(1);
                        }}
                      >
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Sub Category Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full md:w-auto bg-transparent"
                  disabled={!selectedMainCategory}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedSubCategory 
                    ? availableSubCategories.find(sub => sub.subCategoryId === selectedSubCategory)?.name || "Sub Category"
                    : "Sub Category"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <Command>
                  <CommandInput placeholder="Search sub category..." />
                  <CommandGroup>
                    <CommandItem onSelect={() => {
                      setSelectedSubCategory(null);
                      setCurrentPage(1);
                    }}>
                      All Sub Categories
                    </CommandItem>
                    {availableSubCategories.map((subCategory) => (
                      <CommandItem
                        key={subCategory.subCategoryId}
                        onSelect={() => {
                          setSelectedSubCategory(
                            subCategory.subCategoryId === selectedSubCategory ? null : subCategory.subCategoryId
                          );
                          setCurrentPage(1);
                        }}
                      >
                        {subCategory.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="p-6">
                    <Skeleton className="mb-3 h-6 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : questions.length === 0 ? (
            <div className="py-24 text-center">
              <FileQuestion className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-2xl font-semibold text-foreground">
                No Questions Found
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <QuestionCard question={question} />
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && questions.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </motion.div>
  );
}
