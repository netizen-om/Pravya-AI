"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileQuestion } from "lucide-react";
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

const MOCK_QUESTIONS = [
  {
    id: 1,
    questionText:
      "What is the difference between useState and useReducer in React?",
    category: "Frontend",
    tags: ["React", "Hooks"],
  },
  {
    id: 2,
    questionText: "How do you implement server-side rendering in Next.js?",
    category: "Backend",
    tags: ["Next.js", "SSR"],
  },
  {
    id: 3,
    questionText: "Explain the concept of closures in JavaScript",
    category: "Frontend",
    tags: ["JavaScript", "Fundamentals"],
  },
  {
    id: 4,
    questionText: "What is the purpose of middleware in Express.js?",
    category: "Backend",
    tags: ["Node.js", "Express"],
  },
  {
    id: 5,
    questionText: "How do you optimize bundle size in a React application?",
    category: "Frontend",
    tags: ["React", "Performance"],
  },
];

const CATEGORIES = [
  "Frontend",
  "Backend",
  "System Design",
  "Database",
  "DevOps",
];
const TAGS = [
  "React",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Performance",
];

export function LearningHubPage() {
  const [questions, setQuestions] = useState<typeof MOCK_QUESTIONS>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = MOCK_QUESTIONS;

      if (searchTerm) {
        filtered = filtered.filter((q) =>
          q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedCategory) {
        filtered = filtered.filter((q) => q.category === selectedCategory);
      }
      if (selectedTag) {
        filtered = filtered.filter((q) => q.tags.includes(selectedTag));
      }

      setQuestions(filtered);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, selectedCategory, selectedTag]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
        <div className="mb-8 flex flex-col gap-3 md:flex-row">
          {/* Search Input */}
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

          {/* Category Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full md:w-auto bg-transparent"
              >
                <Filter className="mr-2 h-4 w-4" />
                {selectedCategory || "Category"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandGroup>
                  <CommandItem onSelect={() => setSelectedCategory(null)}>
                    All Categories
                  </CommandItem>
                  {CATEGORIES.map((category) => (
                    <CommandItem
                      key={category}
                      onSelect={() => {
                        setSelectedCategory(
                          category === selectedCategory ? null : category
                        );
                        setCurrentPage(1);
                      }}
                    >
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Tag Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full md:w-auto bg-transparent"
              >
                <Filter className="mr-2 h-4 w-4" />
                {selectedTag || "Tag"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <Command>
                <CommandInput placeholder="Search tag..." />
                <CommandGroup>
                  <CommandItem onSelect={() => setSelectedTag(null)}>
                    All Tags
                  </CommandItem>
                  {TAGS.map((tag) => (
                    <CommandItem
                      key={tag}
                      onSelect={() => {
                        setSelectedTag(tag === selectedTag ? null : tag);
                        setCurrentPage(1);
                      }}
                    >
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
