"use client";

import { useState } from "react";
import { Mic, Sparkles, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample resume data with images
const RESUMES = [
  {
    id: "resume1",
    name: "Software_Engineer_v4.pdf",
    image: "/software-engineer-resume.png",
  },
  {
    id: "resume2",
    name: "Product_Manager_v2.pdf",
    image: "/product-manager-resume.png",
  },
  {
    id: "resume3",
    name: "Data_Scientist_Final.pdf",
    image: "/data-scientist-resume.jpg",
  },
];

export function PersonalisedInterviewDialog() {
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [fullscreenResume, setFullscreenResume] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(4);

  const handleGenerate = () => {
    if (selectedResume) {
      console.log("Starting interview with resume:", selectedResume);
      console.  log("Number of questions:", questionCount);
      setOpen(false);
      setSelectedResume("");
      setQuestionCount(4);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white">
            <Sparkles className="w-4 h-4" />
            Start Personalised Interview
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Personalised Interview</DialogTitle>
            <DialogDescription>
              Select one of your uploaded resumes, choose how many questions you
              want, and Pravya AI will tailor the interview.
            </DialogDescription>
          </DialogHeader>

          {/* Question Count Dropdown */}
          {/* Question Count Dropdown (ShadCN) */}
          <div className="mt-2">
            <label className="text-sm font-medium mb-2 block">
              Number of Questions
            </label>

            <Select
              value={String(questionCount)}
              onValueChange={(value) => setQuestionCount(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 Questions</SelectItem>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="6">6 Questions</SelectItem>
                <SelectItem value="7">7 Questions</SelectItem>
                <SelectItem value="8">8 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resume selection list */}
          <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {RESUMES.map((resume) => (
              <button
                key={resume.id}
                onClick={() => setSelectedResume(resume.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg border-2 transition-all ${
                  selectedResume === resume.id
                    ? "dark:border-white border-white bg-neutral-700/10 dark:bg-white/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    selectedResume === resume.id
                      ? "dark:border-neutral-500 dark:bg-neutral-500 border-neutral-100 bg-neutral-700"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                >
                  {selectedResume === resume.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                <img
                  src={resume.image || "/placeholder.svg"}
                  alt={resume.name}
                  className="w-14 h-20 object-cover rounded border border-neutral-200 dark:border-neutral-700"
                />

                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{resume.name}</p>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenResume(resume.image);
                  }}
                  className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="View resume"
                  onKeyDown={(e) =>
                    e.key === "Enter" && setFullscreenResume(resume.image)
                  }
                >
                  <Eye className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button
              className="gap-2 dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white"
              onClick={handleGenerate}
              disabled={!selectedResume}
            >
              <Mic className="w-4 h-4" />
              Generate & Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Resume View */}
      {fullscreenResume && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenResume(null)}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <img
            src={fullscreenResume || "/placeholder.svg"}
            alt="Resume fullscreen view"
            className="max-w-4xl max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
}
